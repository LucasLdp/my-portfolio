import { siteConfig } from "#/constants/site";

export function Footer() {
	return (
		<footer className="border-t border-white/5 py-8">
			<div className="page-wrap flex flex-col gap-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
				<p>
					© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos
					reservados.
				</p>
				<p>Feito por Lucas</p>
			</div>
		</footer>
	);
}
