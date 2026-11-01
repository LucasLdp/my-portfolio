import { useEffect, useRef } from "react";
import type { AmbientTheme } from "#/components/atoms/ambient-theme-toggle";
import {
	createGrassField,
	type GrassField,
	type GrassPointer,
	impulseGrassField,
	settleGrassField,
	stepGrassField,
} from "#/lib/ascii-grass";

const FRAME_INTERVAL = 1000 / 35;
const PHYSICS_STEP = 1 / 60;
const PHYSICS_STEP_MS = PHYSICS_STEP * 1000;
const MAX_DEVICE_PIXEL_RATIO = 2;

const MONOSPACE_FONT =
	'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

type WindStream = {
	x: number;
	y: number;
	length: number;
	speed: number;
	phase: number;
	alpha: number;
};

type Flower = {
	layerIndex: number;
	bladeIndex: number;
};

type Petal = {
	flowerIndex: number;
	phase: number;
	speed: number;
	drift: number;
	char: string;
};

function seeded(index: number) {
	const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
	return value - Math.floor(value);
}

export function HeroBackdrop({ theme }: { theme: AmbientTheme }) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const themeRef = useRef(theme);
	const renderRef = useRef<((time: number) => void) | null>(null);

	useEffect(() => {
		themeRef.current = theme;
		renderRef.current?.(window.performance.now());
	}, [theme]);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;

		if (!container || !canvas) {
			return undefined;
		}

		const context = canvas.getContext("2d");

		if (!context) {
			return undefined;
		}

		const reducedMotionQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let reducedMotion = reducedMotionQuery.matches;

		let width = 0;
		let height = 0;
		let pixelRatio = 1;
		let field: GrassField | null = null;
		let sunGlow: CanvasGradient | null = null;
		let moonGlow: CanvasGradient | null = null;
		let windStreams: WindStream[] = [];
		let flowers: Flower[] = [];
		let petals: Petal[] = [];
		let frameId = 0;
		let resizeFrameId = 0;
		let lastFrameAt = 0;
		let lastDrawAt = 0;
		let accumulator = 0;
		let windTime = 0;
		let isVisible = true;
		let isDestroyed = false;

		const pointer: GrassPointer = {
			x: 0,
			y: 0,
			active: false,
			pressed: false,
			radius: 130,
		};

		const now = () => window.performance.now();

		const render = (time: number) => {
			if (!field) {
				return;
			}

			context.clearRect(0, 0, width, height);
			context.globalAlpha = 1;

			const seconds = time * 0.001;
			const compact = width < 640;
			const activeTheme = themeRef.current;
			const isSunlit = activeTheme === "sun";
			const lightSourceX = width * 0.42;
			const glow = isSunlit ? sunGlow : moonGlow;

			if (glow) {
				context.fillStyle = glow;
				context.fillRect(0, height * 0.55, width, height * 0.45);
			}

			context.textAlign = "center";
			context.textBaseline = "middle";

			// A few wandering ASCII currents give the open sky some depth without
			// competing with the hero copy or terminal.
			context.font = `${compact ? 11 : 13}px ${MONOSPACE_FONT}`;
			for (const stream of windStreams) {
				const travel = (seconds * stream.speed) % (width + 100);
				const x = ((stream.x + travel) % (width + 100)) - 50;
				const distance = pointer.active
					? Math.hypot(pointer.x - x, (pointer.y - stream.y) * 0.7)
					: Number.POSITIVE_INFINITY;
				const interaction = Math.max(0, 1 - distance / (pointer.radius * 1.3));
				const y =
					stream.y +
					Math.sin(seconds * 0.8 + stream.phase) * (compact ? 10 : 16) -
					interaction * 18;
				const glyphs = isSunlit
					? ["~", "~", "-", ">", "."]
					: ["~", ":", "-", ">", "~"];

				for (let index = 0; index < stream.length; index += 1) {
					const fade = 1 - index / (stream.length + 1);
					context.globalAlpha = Math.min(
						0.72,
						stream.alpha * fade * (1 + interaction * 1.8),
					);
					context.fillStyle = isSunlit
						? index === stream.length - 1 || interaction > 0.35
							? "#365314"
							: "#166534"
						: index === stream.length - 1 || interaction > 0.35
							? "#a7f3d0"
							: "#34d399";
					context.fillText(
						glyphs[index % glyphs.length],
						x - index * (compact ? 9 : 11),
						y + Math.sin(seconds * 1.25 + index * 0.8 + stream.phase) * 6,
					);
				}
			}

			if (isSunlit) {
				const petalColors = ["#be185d", "#c2410c", "#7e22ce", "#b45309"];

				// Every simulated grass blade becomes a flower stalk by day. Drawing
				// the same segments means stems inherit the exact same wind physics.
				for (const layer of field.layers) {
					context.font = `${layer.fontSize}px ${MONOSPACE_FONT}`;
					for (const blade of layer.blades) {
						const sway = Math.sin(blade.angle);
						const stemHeight = blade.height * (1 - blade.press * 0.14);
						context.globalAlpha = Math.min(
							0.94,
							Math.max(0.58, blade.alpha * 1.8),
						);
						context.fillStyle = "#166534";
						for (let segment = 0; segment < blade.segments; segment += 1) {
							const t = (segment + 1) / blade.segments;
							context.fillText(
								"|",
								blade.x + sway * stemHeight * t * t,
								blade.baseY - stemHeight * t,
							);
						}
					}
				}

				context.textAlign = "center";
				for (const [flowerIndex, flower] of flowers.entries()) {
					const layer = field.layers[flower.layerIndex];
					const blade = layer?.blades[flower.bladeIndex];
					if (!layer || !blade) continue;

					const sway = Math.sin(blade.angle);
					const stemHeight = blade.height * (1 - blade.press * 0.14);
					const tipX = blade.x + sway * stemHeight;
					const tipY = blade.baseY - stemHeight;
					const fontSize = Math.max(6, layer.fontSize * 0.58);
					const lineHeight = fontSize * 0.9;
					const petalColor =
						petalColors[flowerIndex % petalColors.length] ?? "#be185d";

					context.font = `${fontSize}px ${MONOSPACE_FONT}`;
					context.globalAlpha = Math.min(
						0.95,
						Math.max(0.64, blade.alpha * 1.9),
					);
					context.fillStyle = petalColor;
					context.fillText("  .-.-.  ", tipX, tipY - lineHeight * 2);
					context.fillText(" .:*:*:. ", tipX, tipY - lineHeight);
					context.fillText(":*:*:*:", tipX, tipY);
					context.fillText(" .:*:. ", tipX, tipY + lineHeight);
					context.fillStyle = "#854d0e";
					context.fillText("@", tipX, tipY);

					if (flowerIndex % 4 === 0) {
						context.fillStyle = "#166534";
						context.fillText(
							"<",
							tipX - fontSize * 1.4,
							tipY + stemHeight * 0.46,
						);
						context.fillText(
							">",
							tipX + fontSize * 1.4,
							tipY + stemHeight * 0.68,
						);
					}
				}

				context.font = `${compact ? 10 : 12}px ${MONOSPACE_FONT}`;
				for (const petal of petals) {
					const flower = flowers[petal.flowerIndex];
					const blade = flower
						? field.layers[flower.layerIndex]?.blades[flower.bladeIndex]
						: undefined;
					if (!flower || !blade) continue;

					const sway = Math.sin(blade.angle);
					const stemHeight = blade.height * (1 - blade.press * 0.14);
					const travel =
						(seconds * petal.speed + petal.phase) % (height * 0.72);
					const gust = Math.sin(seconds * 0.72 + petal.phase) * 8;
					const x =
						blade.x +
						sway * stemHeight +
						Math.sin(seconds * 1.15 + petal.phase) * 24 +
						petal.drift * travel +
						gust;
					const y = blade.baseY - stemHeight - 16 + travel;
					if (y > height || x < 0 || x > width) continue;

					context.globalAlpha =
						0.58 + 0.28 * Math.sin(seconds * 1.4 + petal.phase);
					context.fillStyle = petal.char === "*" ? "#be185d" : "#9d174d";
					context.fillText(petal.char, x, y);
				}
			} else {
				for (const layer of field.layers) {
					context.font = `${layer.fontSize}px ${MONOSPACE_FONT}`;
					for (const blade of layer.blades) {
						const sway = Math.sin(blade.angle);
						const bladeHeight = blade.height * (1 - blade.press * 0.14);
						const shimmer = 0.9 + 0.1 * Math.sin(seconds * 1.35 + blade.phase);
						const alpha = Math.min(
							1,
							blade.alpha * shimmer * (1 + blade.press * 0.7),
						);
						context.globalAlpha = alpha;
						context.fillStyle =
							blade.press > 0.35 ? layer.tipColor : layer.color;
						for (let index = 0; index < blade.segments; index += 1) {
							const t = (index + 1) / blade.segments;
							const x = blade.x + sway * bladeHeight * t * t;
							const y = blade.baseY - bladeHeight * t;
							if (index === blade.segments - 1) {
								context.fillStyle = layer.tipColor;
								context.globalAlpha = Math.min(1, alpha * 1.15);
							}
							context.fillText("|", x, y);
						}
					}
				}
			}

			// Moonlit glints remain only with the nighttime grass field.
			if (!isSunlit) {
				context.font = `${compact ? 8 : 10}px ${MONOSPACE_FONT}`;
				context.fillStyle = "#a7f3d0";
				context.shadowColor = "rgba(110, 231, 183, 0.35)";
				context.shadowBlur = 3;

				for (let row = 0; row < 11; row += 1) {
					const spread = 9 + row * (compact ? 4 : 6);
					const y = height * 0.97 - row * (compact ? 12 : 15);

					for (let mark = 0; mark < 5; mark += 1) {
						const seed = row * 7 + mark + 881;
						const x =
							lightSourceX +
							(seeded(seed) - 0.5) * spread * 2 +
							Math.sin(seconds * 1.2 + seed) * 3;

						if (x < 0 || x > width) {
							continue;
						}

						context.globalAlpha =
							(0.12 + seeded(seed + 251) * 0.22) * (1 - row * 0.035);
						context.fillText([".", ":", "*", "'"][mark % 4] ?? ".", x, y);
					}
				}
			}

			context.globalAlpha = 1;
			context.shadowBlur = 0;
		};
		renderRef.current = render;

		const tick = (time: number) => {
			frameId = 0;

			if (isDestroyed || !isVisible || reducedMotion || !field) {
				return;
			}

			if (!lastFrameAt) {
				lastFrameAt = time;
			}

			const elapsed = Math.min(64, time - lastFrameAt);
			lastFrameAt = time;
			accumulator += elapsed;

			if (time - lastDrawAt >= FRAME_INTERVAL) {
				lastDrawAt = time;

				let steps = 0;

				while (accumulator >= PHYSICS_STEP_MS && steps < 3) {
					stepGrassField(field, PHYSICS_STEP, windTime, pointer);
					windTime += PHYSICS_STEP;
					accumulator -= PHYSICS_STEP_MS;
					steps += 1;
				}

				if (accumulator > PHYSICS_STEP_MS) {
					accumulator = 0;
				}

				render(time);
			}

			frameId = window.requestAnimationFrame(tick);
		};

		const startLoop = () => {
			if (frameId || isDestroyed || !isVisible || reducedMotion || !field) {
				return;
			}

			lastFrameAt = 0;
			frameId = window.requestAnimationFrame(tick);
		};

		const stopLoop = () => {
			if (frameId) {
				window.cancelAnimationFrame(frameId);
				frameId = 0;
			}
		};

		const pause = () => {
			stopLoop();
			lastFrameAt = 0;
			accumulator = 0;
		};

		const resume = () => {
			lastFrameAt = 0;
			lastDrawAt = 0;
			accumulator = 0;
			startLoop();
		};

		const rebuild = () => {
			if (isDestroyed) {
				return;
			}

			const rect = container.getBoundingClientRect();

			if (rect.width < 2 || rect.height < 2) {
				return;
			}

			const nextWidth = Math.max(1, Math.round(rect.width));
			const nextHeight = Math.max(1, Math.round(rect.height));
			const nextPixelRatio = Math.min(
				window.devicePixelRatio || 1,
				MAX_DEVICE_PIXEL_RATIO,
			);

			if (
				nextWidth === width &&
				nextHeight === height &&
				nextPixelRatio === pixelRatio &&
				field
			) {
				return;
			}

			width = nextWidth;
			height = nextHeight;
			pixelRatio = nextPixelRatio;
			canvas.width = Math.max(1, Math.round(width * pixelRatio));
			canvas.height = Math.max(1, Math.round(height * pixelRatio));
			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

			pointer.radius = width < 640 ? 92 : Math.min(150, width * 0.11);
			field = createGrassField(width, height);
			const compact = width < 640;
			const streamCount = compact ? 20 : Math.min(48, Math.round(width / 30));
			windStreams = Array.from({ length: streamCount }, (_, index) => ({
				x: seeded(index + 2) * width,
				y: height * (0.05 + seeded(index + 47) * 0.68),
				length: 5 + Math.floor(seeded(index + 91) * (compact ? 5 : 8)),
				speed: 26 + seeded(index + 133) * 46,
				phase: seeded(index + 177) * Math.PI * 2,
				alpha: 0.2 + seeded(index + 211) * 0.14,
			}));
			flowers = field.layers.flatMap((layer, layerIndex) =>
				layer.blades.map((_, bladeIndex) => ({ layerIndex, bladeIndex })),
			);
			const petalCount = compact ? 20 : Math.min(54, Math.round(width / 22));
			petals = Array.from({ length: petalCount }, (_, index) => ({
				flowerIndex: Math.floor(seeded(index + 809) * flowers.length),
				phase: seeded(index + 953) * height * 0.72,
				speed: 24 + seeded(index + 997) * 38,
				drift: (seeded(index + 1049) - 0.5) * 0.72,
				char: ["*", ".", "'", ":"][index % 4] ?? ".",
			}));

			sunGlow = context.createLinearGradient(0, height * 0.55, 0, height);
			sunGlow.addColorStop(0, "rgba(132, 204, 22, 0)");
			sunGlow.addColorStop(0.7, "rgba(132, 204, 22, 0.025)");
			sunGlow.addColorStop(1, "rgba(132, 204, 22, 0.075)");
			moonGlow = context.createLinearGradient(0, height * 0.55, 0, height);
			moonGlow.addColorStop(0, "rgba(16, 185, 129, 0)");
			moonGlow.addColorStop(0.7, "rgba(16, 185, 129, 0.025)");
			moonGlow.addColorStop(1, "rgba(16, 185, 129, 0.07)");

			windTime = 0;
			accumulator = 0;
			lastFrameAt = 0;
			lastDrawAt = 0;

			if (reducedMotion) {
				settleGrassField(field, 0.9);
				render(900);
				return;
			}

			render(now());

			if (isVisible && !document.hidden) {
				startLoop();
			}
		};

		const scheduleRebuild = () => {
			if (resizeFrameId) {
				return;
			}

			resizeFrameId = window.requestAnimationFrame(() => {
				resizeFrameId = 0;
				rebuild();
			});
		};

		const readPointer = (event: PointerEvent) => {
			const rect = container.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			return {
				x,
				y,
				inside: x >= 0 && x <= rect.width && y >= 0 && y <= rect.height,
			};
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (reducedMotion) {
				return;
			}

			const local = readPointer(event);
			pointer.x = local.x;
			pointer.y = local.y;
			pointer.active =
				local.inside && (event.pointerType !== "touch" || pointer.pressed);
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (reducedMotion) {
				return;
			}

			const local = readPointer(event);

			if (!local.inside) {
				return;
			}

			pointer.x = local.x;
			pointer.y = local.y;
			pointer.active = true;
			pointer.pressed = true;

			if (field) {
				impulseGrassField(field, pointer, 2.2);
			}
		};

		const handlePointerUp = (event: PointerEvent) => {
			pointer.pressed = false;

			if (event.pointerType === "touch") {
				pointer.active = false;
			}
		};

		const handlePointerLeave = () => {
			pointer.active = false;
			pointer.pressed = false;
		};

		const handleVisibilityChange = () => {
			if (document.hidden) {
				pause();
				return;
			}

			if (isVisible && !reducedMotion) {
				resume();
			}
		};

		const handleReducedMotionChange = () => {
			reducedMotion = reducedMotionQuery.matches;

			if (reducedMotion) {
				stopLoop();
				pointer.active = false;
				pointer.pressed = false;

				if (field) {
					settleGrassField(field, 0.9);
					render(900);
				}

				return;
			}

			if (isVisible && !document.hidden) {
				resume();
			}
		};

		const resizeObserver = new ResizeObserver(scheduleRebuild);
		resizeObserver.observe(container);

		const intersectionObserver = new IntersectionObserver(
			(entries) => {
				const entry = entries.at(0);
				isVisible = entry?.isIntersecting ?? false;

				if (isVisible && !document.hidden && !reducedMotion) {
					resume();
				} else {
					pause();
				}
			},
			{ threshold: 0.01 },
		);
		intersectionObserver.observe(container);

		window.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});
		window.addEventListener("pointerdown", handlePointerDown, {
			passive: true,
		});
		window.addEventListener("pointerup", handlePointerUp, { passive: true });
		window.addEventListener("pointercancel", handlePointerUp, {
			passive: true,
		});
		window.addEventListener("blur", handlePointerLeave);
		document.addEventListener("pointerleave", handlePointerLeave);
		document.addEventListener("mouseleave", handlePointerLeave);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("resize", scheduleRebuild);
		reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

		rebuild();

		return () => {
			isDestroyed = true;
			renderRef.current = null;
			stopLoop();

			if (resizeFrameId) {
				window.cancelAnimationFrame(resizeFrameId);
			}

			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointercancel", handlePointerUp);
			window.removeEventListener("blur", handlePointerLeave);
			document.removeEventListener("pointerleave", handlePointerLeave);
			document.removeEventListener("mouseleave", handlePointerLeave);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("resize", scheduleRebuild);
			reducedMotionQuery.removeEventListener(
				"change",
				handleReducedMotionChange,
			);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-emerald-500/[0.07] via-emerald-500/[0.02] to-transparent" />
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
		</div>
	);
}
