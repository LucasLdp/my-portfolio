import { ArrowUpRight } from "lucide-react";

import { Button } from "#/components/atoms/button";
import type { SocialLink } from "#/types/portfolio";

type SocialLinksProps = {
	links: SocialLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			{links.map((link) => {
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
						<ArrowUpRight className="h-4 w-4" />
					</Button>
				);
			})}
		</div>
	);
}
