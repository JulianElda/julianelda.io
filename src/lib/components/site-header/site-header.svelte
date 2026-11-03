<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const linkClass =
    "inline-flex min-h-11 items-center decoration-dotted decoration-2 underline-offset-5 hover:underline focus-visible:underline";

  let pathname = $derived(page.url.pathname);
  let isHome = $derived(pathname === "/home");
  let isWriting = $derived(
    pathname === "/posts" || pathname.startsWith("/posts/"),
  );
  let isProjects = $derived(pathname === "/projects");
</script>

<header
  class="sticky top-0 z-10 border-b border-rule-soft bg-paper/90 px-5 pt-8 pb-4 backdrop-blur-[6px]">
  <div
    class="mx-auto flex max-w-[680px] flex-wrap items-baseline justify-between gap-x-6">
    <a
      aria-current={isHome ? "page" : undefined}
      class={[linkClass, "chalk font-display text-[26px] leading-[1.1]"]}
      href={resolve("/home")}>Julius Polar</a>
    <nav
      aria-label="Sections"
      class="flex flex-wrap gap-x-[clamp(16px,4vw,28px)] text-[20px]">
      <a
        aria-current={isWriting ? "page" : undefined}
        class={linkClass}
        href={resolve("/posts")}>
        <span class={{ marker: isWriting }}>Writing</span>
      </a>
      <a
        aria-current={isProjects ? "page" : undefined}
        class={linkClass}
        href={resolve("/projects")}>
        <span class={{ marker: isProjects }}>Projects</span>
      </a>
    </nav>
  </div>
</header>
