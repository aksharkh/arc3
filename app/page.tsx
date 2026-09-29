import { Nav, Shell } from "@/components/Shell";
import Hero from "@/components/Hero";
import { Approach, Contact, Expand, Expertise, Footer, Statement } from "@/components/Sections";

export default function Home() {
  return (
    <Shell>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Expand />
        <Expertise />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}
