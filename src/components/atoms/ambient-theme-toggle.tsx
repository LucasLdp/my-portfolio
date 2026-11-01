import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type AmbientTheme = "sun" | "moon";

type AmbientThemeToggleProps = {
	theme: AmbientTheme;
	onToggle: () => void;
};

export function AmbientThemeToggle({
	theme,
	onToggle,
}: AmbientThemeToggleProps) {
	const reduceMotion = useReducedMotion();
	const nextTheme = theme === "sun" ? "moon" : "sun";

	return (
		<button
			type="button"
			onClick={onToggle}
			aria-label={`Ativar tema ${nextTheme === "sun" ? "Claro" : "Escuro"}`}
			aria-pressed={theme === "moon"}
			title={`Ativar tema ${nextTheme === "sun" ? "Claro" : "Escuro"}`}
			className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-zinc-200 transition-colors hover:border-emerald-300/35 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 motion-reduce:transition-none"
		>
			<span className="relative flex h-9 w-9 items-center justify-center overflow-hidden text-emerald-200">
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={theme}
						initial={
							reduceMotion ? false : { opacity: 0, rotate: -120, scale: 0.65 }
						}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={
							reduceMotion
								? undefined
								: { opacity: 0, rotate: 540, scale: 0.45 }
						}
						transition={{
							duration: reduceMotion ? 0 : 0.34,
							ease: "easeInOut",
						}}
						className="flex"
						aria-hidden="true"
					>
						{theme === "sun" ? (
							<Sun className="h-5 w-5" strokeWidth={1.7} />
						) : (
							<Moon className="h-5 w-5" strokeWidth={1.7} />
						)}
					</motion.span>
				</AnimatePresence>
			</span>
			<span className="text-xs font-medium">
				{theme === "sun" ? "Claro" : "Escuro"}
			</span>
		</button>
	);
}
