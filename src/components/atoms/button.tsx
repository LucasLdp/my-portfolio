import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ReactNode,
} from "react";

import { cn } from "#/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
	variant?: ButtonVariant;
	className?: string;
	children: ReactNode;
};

type ButtonAsButtonProps = BaseProps &
	ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsAnchorProps = BaseProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string };

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-emerald-400 text-zinc-950 hover:bg-emerald-300 focus-visible:ring-emerald-300",
	secondary:
		"border border-white/10 bg-white/5 text-white hover:bg-white/8 focus-visible:ring-white/30",
	ghost:
		"text-zinc-200 hover:bg-white/5 hover:text-white focus-visible:ring-white/25",
};

export function Button({
	variant = "primary",
	className,
	children,
	...props
}: ButtonAsButtonProps | ButtonAsAnchorProps) {
	const classes = cn(
		"group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold outline-none transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
		variantClasses[variant],
		className,
	);

	if (typeof props.href === "string") {
		return (
			<a className={classes} {...props}>
				{children}
			</a>
		);
	}

	return (
		<button {...props} className={classes} type={props.type ?? "button"}>
			{children}
		</button>
	);
}
