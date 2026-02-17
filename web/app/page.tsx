
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <span className="text-xl font-bold tracking-tight">HunarHub</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Explore Projects</Link>
          <Link href="/internships" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Find Internships</Link>
          <Link href="/signup?role=recruiter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">For Recruiters</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wide border border-indigo-100 dark:border-indigo-800">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Now Live for Students & Startups
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
            Showcase Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Hunar</span>. <br />
            Get Hired based on <span className="underline decoration-indigo-400 decoration-wavy underline-offset-4 decoration-4">Skills</span>.
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Stop relying on just a degree. Build a verification-ready portfolio, earn skill badges, and connect directly with recruiters looking for proof of work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup?role=student"
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-xl"
            >
              Join as Student
            </Link>
            <Link
              href="/signup?role=recruiter"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-full font-semibold text-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition duration-200"
            >
              I'm Hiring
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-24 px-4">
          <FeatureCard
            title="Project-First Identity"
            description="Your profile is built on projects, not just claims. Upload code, designs, or case studies."
            icon="🚀"
          />
          <FeatureCard
            title="Verified Skill Badges"
            description="Earn badges through peer reviews and assessments. prove you actually know your stuff."
            icon="🎖️"
          />
          <FeatureCard
            title="Direct Applications"
            description="One-click apply to internships. Recruiters see your best work instantly."
            icon="💼"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} HunarHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-600">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group text-left">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
