import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { Models, NightPhoto } from "@/components/site/models";
import { Compare } from "@/components/site/compare";
import { Pricing } from "@/components/site/pricing";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { RevealObserver } from "@/components/site/reveal-observer";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Features />
        <NightPhoto />
        <Models />
        <Compare />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
