import { Badge } from "#/components/atoms/badge";
import { cn } from "#/lib/utils";

type ExperienceCardProps = {
	role: string;
	company: string;
	period: string;
	technologies: string[];
	description: string;
	className?: string;
};

export function ExperienceCard({
	role,
	company,
	period,
	technologies,
	description,
	className,
}: ExperienceCardProps) {
	return (
		<article
			className={cn(
				"group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.05]",
				className,
			)}
		>
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold text-white">{role}</h3>
						<p className="mt-1 text-sm text-zinc-400">{company}</p>
					</div>
					<Badge className="border-emerald-400/15 bg-emerald-400/8 text-emerald-200">
						{period}
					</Badge>
				</div>
				<p className="text-sm leading-7 text-zinc-300">{description}</p>
				<div className="flex flex-wrap gap-2 pt-1">
					{technologies.map((technology) => (
						<span
							key={technology}
							className="rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300"
						>
							{technology}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}
