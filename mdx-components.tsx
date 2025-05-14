import type { MDXComponents } from "mdx/types";
import Link from "./app/components/Link";
import { PageTitle } from "./app/components/PageTitle";
import Heading from "./app/components/Heading";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a(props) {
      return (
        <Link
          title={props.children as string}
          href={props.href!}
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
