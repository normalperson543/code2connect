import { countSearchProjects, searchProjects } from "@/app/lib/data";
import { ProjectWithOwner } from "@/app/lib/projects";
import ProjectCard from "@/components/project-card";
import SearchUI from "@/components/search/search";
import { Pagination } from "@mantine/core";

export default async function Search(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
console.log(query)
console.log(currentPage)
  const projects = await searchProjects(query, currentPage);
  console.log(projects)
  const count = await countSearchProjects(query);

  projects.map((project) => console.log(project as ProjectWithOwner))
  return (
    <SearchUI
      searchTerm={query}
      page={currentPage}
      pages={Math.floor(count / 10) + 1}
      count={count}
    >
      {query && (
        <>
          {projects.map((project) => (
            <ProjectCard projectInfo={project as ProjectWithOwner} />
          ))}
        </>
      )}
    </SearchUI>
  );
}
