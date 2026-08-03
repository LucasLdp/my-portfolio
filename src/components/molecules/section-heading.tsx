import type { ReactNode } from "react";

import { cn } from "#/lib/utils";

type SectionHeadingProps = {
	eyebrow: string;
	title: string;
	description: string;
	align?: "left" | "center";
	className?: string;
	children?: ReactNode;
};

export function SectionHeading({
	eyebrow,
	title,
	description,
	align = "left",
	className,
	children,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				"flex max-w-3xl flex-col gap-4",
				align === "center" && "mx-auto items-center text-center",
				className,
			)}
		>
			<p className="text-xs font-semibold tracking-[0.28em] text-emerald-300 uppercase">
				{eyebrow}
			</p>
			<div className="space-y-3">
				<h2 className="display-title text-3xl text-balance text-white sm:text-4xl lg:text-5xl">
					{title}
				</h2>
				<p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
					{description}
				</p>
			</div>
			{children}
		</div>
	);
}
