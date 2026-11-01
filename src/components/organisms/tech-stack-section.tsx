import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";
import { githubSkills } from "#/constants/portfolio";

function SkillIcon({ skillIcon }: { skillIcon: string }) {
	return (
		<img
			className="h-9 w-9 object-contain"
			src={`https://skillicons.dev/icons?i=${skillIcon}&theme=dark`}
			alt=""
			aria-hidden="true"
			width="36"
			height="36"
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
						title="Tecnologias que fazem parte do meu trabalho."
						description="Uma seleção do que uso em interfaces, aplicações e serviços — incluindo as tecnologias listadas no meu GitHub."
					/>
				</Reveal>

				<ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
					{githubSkills.map((technology) => (
						<li
							key={technology.name}
							className="flex min-h-20 items-center gap-4 border-t border-white/10 px-2 py-4"
						>
							<SkillIcon skillIcon={technology.icon} />
							<h3 className="text-sm font-semibold text-white">
								{technology.name}
							</h3>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
