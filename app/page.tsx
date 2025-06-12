import { Card } from "./components/Card";
import { Footer } from "./components/Footer";
import Content from "./contents.mdx";

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-xl text-xl md:pb-16">
        <Card>
          <Content />
        </Card>
      </div>
      <Footer />
    </>
  );
}
