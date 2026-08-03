import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";

export function AboutSection() {
	return (
		<section id="sobre" className="py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<SectionHeading
						eyebrow="Sobre mim"
						title="Como eu trabalho e o que me motiva."
						description="Sou Desenvolvedor web, estudante de Ciência da Computação e Técnico em Desenvolvimento de Sistemas. Gosto de criar soluções que unem design, performance e acessibilidade, sempre buscando aprender e evoluir com cada projeto."
					/>
				</Reveal>

				<Reveal delay={0.08} className="mt-10 grid gap-4 md:grid-cols-3">
					{[
						"Gosto de começar pelo uso real: quem está na tela, o que precisa fazer e o que não pode dar errado.",
						"Já trabalhei com páginas de apresentação, painéis e fluxos internos — contextos diferentes que pedem o mesmo cuidado.",
						"Estudo com constância arquitetura, acessibilidade e performance porque boas decisões pequenas se acumulam.",
					].map((item) => (
						<div
							key={item}
							className="island-shell rounded-3xl p-6 text-sm leading-7 text-zinc-300"
						>
							{item}
						</div>
					))}
				</Reveal>
			</div>
		</section>
	);
}
