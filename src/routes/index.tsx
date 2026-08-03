import { siteConfig } from "#/constants/site";
import { HomePage } from "#/pages/home-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	head: () => ({
		title: `${siteConfig.name} | ${siteConfig.role}`,
		meta: [
			{ name: "description", content: siteConfig.description },
			{
				property: "og:title",
				content: `${siteConfig.name} | ${siteConfig.role}`,
			},
			{ property: "og:description", content: siteConfig.description },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: siteConfig.siteUrl },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: `${siteConfig.name} | ${siteConfig.role}`,
			},
			{ name: "twitter:description", content: siteConfig.description },
		],
		links: [
			{ rel: "canonical", href: siteConfig.siteUrl },
			{ rel: "icon", type: "image/png", href: "/favicon.png" },
		],
	}),
	component: Home,
});

function Home() {
	return <HomePage />;
}
