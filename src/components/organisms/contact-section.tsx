import { ArrowUpRight } from "lucide-react";

import { Button } from "#/components/atoms/button";
import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";
import { contactLinks } from "#/constants/portfolio";
import { siteConfig } from "#/constants/site";

export function ContactSection() {
	return (
		<section id="contato" className="py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<div className="island-shell overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
						<SectionHeading
							eyebrow="Contato"
							title="Tem uma ideia, uma vaga ou um problema para conversar?"
							description="Pode me escrever. Gosto de conhecer o contexto, trocar referências e entender onde eu posso contribuir de verdade."
						/>

						<div className="mt-8 flex flex-wrap gap-3">
							<Button href={`mailto:${siteConfig.email}`}>
								Enviar e-mail
								<ArrowUpRight className="h-4 w-4" />
							</Button>
							{contactLinks.map((link) => {
								const Icon = link.icon;

								return (
									<Button
										key={link.label}
										variant="secondary"
										href={link.href}
										target="_blank"
										rel="noreferrer"
									>
										<Icon className="h-4 w-4" aria-hidden="true" />
										{link.label}
									</Button>
								);
							})}
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
