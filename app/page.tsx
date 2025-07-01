import { Card } from "./components/card";
import { Footer } from "./components/footer";
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
