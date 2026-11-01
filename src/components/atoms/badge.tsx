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
				"inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.12em] text-zinc-300 uppercase",
				className,
			)}
		>
			{children}
		</span>
	);
}
