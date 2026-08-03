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
						title="Minha jornada profissional"
						description="Onde trabalhei, o que aprendi e as tecnologias que utilizei para entregar resultados de qualidade. Cada experiência contribuiu para meu crescimento como desenvolvedor e para minha paixão por criar soluções inovadoras."
					/>
				</Reveal>

				<div className="mt-10 space-y-4">
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
