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
				"grid gap-4 border-t border-white/10 py-6 sm:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.4fr)] sm:gap-10",
				className,
			)}
		>
			<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:block">
				<h3 className="text-lg font-semibold text-white">{role}</h3>
				<p className="font-mono text-xs text-emerald-200/80">{period}</p>
				<p className="mt-1 w-full text-sm text-zinc-400">{company}</p>
			</div>
			<div>
				<p className="text-sm leading-7 text-zinc-300">{description}</p>
				<ul
					aria-label={`Tecnologias utilizadas: ${company}`}
					className="mt-3 flex flex-wrap gap-x-3 gap-y-1"
				>
					{technologies.map((technology) => (
						<li
							key={technology}
							className="text-xs text-zinc-500 before:mr-1.5 before:text-emerald-500/70 before:content-['/']"
						>
							{technology}
						</li>
					))}
				</ul>
			</div>
		</article>
	);
}
