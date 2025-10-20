import { countSearchProjects, searchProjects } from "@/app/lib/data";
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

  return (
    <SearchUI
      searchTerm={query}
      page={currentPage}
      pages={Math.floor(count / 10)}
    >
      {query && (
        <div>
          {projects.map((project) => (
            <ProjectCard project={project} />
          ))}
        </div>
      )}
    </SearchUI>
  );
}
