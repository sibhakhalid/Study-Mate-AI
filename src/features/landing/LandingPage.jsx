import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkflowShowcase from "./components/WorkflowShowcase";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import ProductPreview from "./components/ProductPreview";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WorkflowShowcase />
      <Features />
      <HowItWorks />
      <ProductPreview />
      <ClosingCta />
      <Footer />
    </div>
  );
}
