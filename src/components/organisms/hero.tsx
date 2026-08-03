import { Download } from "lucide-react";

import { Badge } from "#/components/atoms/badge";
import { Button } from "#/components/atoms/button";
import { Reveal } from "#/components/molecules/reveal";
import { SocialLinks } from "#/components/molecules/social-links";
import { TerminalSession } from "#/components/molecules/terminal-session";
import { socialLinks } from "#/constants/portfolio";
import { siteConfig } from "#/constants/site";

export function Hero() {
	return (
		<section
			id="inicio"
			className="relative overflow-hidden py-16 sm:py-24 lg:py-28"
		>
			<div className="page-wrap relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
				<Reveal>
					<div className="space-y-8">
						<div className="flex flex-wrap items-center gap-3">
							<Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
								Fullstack Developer
							</Badge>
						</div>

						<div className="space-y-5">
							<h1 className="display-title max-w-3xl text-5xl leading-[0.95] text-balance text-white sm:text-6xl lg:text-7xl">
								Olá, eu sou Lucas Gomes.
							</h1>

							<div className="max-w-2xl space-y-5 text-base leading-8 text-zinc-300 sm:text-lg">
								<p>
									Sou desenvolvedor fullstack e estudante de Ciência da
									Computação.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button variant="secondary" href={`mailto:${siteConfig.email}`}>
								Entrar em contato
							</Button>

							<Button
								variant="secondary"
								href="/curriculo-lucas-gomes.pdf"
								download="Curriculo-Lucas-Gomes.pdf"
							>
								<Download className="h-4 w-4" aria-hidden="true" />
								Baixar currículo
							</Button>
						</div>

						<SocialLinks links={socialLinks} />
					</div>
				</Reveal>

				<Reveal delay={0.12} className="lg:justify-self-end">
					<div className="island-shell relative overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5">
						<div className="rounded-[1.1rem] border border-white/8 bg-[#09110f] p-4 shadow-2xl shadow-black/30 sm:rounded-[1.5rem] sm:p-6">
							<div className="flex items-center gap-1.5 border-b border-white/10 pb-3 text-[0.65rem] text-zinc-400 sm:gap-2 sm:pb-4 sm:text-xs">
								<span className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
								<span className="h-2.5 w-2.5 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
								<span className="h-2.5 w-2.5 rounded-full bg-emerald-400 sm:h-3 sm:w-3" />

								<span className="ml-3 font-mono">
									lucas@portfolio ~/workspace
								</span>
							</div>

							<div className="pt-4 sm:pt-6">
								<TerminalSession />
							</div>
						</div>

						<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
					</div>
				</Reveal>
			</div>
		</section>
	);
}
