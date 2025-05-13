import Heading from "./Heading";
import Link from "./Link";

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-4xl text-xl md:pb-10">
        <h1 className="text-center font-heading text-3xl font-semibold md:pt-4 md:text-start">
          Julius Polar
        </h1>

        <Heading title="About me" />
        <p>
          I&apos;m a front-end developer, tech-enthusiast, and gamer. I have
          been working as a developer for over a decade, built many
          web-applications with various technologies.
        </p>

        <Heading title="Work" />
        <p>
          I&apos;m currently working at{" "}
          <Link
            title="Snke OS"
            href="https://www.snke.com/"
          />{" "}
          as a software engineer.
        </p>

        <Heading title="Personal projects" />
        <p>
          I also developed various web-applications on my own, check them out.
        </p>
        <p className="pt-4">
          <Link
            title="Planning Poker"
            href="https://julianelda.io/planning-poker/"
          />
        </p>
        <p>Online Scrum/Planning poker.</p>
        <p className="pt-4">
          <Link
            title="meter"
            href="https://meter-nine.vercel.app/"
          />
        </p>
        <p>
          Tools and converters. Convert various units like time, weight, volume.
        </p>
        <p className="pt-4">
          <Link
            title="f4"
            href="https://julianelda.io/f4/"
          />
        </p>
        <p>
          A theorycrafting tool for Final Fantasy XIV&apos;s Black Mage. Compare
          specified rotation to standard rotation.
        </p>
        <p className="pt-4">
          <Link
            title="This page"
            href="https://julianelda.io/"
          />
        </p>
        <p>My homepage.</p>
        <Heading title="Contact" />
        <p>
          You can contact me via{" "}
          <Link
            title="LinkedIn"
            href="https://www.linkedin.com/in/julius-polar/"
          />
          . Check out my{" "}
          <Link
            title="GitHub"
            href="https://github.com/JulianElda"
          />{" "}
          too.
        </p>
      </div>
    </>
  );
}
