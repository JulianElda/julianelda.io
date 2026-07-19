import { getPosts } from "$lib/server/posts.server";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return { posts: getPosts() };
};
