import { Features } from "@/components/homepage/Features";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { SuccessStory } from "@/components/homepage/SuccessStory";
import { Navbar } from "@/components/layout/Navbar";

const dividerClassName =
  "landing-divider mx-auto h-10 max-w-[1440px] border-x border-border bg-surface";

function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-0">
        <Hero />
        <HowItWorks />
        <div className="px-4 sm:px-6 lg:px-8">
          <div className={dividerClassName} />
        </div>
        <Features />
        <div className="px-4 sm:px-6 lg:px-8">
          <div className={dividerClassName} />
        </div>
        <SuccessStory />
      </main>
    </>
  );
}

export default Home;
