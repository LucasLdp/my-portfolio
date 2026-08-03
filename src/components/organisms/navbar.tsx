import { Menu } from "lucide-react";

import { Badge } from "#/components/atoms/badge";
import { Button } from "#/components/atoms/button";
import { navigationItems } from "#/constants/navigation";
import { siteConfig } from "#/constants/site";

export function Navbar() {
	return (
		<header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
			<div className="page-wrap flex items-center justify-between py-4">
				<a
					href="#inicio"
					className="flex items-center gap-3 text-white no-underline"
				>
					<img
						src='/my_profile.png'
						alt="Foto de perfil"
						className="h-10 w-10 shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 object-cover"
					/>

					<div className="hidden sm:block">
						<div className="text-sm font-semibold">{siteConfig.name}</div>
						<div className="text-xs text-zinc-400">{siteConfig.role}</div>
					</div>
				</a>

				<nav
					className="hidden items-center gap-1 md:flex"
					aria-label="Navegação principal"
				>
					{navigationItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="rounded-full px-4 py-2 text-sm text-zinc-300 no-underline transition hover:bg-white/5 hover:text-white"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="hidden md:block">
					<Button variant="secondary" href={`mailto:${siteConfig.email}`}>
						<Menu className="h-4 w-4 md:hidden" aria-hidden="true" />
						Vamos conversar
					</Button>
				</div>

				<div className="md:hidden">
					<Badge className="border-white/10 bg-white/5 text-zinc-200">
						Aberto a oportunidades
					</Badge>
				</div>
			</div>
		</header>
	);
}
