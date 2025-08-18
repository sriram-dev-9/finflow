import HeroSection from "@/components/ui/hero";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="flex justify-center py-8 bg-slate-100 dark:bg-slate-800">
        <Link 
          href="/dashboard"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
