import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const session = [
	{ command: "whoami", output: "Lucas Gomes" },
	{
		command: "current_focus",
		output: "Ciência da Computação\nDesenvolvimento Fullstack",
	},
	{
		command: "stack",
		output:
			"TypeScript\nReact · Next.js\nNode.js · NestJS\nPostgreSQL · Prisma · Docker",
	},
	{ command: "npm run dev", output: "✓ Compiled successfully." },
	{ command: "git status", output: "Working tree clean." },
	{
		command: "currently_learning",
		output: "Arquitetura · Performance\nUX · Boas práticas",
	},
	{ command: "status", output: "Disponível para novos desafios 🚀" },
] as const;

type TerminalState = {
	entryIndex: number;
	phase: "typing" | "command-pause" | "output" | "entry-pause" | "loop-pause";
	typedLength: number;
	outputLength: number;
};

const initialState: TerminalState = {
	entryIndex: 0,
	phase: "typing",
	typedLength: 0,
	outputLength: 0,
};

export function TerminalSession() {
	const prefersReducedMotion = useReducedMotion();
	const [state, setState] = useState<TerminalState>(initialState);
	const terminalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (prefersReducedMotion) {
			return undefined;
		}

		const entry = session[state.entryIndex];
		const output = entry.output;
		let delay = 35;
		let nextState: TerminalState | null = null;

		if (state.phase === "typing") {
			if (state.typedLength < entry.command.length) {
				delay = state.typedLength % 5 === 0 ? 70 : 38;
				nextState = { ...state, typedLength: state.typedLength + 1 };
			} else {
				delay = 420;
				nextState = { ...state, phase: "command-pause" };
			}
		} else if (state.phase === "command-pause") {
			nextState = { ...state, phase: "output" };
		} else if (state.phase === "output") {
			if (state.outputLength < output.length) {
				delay = output[state.outputLength] === "\n" ? 170 : 18;
				nextState = { ...state, outputLength: state.outputLength + 1 };
			} else {
				delay = 900;
				nextState = { ...state, phase: "entry-pause" };
			}
		} else if (state.phase === "entry-pause") {
			if (state.entryIndex === session.length - 1) {
				delay = 4200;
				nextState = { ...state, phase: "loop-pause" };
			} else {
				nextState = {
					entryIndex: state.entryIndex + 1,
					phase: "typing",
					typedLength: 0,
					outputLength: 0,
				};
			}
		} else {
			nextState = initialState;
		}

		const timer = window.setTimeout(() => {
			if (nextState) setState(nextState);
		}, delay);

		return () => window.clearTimeout(timer);
	}, [prefersReducedMotion, state]);

	useEffect(() => {
		const terminal = terminalRef.current;
		if (!terminal || prefersReducedMotion) return;

		if (state.entryIndex === 0 && state.phase === "typing") {
			terminal.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		terminal.scrollTo({ top: terminal.scrollHeight, behavior: "smooth" });
	}, [prefersReducedMotion, state]);

	if (prefersReducedMotion) {
		return (
			<div className="space-y-3 font-mono text-xs leading-5 text-zinc-300 sm:space-y-4 sm:text-sm sm:leading-6">
				{session.map((entry) => (
					<div key={entry.command}>
						<p className="text-emerald-300">$ {entry.command}</p>
						<p className="mt-1 whitespace-pre-line text-zinc-300">
							{entry.output}
						</p>
					</div>
				))}
			</div>
		);
	}

	return (
		<div
			ref={terminalRef}
			className="terminal-scroll h-[18rem] w-full space-y-3 overflow-y-auto pr-1 font-mono text-xs leading-5 text-zinc-300 sm:h-[25rem] sm:w-120 sm:space-y-4 sm:pr-2 sm:text-sm sm:leading-6"
		>
			{session
				.slice(
					0,
					state.phase === "loop-pause" ? session.length : state.entryIndex,
				)
				.map((entry) => (
					<div key={entry.command}>
						<p className="text-emerald-300">$ {entry.command}</p>
						<p className="mt-1 whitespace-pre-line text-zinc-300">
							{entry.output}
						</p>
					</div>
				))}

			{state.phase !== "loop-pause" && (
				<div>
					<p className="text-emerald-300">
						$ {session[state.entryIndex].command.slice(0, state.typedLength)}
						<span className="terminal-cursor" aria-hidden="true" />
					</p>
					{state.phase !== "typing" && (
						<p className="mt-1 whitespace-pre-line text-zinc-300">
							{session[state.entryIndex].output.slice(0, state.outputLength)}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
