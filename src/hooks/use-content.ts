import { getRouteApi } from "@tanstack/react-router";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";

const rootApi = getRouteApi("__root__");

export function useContent(): SiteContent {
  return (rootApi.useLoaderData() as SiteContent | undefined) ?? DEFAULT_CONTENT;
}
