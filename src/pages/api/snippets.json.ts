import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { shouldShowContent } from "@/utils/markdown";

export const GET: APIRoute = async () => {
  try {
    const snippets = await getCollection("snippets");
    const isDev = import.meta.env.DEV;
    const visibleSnippets = snippets.filter((snippet: any) => shouldShowContent(snippet, isDev));

    const payload = visibleSnippets
      .map((snippet: any) => ({
        id: snippet.id,
        title: snippet.data.title,
        description: snippet.data.description,
        url: `/snippets/${snippet.id}`,
        type: "snippet" as const,
        date: snippet.data.date,
        tags: snippet.data.tags || [],
        language: snippet.data.language || null,
      }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch snippets" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
