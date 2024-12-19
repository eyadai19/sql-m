"use client";

import { usePathname } from "next/navigation";
import { allPath } from "../../utils/path";
import Heading from "./Heading";

export default function RenderHeadings() {
	const currentPath = usePathname();
	return (
		<div>
			{allPath.map((group) => (
				<div key={group.name}>
					{group.data.map((page) => {
						let modifiedPagePath = page.path.replace("..", "");
						if (modifiedPagePath === currentPath) {
							return (
								<>
									<Heading
										key={page.name}
										title={page.name}
										subtitle={group.name}
									/>
								</>
							);
						}
						return null;
					})}
				</div>
			))}
		</div>
	);
}
