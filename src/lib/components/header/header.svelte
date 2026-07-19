<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const homeHref = resolve("/home");
  const projectsHref = resolve("/projects");
  const contactHref = resolve("/contact");
  const postsHref = resolve("/posts");
</script>

<header class="pt-4 pb-6">
  <h1 class="font-heading text-4xl">Julius Polar</h1>
  <nav class="flex gap-4 pt-2">
    <a
      class={[
        "text-primary-900 decoration-dotted hover:text-primary-700 hover:underline dark:text-primary-100 dark:hover:text-primary-300",
        page.url.pathname === "/home" ? "font-bold underline" : "font-semibold",
      ]}
      href={homeHref}>/home</a>
    <a
      class={[
        "text-primary-900 decoration-dotted hover:text-primary-700 hover:underline dark:text-primary-100 dark:hover:text-primary-300",
        page.url.pathname === "/projects"
          ? "font-bold underline"
          : "font-semibold",
      ]}
      href={projectsHref}>/projects</a>
    <a
      class={[
        "text-primary-900 decoration-dotted hover:text-primary-700 hover:underline dark:text-primary-100 dark:hover:text-primary-300",
        page.url.pathname === "/contact"
          ? "font-bold underline"
          : "font-semibold",
      ]}
      href={contactHref}>/contact</a>
    <a
      class={[
        "text-primary-900 decoration-dotted hover:text-primary-700 hover:underline dark:text-primary-100 dark:hover:text-primary-300",
        page.url.pathname === "/posts"
          ? "font-bold underline"
          : "font-semibold",
      ]}
      href={postsHref}>/posts</a>
  </nav>
</header>
