import { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/utils/index";
import { getMovies } from "./server-actions/movies/get-movies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
  // get movies dynamically
  try {
    const movies = await getMovies();

    const moviePages: MetadataRoute.Sitemap = movies.map((movie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error("Error when generating sitemap:", error);
    return staticPages;
  }
}
