import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";

export function AboutSection() {
	return (
		<section id="sobre" className="py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<SectionHeading
						eyebrow="Sobre mim"
						title="Entender o uso vem antes de escolher a ferramenta."
						description="Sou desenvolvedor web, técnico em Desenvolvimento de Sistemas e estudante de Ciência da Computação."
					/>
				</Reveal>

				<Reveal delay={0.08}>
					<ul className="mt-10 grid gap-x-10 md:grid-cols-3">
						{[
							"Gosto de começar pelo uso real: quem está na tela, o que precisa fazer e o que não pode dar errado.",
							"Minha experiência passa por aplicações web e mobile, painéis administrativos e fluxos internos.",
							"Estudo arquitetura, acessibilidade e performance para entender como decisões técnicas afetam o uso.",
						].map((item) => (
							<li
								key={item}
								className="border-t border-emerald-400/25 py-4 text-sm leading-7 text-zinc-300"
							>
								{item}
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
