import { PortfolioTemplate } from "#/components/templates/portfolio-template";
import { siteConfig } from "#/constants/site";

export function HomePage() {
	return (
		<>
			<script type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Person",
					name: siteConfig.name,
					jobTitle: siteConfig.role,
					url: siteConfig.siteUrl,
					sameAs: [siteConfig.github, siteConfig.linkedin],
					email: siteConfig.email,
				})}
			</script>
			<PortfolioTemplate />
		</>
	);
}
