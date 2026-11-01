import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ScrollTypewriterProps = {
	text: string;
	className?: string;
};

export function ScrollTypewriter({ text, className }: ScrollTypewriterProps) {
	const elementRef = useRef<HTMLParagraphElement | null>(null);
	const [hasEntered, setHasEntered] = useState(false);
	const [visibleCharacters, setVisibleCharacters] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) {
			setHasEntered(true);
			setVisibleCharacters(text.length);
			return undefined;
		}

		const element = elementRef.current;

		if (!element) {
			return undefined;
		}

		if (!("IntersectionObserver" in window)) {
			setHasEntered(true);
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setHasEntered(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [reduceMotion, text.length]);

	useEffect(() => {
		if (!hasEntered || reduceMotion || visibleCharacters >= text.length) {
			return undefined;
		}

		const timer = window.setTimeout(() => {
			setVisibleCharacters((current) => Math.min(text.length, current + 1));
		}, 13);

		return () => window.clearTimeout(timer);
	}, [hasEntered, reduceMotion, text.length, visibleCharacters]);

	const visibleText = reduceMotion ? text : text.slice(0, visibleCharacters);

	return (
		<p ref={elementRef} className={`relative ${className ?? ""}`}>
			<span className="invisible" aria-hidden="true">
				<span className="text-emerald-300">$ </span>
				{text}
			</span>
			<span className="sr-only">{text}</span>
			<span className="absolute inset-0" aria-hidden="true">
				<span className="text-emerald-300">$ </span>
				{visibleText}
				{hasEntered && visibleCharacters < text.length && (
					<span className="terminal-cursor" />
				)}
			</span>
		</p>
	);
}
