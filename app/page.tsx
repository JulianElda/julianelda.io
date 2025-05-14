import { Footer } from "./components/Footer";
import { Markdown } from "./components/Markdown";

const content = `
# Julius Polar

I'm a front-end developer, tech-enthusiast, and gamer. I have
been working as a developer for over a decade, built many
web-applications with various technologies.

## Stuff I made

[meter](https://julianelda.io/meter/)  
Tools and converters. Convert various units like time, weight, volume.
Generate password, guid, lorem ipsum etc.

[Planning Poker](https://julianelda.io/planning-poker/)  
Online Scrum/Planning poker.

[f4](https://julianelda.io/f4/)  
A theorycrafting tool for Final Fantasy XIV&apos;s Black Mage.
Compare specified rotation to standard rotation. For patch 6.x.

[This page](https://julianelda.io/)  
My homepage.

## Contact

You can contact me via [LinkedIn](https://www.linkedin.com/in/julius-polar/).
Check out my [GitHub](https://github.com/JulianElda) too.
`;

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-4xl text-xl md:pb-10">
        <Markdown content={content} />
      </div>
      <Footer />
    </>
  );
}
