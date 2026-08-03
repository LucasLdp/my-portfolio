import { ArrowUpRight } from "lucide-react";

import { Badge } from "#/components/atoms/badge";
import { Button } from "#/components/atoms/button";
import { cn } from "#/lib/utils";

type ProjectCardProps = {
	title: string;
	description: string;
	technologies: string[];
	githubUrl: string;
	demoUrl: string;
	className?: string;
};

export function ProjectCard({
	title,
	description,
	technologies,
	githubUrl,
	demoUrl,
	className,
}: ProjectCardProps) {
	return (
		<article
			className={cn(
				"group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:border-emerald-400/30 hover:bg-white/[0.05]",
				className,
			)}
		>
			<div className="border-b border-white/10 p-5">
				<div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.18),transparent_56%),linear-gradient(135deg,rgba(24,24,27,1),rgba(9,9,11,0.9))]">
					<div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
					<div className="absolute inset-0 flex items-end justify-between p-4">
						<div>
							<p className="text-xs tracking-[0.24em] text-emerald-200 uppercase">
								Estudo de caso
							</p>
							<h3 className="mt-2 max-w-xs text-xl font-semibold text-white">
								{title}
							</h3>
						</div>
						<div className="rounded-full border border-white/10 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
							Web app
						</div>
					</div>
				</div>
			</div>
			<div className="space-y-5 p-5">
				<p className="text-sm leading-7 text-zinc-300">{description}</p>
				<div className="flex flex-wrap gap-2">
					{technologies.map((technology) => (
						<Badge key={technology} className="border-white/10 text-zinc-200">
							{technology}
						</Badge>
					))}
				</div>
				<div className="flex flex-wrap gap-3">
					<Button
						variant="secondary"
						href={githubUrl}
						target="_blank"
						rel="noreferrer"
					>
						Código
						<ArrowUpRight className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						href={demoUrl}
						target="_blank"
						rel="noreferrer"
					>
						Ver projeto
						<ArrowUpRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</article>
	);
}
