import ReactMarkdown from "react-markdown";
import Heading from "./Heading";
import { PageTitle } from "./PageTitle";
import Link from "./Link";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
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
      }}>
      {content}
    </ReactMarkdown>
  );
}
