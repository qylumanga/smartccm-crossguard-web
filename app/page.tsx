import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LoginForm from "@/components/LoginForm";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <Hero />
        <LoginForm />
      </div>
    </main>
  );
}
