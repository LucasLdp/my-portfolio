import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const asciiArtworks = [
	{
		label: "terminal",
		art: `
┌──────────────────────────┐
│ lucas@dev ~/workspace    │
│ $ npm run dev            │
│                          │
│   ready in 240 ms        │
│   Local: localhost:3000  │
└──────────────────────────┘`,
	},
	{
		label: "git",
		art: String.raw`
         o---o---o  main
        /         \
o---o--o           o  feat
        \         /
         o---o---o`,
	},
	{
		label: "code",
		art: `
const dev = {
  name: "Lucas",
  role: "fullstack",
  stack: ["TS", "React"],
};

export default dev;`,
	},
	{
		label: "bug",
		art: String.raw`
       __     __
      /  \~~~/  \
     (    ^__^    )
      \  (oo)  /
       \_/  \_/
        |    |
      bug fixed`,
	},
	{
		label: "binary",
		art: `
01001100 01110101 01100011 01100001 01110011
01000111 01101111 01101101 01100101 01110011

   < / >   { }   [ ]   ( )   =>   ;`,
	},
] as const;

const rotationInterval = 6500;

export function HeroBackdrop() {
	const prefersReducedMotion = useReducedMotion();
	const [artworkIndex, setArtworkIndex] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) {
			return undefined;
		}

		const timer = window.setInterval(() => {
			setArtworkIndex((current) => (current + 1) % asciiArtworks.length);
		}, rotationInterval);

		return () => window.clearInterval(timer);
	}, [prefersReducedMotion]);

	const artwork = asciiArtworks[artworkIndex];

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div className="hero-grid absolute inset-0" />

			<div className="absolute inset-0 grid place-items-center px-4">
				<AnimatePresence initial={false}>
					<motion.pre
						key={artwork.label}
						initial={{
							opacity: 0,
							scale: prefersReducedMotion ? 1 : 0.97,
							filter: "blur(6px)",
						}}
						animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
						exit={{
							opacity: 0,
							scale: prefersReducedMotion ? 1 : 1.03,
							filter: "blur(6px)",
						}}
						transition={{
							duration: prefersReducedMotion ? 0 : 0.9,
							ease: [0.16, 1, 0.3, 1],
						}}
						className="col-start-1 row-start-1 select-none whitespace-pre text-center font-mono text-[0.55rem] leading-tight text-emerald-300/[0.13] sm:text-[0.7rem] lg:text-[0.85rem]"
					>
						{artwork.art}
					</motion.pre>
				</AnimatePresence>
			</div>
		</div>
	);
}
