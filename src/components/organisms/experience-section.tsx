import { ExperienceCard } from "#/components/molecules/experience-card";
import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";
import { experienceItems } from "#/constants/portfolio";

export function ExperienceSection() {
	return (
		<section id="experiencia" className="py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<SectionHeading
						eyebrow="Experiência"
						title="Sistemas usados no dia a dia de equipes."
						description="Aplicações web e mobile, painéis administrativos e integrações para provedores de internet e serviços públicos."
					/>
				</Reveal>

				<div className="mt-10">
					{experienceItems.map((item, index) => (
						<Reveal key={`${item.company}-${item.period}`} delay={index * 0.08}>
							<ExperienceCard {...item} />
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
