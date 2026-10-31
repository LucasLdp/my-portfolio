import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const asciiArtworks = [
	{
		label: "brackets",
		art: `
  ██╗    ██╗██╗
 ██╔╝   ██╔╝╚██╗
██╔╝   ██╔╝  ╚██╗
╚██╗  ██╔╝   ██╔╝
 ╚██╗██╔╝   ██╔╝
  ╚═╝╚═╝    ╚═╝

  <div className="dev">
    <Code stack={STACK} />
    <Coffee level="max" />
  </Dev>

  $ npm run dev
  ✓ ready in 240 ms
  ────────────────────────────
  { }  [ ]  ( )  =>  ;  //  /*
  01001100 01110101 01100011`,
	},
	{
		label: "dev",
		art: `
██████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝██║   ██║
██║  ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝
██████╔╝███████╗ ╚████╔╝
╚═════╝ ╚══════╝  ╚═══╝

const dev = {
  name: "Lucas",
  role: "fullstack",
  stack: ["TS", "React", "Node"],
};

$ git commit -m "ship it"`,
	},
	{
		label: "git",
		art: String.raw`
   ________________
  / ____/  _/_  __/
 / / __ / /  / /
/ /_/ // /  / /
\____/___/ /_/

    ● 4f2a1c3 (HEAD -> main)
    │ feat: ascii backdrop
    ● 9b1d7e2
   ╱ ╲
  ╱   ● a73c9f1 (origin/feat)
 ╱    │ chore: deps
●     ● 5e8b204
│     │ fix: cursor blink
●─────● 1c3f9aa (tag: v1.0.0)
│
● 0d4e6b7 init: portfolio`,
	},
	{
		label: "code",
		art: String.raw`
   ____ ___  ____  _____
  / ___/ _ \|  _ \| ____|
 | |  | | | | | | |  _|
 | |__| |_| | |_| | |___
  \____\___/|____/|_____|

   1  import { dev } from "./lucas";
   2  import { coffee } from "./fuel";
   3
   4  export function Hero() {
   5    const [stack] = useState(STACK);
   6    return <Code>{stack}</Code>;
   7  }
  ✓ compiled successfully in 240ms`,
	},
	{
		label: "bug",
		art: String.raw`
  ____  _   _  ____
 | __ )| | | |/ ___|
 |  _ \| | | | |  _
 | |_) | |_| | |_| |
 |____/ \___/ \____|

  [debug] tracing hero.tsx...
  → 0 errors    0 warnings
  ✓ build passed in 1.42s
  $ git push origin main
  remote: deployed to production
  ───────────────────────────
  { }  [ ]  ( )  =>  ;  //`,
	},
	{
		label: "404",
		art: String.raw`
  _  _    ___  _  _
 | || |  / _ \| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \___/   |_|

  $ npm run build
  ✓ 2273 modules transformed
  ✓ built in 1.47s
  $ git push origin main
  ✓ deployed`,
	},
] as const;

const glyphs = "<>/\\{}[]()=+-*_01#@%&|;:!?";
const rotationInterval = 6000;
const scrambleDuration = 950;
const scrambleTick = 45;

function toLines(art: string) {
	return art.replace(/^\n/, "").split("\n");
}

const maxRows = Math.max(
	...asciiArtworks.map(({ art }) => toLines(art).length),
);
const maxCols = Math.max(
	...asciiArtworks.map(({ art }) =>
		Math.max(...toLines(art).map((line) => line.length)),
	),
);

const paddedArtworks = asciiArtworks.map(({ art }) => {
	const lines = toLines(art);
	const artworkWidth = Math.max(...lines.map((line) => line.length));
	const leftPadding = Math.floor((maxCols - artworkWidth) / 2);
	const rightPadding = maxCols - artworkWidth - leftPadding;

	return Array.from({ length: maxRows }, (_, row) => {
		const line = (lines[row] ?? "").padEnd(artworkWidth, " ");

		return `${" ".repeat(leftPadding)}${line}${" ".repeat(rightPadding)}`;
	});
});

function cellThreshold(row: number, col: number, seed: number) {
	const noise = Math.sin(row * 127.1 + col * 311.7 + seed * 74.7) * 43758.5453;
	const fraction = noise - Math.floor(noise);

	return Math.min(0.96, 0.18 + fraction * 0.78 + (col / maxCols) * 0.12);
}

function randomGlyph() {
	return glyphs[Math.floor(Math.random() * glyphs.length)];
}

function scrambleArtwork(
	from: string[],
	to: string[],
	progress: number,
	seed: number,
) {
	return to
		.map((line, row) =>
			Array.from(line)
				.map((char, col) => {
					const sourceChar = from[row]?.[col] ?? " ";

					if (progress >= cellThreshold(row, col, seed)) {
						return char;
					}

					if (sourceChar === " " && char === " ") {
						return " ";
					}

					if (progress < 0.16 && sourceChar !== " ") {
						return sourceChar;
					}

					return randomGlyph();
				})
				.join(""),
		)
		.join("\n");
}

export function HeroBackdrop() {
	const prefersReducedMotion = useReducedMotion();
	const [artworkIndex, setArtworkIndex] = useState(0);
	const [renderedArtwork, setRenderedArtwork] = useState(() =>
		paddedArtworks[0].join("\n"),
	);
	const previousIndex = useRef(0);

	useEffect(() => {
		if (prefersReducedMotion) {
			return undefined;
		}

		const timer = window.setInterval(() => {
			setArtworkIndex((current) => (current + 1) % asciiArtworks.length);
		}, rotationInterval);

		return () => window.clearInterval(timer);
	}, [prefersReducedMotion]);

	useEffect(() => {
		const target = paddedArtworks[artworkIndex];

		if (prefersReducedMotion) {
			setRenderedArtwork(target.join("\n"));
			previousIndex.current = artworkIndex;
			return undefined;
		}

		const source = paddedArtworks[previousIndex.current];
		const seed = artworkIndex + 1;
		const startedAt = window.performance.now();
		let timer = 0;

		const tick = () => {
			const progress = Math.min(
				1,
				(window.performance.now() - startedAt) / scrambleDuration,
			);

			if (progress === 1) {
				setRenderedArtwork(target.join("\n"));
				window.clearInterval(timer);
				return;
			}

			setRenderedArtwork(scrambleArtwork(source, target, progress, seed));
		};

		timer = window.setInterval(tick, scrambleTick);
		tick();
		previousIndex.current = artworkIndex;

		return () => window.clearInterval(timer);
	}, [artworkIndex, prefersReducedMotion]);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div className="hero-grid absolute inset-0" />

			<div className="absolute inset-0 grid place-items-center px-4">
				<pre className="select-none whitespace-pre text-center font-mono text-[0.5rem] leading-[1.15] text-emerald-300/[0.14] sm:text-[0.68rem] lg:text-[0.9rem] xl:text-[1.05rem]">
					{renderedArtwork}
				</pre>
			</div>
		</div>
	);
}
