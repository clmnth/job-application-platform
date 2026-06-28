import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Navbar } from "@/components/layout/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-0">
        <Hero />
        <HowItWorks />
      </main>
    </>
  );
}

export default Home;
