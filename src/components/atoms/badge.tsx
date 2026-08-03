import type { ReactNode } from "react";

import { cn } from "#/lib/utils";

type BadgeProps = {
	children: ReactNode;
	className?: string;
};

export function Badge({ children, className }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-zinc-300 uppercase",
				className,
			)}
		>
			{children}
		</span>
	);
}
