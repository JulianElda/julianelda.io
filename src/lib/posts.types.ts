export interface PostFrontmatter {
  date: string;
  description: string;
  draft: boolean;
  slug: string;
  title: string;
  /**
   * ISO date string (`YYYY-MM-DD`), set manually only when a post is
   * substantively revised after publishing. Omit entirely for posts that
   * have never been revised — do not set it equal to `date`.
   */
  updated?: string;
}
