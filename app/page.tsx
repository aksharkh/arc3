import { Nav, Providers } from "@/components/chrome";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Pillars from "@/components/Pillars";
import Services from "@/components/Services";
import Method from "@/components/Method";
import { Proof, Voices } from "@/components/Proof";
import Closing from "@/components/Closing";

export default function Home() {
  return (
    <Providers>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Pillars />
        <Services />
        <Method />
        <Proof />
        <Voices />
        <Closing />
      </main>
    </Providers>
  );
}
