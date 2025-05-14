import { Footer } from "./components/Footer";
import Content from "./contents.mdx";

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-4xl text-xl md:pb-10">
        <Content />
      </div>
      <Footer />
    </>
  );
}
