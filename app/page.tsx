import { Nav, Shell } from "@/components/Shell";
import Hero from "@/components/Hero";
import { Bento, Cta, Faq, Footer, Frameworks, Process, Results } from "@/components/Sections";

export default function Home() {
  return (
    <Shell>
      <Nav />
      <main>
        <Hero />
        <Frameworks />
        <Bento />
        <Process />
        <Results />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </Shell>
  );
}
