import { Hero } from "@/components/homepage/Hero";
import { Navbar } from "@/components/layout/Navbar";


function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-0">
       <Hero/>
      </main>
    </>
  );
}

export default Home;
