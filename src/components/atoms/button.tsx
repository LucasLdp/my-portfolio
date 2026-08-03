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

type ButtonAsButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonAsAnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

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
		"inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
		variantClasses[variant],
		className,
	);

	if ("href" in props) {
		return (
			<a className={classes} {...props}>
				{children}
			</a>
		);
	}

	return (
		<button className={classes} type={props.type ?? "button"} {...props}>
			{children}
		</button>
	);
}
