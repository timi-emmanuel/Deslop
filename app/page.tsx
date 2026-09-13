import { Navbar } from "@/components/Navbar";
import { HeroExtractor } from "@/components/HeroExtractor";
import { SocialProof } from "@/components/SocialProof";
import { HowItWorks } from "@/components/HowItWorks";
import { TemplateGallery } from "@/components/TemplateGallery";
import { FeatureMatrix } from "@/components/FeatureMatrix";
import { TestimonialsAndCta } from "@/components/TestimonialsAndCta";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0D14] selection:bg-[#FF4800] selection:text-white">
      <Navbar />
      <main>
        <HeroExtractor />
        <SocialProof />
        <HowItWorks />
        <TemplateGallery />
        <FeatureMatrix />
        <TestimonialsAndCta />
      </main>
    </div>
  );
}
