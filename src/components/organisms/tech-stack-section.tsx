import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";
import { technologyGrid } from "#/constants/portfolio";

function SkillIcon({
	skillIcon,
	logoUrl,
}: {
	skillIcon: string;
	logoUrl?: string;
}) {
	return (
		<img
			className="h-8 w-8 object-contain"
			src={logoUrl ?? `https://skillicons.dev/icons?i=${skillIcon}&theme=dark`}
			alt=""
			aria-hidden="true"
			width="32"
			height="32"
			loading="lazy"
			decoding="async"
			referrerPolicy="no-referrer"
		/>
	);
}

export function TechStackSection() {
	return (
		<section id="stack" className="py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<SectionHeading
						eyebrow="Tech Stack"
						title="Tecnologias que aparecem no meu trabalho."
						description="Uma seleção das ferramentas que uso em interfaces, serviços e sistemas com os quais já trabalhei."
					/>
				</Reveal>

				<Reveal delay={0.08}>
					<ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
						{technologyGrid.map((technology) => (
							<li
								key={technology.name}
								className="flex min-h-24 items-center gap-4 border-t border-white/10 py-4"
							>
								<SkillIcon
									skillIcon={technology.skillIcon}
									logoUrl={technology.logoUrl}
								/>
								<div>
									<h3 className="text-sm font-semibold text-white">
										{technology.name}
									</h3>
									<p className="mt-1 text-sm leading-6 text-zinc-400">
										{technology.description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
