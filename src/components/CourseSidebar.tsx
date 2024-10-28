"use client";

import Link from "next/link";

interface Course {
	name: string;
	path: string;
}

const courseList: Course[] = [
	{ name: "Data Type", path: "/dataType" },
	{ name: "SQL Intro", path: "/sql-intro" },
	{ name: "SQL Syntax", path: "/sql-syntax" },
	{ name: "SQL Select", path: "/sql-select" },
	{ name: "SQL Select Distinct", path: "/sql-select-distinct" },
	{ name: "SQL Where", path: "/sql-where" },
	{ name: "SQL Order By", path: "/sql-order-by" },
];

export function CourseSidebar() {
	return (
		<div className="w-fit bg-gray-100 shadow-md">
			<ul className="list-none p-0">
				{courseList.map((course, index) => (
					<li
						key={index}
						className="my-1 border-2 border-solid border-red-500 p-2 text-base text-black"
					>
						<Link href={course.path}>{course.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
