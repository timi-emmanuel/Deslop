import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { FeatureMatrix } from "@/components/FeatureMatrix";
import { HowItWorks } from "@/components/HowItWorks";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { TestimonialsAndCta } from "@/components/TestimonialsAndCta";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0A0D14] selection:bg-[#FF4800] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <FeatureMatrix />
        <HowItWorks />
        <TemplateGallery />
        {/* <Pricing /> */}
        <Faq />
        <TestimonialsAndCta />
      </main>
    </div>
  );
}
