import type { MDXComponents } from "mdx/types";

import { Heading } from "./app/components/heading";
import { Link } from "./app/components/link";
import { PageTitle } from "./app/components/page-title";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a(props) {
      return (
        <Link
          href={props.href}
          title={props.children as string}
        />
      );
    },
    h1(props) {
      return <PageTitle title={props.children as string} />;
    },
    h2(props) {
      return <Heading title={props.children as string} />;
    },
    p(props) {
      return <p className="pb-3">{props.children}</p>;
    },
    ...components,
  };
}
