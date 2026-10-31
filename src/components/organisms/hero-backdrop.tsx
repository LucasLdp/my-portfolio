import { useEffect, useRef } from "react";
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

type FloatingGlyph = {
	x: number;
	y: number;
	speed: number;
	phase: number;
	char: string;
	size: number;
	alpha: number;
};

type AmbientMotif = {
	x: number;
	y: number;
	speed: number;
	phase: number;
	size: number;
	kind: "firefly" | "seed";
};

function seeded(index: number) {
	const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
	return value - Math.floor(value);
}

export function HeroBackdrop() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
		let glow: CanvasGradient | null = null;
		let windStreams: WindStream[] = [];
		let floatingGlyphs: FloatingGlyph[] = [];
		let ambientMotifs: AmbientMotif[] = [];
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

			if (glow) {
				context.fillStyle = glow;
				context.fillRect(0, height * 0.55, width, height * 0.45);
			}

			context.textAlign = "center";
			context.textBaseline = "middle";

			const seconds = time * 0.001;
			const compact = width < 640;

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
					Math.sin(seconds * 0.55 + stream.phase) * (compact ? 6 : 10) -
					interaction * 14;
				const glyphs = ["~", "~", "-", "~", ">"];

				for (let index = 0; index < stream.length; index += 1) {
					const fade = 1 - index / (stream.length + 1);
					context.globalAlpha = stream.alpha * fade * (1 + interaction * 1.8);
					context.fillStyle =
						index === stream.length - 1 || interaction > 0.35
							? "#34d399"
							: "#10b981";
					context.fillText(
						glyphs[index % glyphs.length],
						x - index * (compact ? 9 : 11),
						y + Math.sin(seconds * 0.9 + index * 0.8 + stream.phase) * 4,
					);
				}
			}

			for (const glyph of floatingGlyphs) {
				const floatRange = height * 0.72;
				const driftX =
					((glyph.x + seconds * glyph.speed) % (width + 24)) -
					glyph.x +
					Math.sin(seconds * 0.55 + glyph.phase) * 20;
				const driftY =
					(((glyph.y - height * 0.06 - seconds * glyph.speed) % floatRange) +
						floatRange) %
					floatRange;
				const y = height * 0.06 + driftY;
				context.globalAlpha =
					glyph.alpha * (0.78 + 0.22 * Math.sin(seconds * 1.4 + glyph.phase));
				context.fillStyle = glyph.char === "*" ? "#34d399" : "#10b981";
				context.font = `${glyph.size}px ${MONOSPACE_FONT}`;
				context.fillText(
					glyph.char,
					glyph.x + driftX,
					y + Math.sin(seconds * 0.55 + glyph.phase * 1.7) * 7,
				);
			}

			for (const [index, motif] of ambientMotifs.entries()) {
				const motifX = ((motif.x + seconds * motif.speed) % (width + 48)) - 24;
				const motifY =
					motif.y +
					Math.sin(seconds * 0.42 + motif.phase) * 13 +
					Math.cos(seconds * 0.2 + motif.phase) * 5;
				const distance = pointer.active
					? Math.hypot(pointer.x - motifX, pointer.y - motifY)
					: Number.POSITIVE_INFINITY;
				const response = Math.max(0, 1 - distance / (pointer.radius * 1.8));
				const pulse = 0.72 + 0.28 * Math.sin(seconds * 1.7 + motif.phase);
				const alpha = Math.min(0.72, (0.18 + response * 0.34) * pulse);
				const unit = Math.max(5, motif.size * 0.58);

				context.font = `${motif.size}px ${MONOSPACE_FONT}`;
				context.fillStyle = motif.kind === "firefly" ? "#a7f3d0" : "#6ee7b7";
				context.globalAlpha = alpha;
				context.shadowColor = "rgba(52, 211, 153, 0.45)";
				context.shadowBlur = response > 0.1 ? 9 : 4;

				const marks =
					motif.kind === "firefly"
						? ([
								[".", 0, -1],
								[":", -1, 0],
								["*", 0, 0],
								[":", 1, 0],
								[".", 0, 1],
							] as const)
						: ([
								[".", -2, 0],
								["-", -1, 0],
								["o", 0, 0],
								[">", 1, 0],
								[".", 2, 0],
							] as const);

				for (const [char, offsetX, offsetY] of marks) {
					context.fillText(
						char,
						motifX + offsetX * unit,
						motifY + offsetY * unit,
					);
				}

				// Some seeds occasionally leave a tiny dotted trail in their wake.
				if (motif.kind === "seed" && index % 2 === 0) {
					context.globalAlpha = alpha * 0.48;
					context.fillText("..", motifX - unit * 3.4, motifY + unit * 0.5);
				}
			}
			context.shadowBlur = 0;

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
					const highlighted = blade.press > 0.35;

					context.globalAlpha = alpha;
					context.fillStyle = highlighted ? layer.tipColor : layer.color;

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

			context.globalAlpha = 1;
		};

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
			const streamCount = compact ? 15 : Math.min(38, Math.round(width / 38));
			windStreams = Array.from({ length: streamCount }, (_, index) => ({
				x: seeded(index + 2) * width,
				y: height * (0.05 + seeded(index + 47) * 0.68),
				length: 4 + Math.floor(seeded(index + 91) * (compact ? 4 : 7)),
				speed: 18 + seeded(index + 133) * 32,
				phase: seeded(index + 177) * Math.PI * 2,
				alpha: 0.12 + seeded(index + 211) * 0.1,
			}));
			const glyphCount = compact ? 32 : Math.min(80, Math.round(width / 18));
			floatingGlyphs = Array.from({ length: glyphCount }, (_, index) => {
				const roll = seeded(index + 263);
				return {
					x: seeded(index + 307) * width,
					y: height * (0.05 + seeded(index + 353) * 0.7),
					speed: 2 + seeded(index + 397) * 5,
					phase: seeded(index + 443) * Math.PI * 2,
					char: roll > 0.84 ? "*" : roll > 0.58 ? ":" : ".",
					size: compact
						? 10 + seeded(index + 509) * 3
						: 11 + seeded(index + 509) * 5,
					alpha: 0.14 + seeded(index + 487) * 0.14,
				};
			});
			const motifCount = compact ? 8 : Math.min(18, Math.round(width / 82));
			ambientMotifs = Array.from({ length: motifCount }, (_, index) => ({
				x: seeded(index + 541) * width,
				y: height * (0.12 + seeded(index + 587) * 0.62),
				speed: 5 + seeded(index + 631) * 10,
				phase: seeded(index + 677) * Math.PI * 2,
				size: compact
					? 11 + seeded(index + 719) * 3
					: 13 + seeded(index + 719) * 5,
				kind: seeded(index + 761) > 0.58 ? "seed" : "firefly",
			}));

			glow = context.createLinearGradient(0, height * 0.55, 0, height);
			glow.addColorStop(0, "rgba(16, 185, 129, 0)");
			glow.addColorStop(0.7, "rgba(16, 185, 129, 0.03)");
			glow.addColorStop(1, "rgba(16, 185, 129, 0.085)");

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
