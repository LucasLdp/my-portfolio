import {
	type AmbientTheme,
	AmbientThemeToggle,
} from "#/components/atoms/ambient-theme-toggle";
import { Badge } from "#/components/atoms/badge";
import { Button } from "#/components/atoms/button";
import { navigationItems } from "#/constants/navigation";
import { siteConfig } from "#/constants/site";

export function Navbar({
	theme,
	onThemeToggle,
}: {
	theme: AmbientTheme;
	onThemeToggle: () => void;
}) {
	return (
		<header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
			<div className="page-wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 py-3 md:flex md:justify-between md:py-4">
				<a
					href="#inicio"
					className="flex items-center gap-3 text-white no-underline"
				>
					<img
						src="/my_profile.png"
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
							className="rounded-md px-3 py-2 text-sm text-zinc-300 no-underline transition hover:bg-white/5 hover:text-white"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="col-start-2 row-start-1 flex items-center justify-self-end gap-2 md:static">
					<AmbientThemeToggle theme={theme} onToggle={onThemeToggle} />
					<div className="hidden md:block">
						<Button variant="secondary" href={`mailto:${siteConfig.email}`}>
							Vamos conversar
						</Button>
					</div>
				</div>

				<div className="col-span-2 row-start-2 min-w-0 md:hidden">
					<Badge className="max-w-full whitespace-nowrap rounded-md border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] tracking-[0.12em] text-zinc-200">
						Aberto a oportunidades
					</Badge>
				</div>
			</div>
		</header>
	);
}
