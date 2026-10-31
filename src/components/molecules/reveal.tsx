import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
	children: ReactNode;
	delay?: number;
	className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
	const prefersReducedMotion = useReducedMotion();

	if (prefersReducedMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-10% 0px" }}
			transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</motion.div>
	);
}
