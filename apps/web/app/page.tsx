import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { FeatureMatrix } from "@/components/home/FeatureMatrix";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TemplateGallery } from "@/components/home/TemplateGallery";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/Faq";
import { TestimonialsAndCta } from "@/components/home/TestimonialsAndCta";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-accent selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <TemplateGallery />
        <FeatureMatrix />
        <Faq />
        <TestimonialsAndCta />
      </main>
    </div>
  );
}
