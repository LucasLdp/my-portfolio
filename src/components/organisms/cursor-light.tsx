import { useEffect, useRef } from "react";

export function CursorLight() {
	const overlayRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const overlayElement = overlayRef.current;

		if (!overlayElement) {
			return undefined;
		}

		const pointerFine = window.matchMedia("(pointer: fine)").matches;
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!pointerFine || reducedMotion) {
			overlayElement.style.opacity = "0";
			return undefined;
		}

		let frame = 0;
		const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
		const current = { x: target.x, y: target.y };

		const render = () => {
			current.x += (target.x - current.x) * 0.12;
			current.y += (target.y - current.y) * 0.12;
			overlayElement.style.setProperty("--cursor-x", `${current.x}px`);
			overlayElement.style.setProperty("--cursor-y", `${current.y}px`);
			frame = window.requestAnimationFrame(render);
		};

		const handleMove = (event: MouseEvent) => {
			target.x = event.clientX;
			target.y = event.clientY;
			overlayElement.style.opacity = "1";
		};

		const handleLeave = () => {
			overlayElement.style.opacity = "0.4";
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseleave", handleLeave);
		frame = window.requestAnimationFrame(render);

		return () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseleave", handleLeave);
			window.cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div
			ref={overlayRef}
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
			style={{
				opacity: 0,
				background:
					"radial-gradient(circle 260px at var(--cursor-x, 50vw) var(--cursor-y, 20vh), rgba(74, 222, 128, 0.15), transparent 68%)",
			}}
		/>
	);
}
