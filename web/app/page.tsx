4
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <div className="flex flex-col min-h-screen bg-white text-neutral-900">
            <header className="px-6 py-4 flex items-center justify-between border-b border-orange-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
                        H
                    </div>
                    <span className="text-xl font-bold tracking-tight">HunarHub</span>
                </div>

                <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
                    <Link href="/internships" className="hover:text-orange-600 transition">
                        Explore Internships
                    </Link>
                    <Link href="/jobs" className="hover:text-orange-600 transition">
                        Explore Jobs
                    </Link>
                    <Link href="/signup?role=recruiter" className="hover:text-orange-600 transition">
                        For Companies
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-orange-600">
                                Log in
                            </Link>
                            <Link
                                href="/signup?role=student"
                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-orange-500/30 transition"
                            >
                                Join as Student
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1">
                <section className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(251,146,60,0.16),_transparent_55%)]" />
                    <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold uppercase tracking-wide border border-orange-100">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                Skill-first career launchpad
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                Launch Your Career with{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500">
                                    Real MNC Opportunities
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-neutral-600 max-w-xl">
                                HunarHub connects skilled students with verified companies and top MNCs for internships and
                                full-time roles. Show your skills, apply in one click, and get noticed faster.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    href="/internships"
                                    className="w-full sm:w-auto px-7 py-3 bg-neutral-900 text-white rounded-full font-semibold text-sm md:text-base hover:scale-[1.02] hover:shadow-xl hover:shadow-neutral-900/20 transition"
                                >
                                    Explore Internships
                                </Link>
                                <Link
                                    href="/signup?role=recruiter"
                                    className="w-full sm:w-auto px-7 py-3 rounded-full border border-orange-200 bg-white text-orange-600 font-semibold text-sm md:text-base hover:bg-orange-50 transition"
                                >
                                    Hire Talent
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                                        ✓
                                    </span>
                                    <span>Skill-based matching</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">
                                        ✓
                                    </span>
                                    <span>Verified companies only</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-70" />
                            <div className="absolute -bottom-16 -left-6 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-70" />

                            <div className="relative rounded-3xl bg-white/10 border border-white/30 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-2xl text-white">
                                        🎓
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-500">Student Dashboard</p>
                                        <p className="text-lg font-semibold">Aditi, CS Undergrad</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-orange-100 p-3 flex flex-col gap-1">
                                        <span className="text-neutral-500">Actively Applying</span>
                                        <span className="text-lg font-bold text-neutral-900">6 Internships</span>
                                    </div>
                                    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-orange-100 p-3 flex flex-col gap-1">
                                        <span className="text-neutral-500">Shortlisted By</span>
                                        <span className="text-lg font-bold text-neutral-900">3 Companies</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-neutral-200 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-neutral-500">Hiring from HunarHub</p>
                                        <p className="text-sm font-semibold text-neutral-900">Top MNC Network</p>
                                    </div>
                                    <div className="flex -space-x-3">
                                        <LogoBubble label="G" />
                                        <LogoBubble label="M" />
                                        <LogoBubble label="A" />
                                        <LogoBubble label="T" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-neutral-50">
                    <div className="max-w-6xl mx-auto px-6 space-y-12">
                        <div className="max-w-3xl mx-auto text-center space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold">What is HunarHub?</h2>
                            <p className="text-neutral-600">
                                HunarHub is a skill-based hiring platform where students showcase their skills and apply directly
                                to verified companies and MNCs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FeatureCard
                                icon="✅"
                                title="Verified Companies"
                                description="All companies are verified by the HunarHub team before posting internships and jobs."
                            />
                            <FeatureCard
                                icon="🎯"
                                title="Skill-Based Matching"
                                description="Students get matched with roles based on skills, interests, and projects—not just degrees."
                            />
                            <FeatureCard
                                icon="⚡"
                                title="Direct Application System"
                                description="Upload your resume once and apply instantly to multiple companies in one click."
                            />
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">How We Help You Get Internships & Jobs</h2>
                            <p className="text-neutral-600">
                                A simple, guided journey from profile creation to interview calls, built for students starting their
                                careers.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 mt-6">
                                <TimelineStep
                                    step="01"
                                    title="Create Your Profile"
                                    description="Add your education, skills, and upload a resume that highlights your strengths."
                                />
                                <TimelineStep
                                    step="02"
                                    title="Discover Opportunities"
                                    description="Browse verified internships and jobs from startups and MNCs."
                                />
                                <TimelineStep
                                    step="03"
                                    title="Apply in One Click"
                                    description="Use your saved profile and resume to apply instantly to multiple roles."
                                />
                                <TimelineStep
                                    step="04"
                                    title="Get Interview Call"
                                    description="Companies review your profile and contact you directly for interviews."
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 space-y-6 shadow-lg shadow-orange-100">
                            <p className="text-sm font-semibold text-orange-600">Student Journey</p>
                            <p className="text-xl font-bold text-neutral-900">
                                Build once. Apply everywhere. Track every application from your HunarHub dashboard.
                            </p>
                            <ul className="space-y-3 text-sm text-neutral-600">
                                <li>• Centralized view of all internships and jobs you have applied to</li>
                                <li>• Save time with reusable profile data and resume</li>
                                <li>• Stay updated with application status and interview calls</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-neutral-50">
                    <div className="max-w-6xl mx-auto px-6 space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold">Connecting You with Leading Companies</h2>
                            <p className="text-neutral-600 max-w-2xl mx-auto">
                                We partner with startups, mid-size companies, and MNCs to provide real-world opportunities across
                                technology, business, and more.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                            <CompanyLogo label="Google" />
                            <CompanyLogo label="Microsoft" />
                            <CompanyLogo label="Amazon" />
                            <CompanyLogo label="Infosys" />
                            <CompanyLogo label="TCS" />
                            <CompanyLogo label="Wipro" />
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6 space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold">Why Students Trust HunarHub</h2>
                            <p className="text-neutral-600 max-w-2xl mx-auto">
                                A transparent, outcome-focused platform designed to help you land your first internship or job
                                faster.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <StatCard value="10,000+" label="Students" />
                            <StatCard value="500+" label="Companies" />
                            <StatCard value="2,000+" label="Internships" />
                            <StatCard value="95%" label="Placement Success" />
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Career?</h2>
                            <p className="text-sm md:text-base text-orange-50/90 max-w-md">
                                Build your profile today and connect with companies actively looking for students with your skills.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    href="/signup?role=student"
                                    className="w-full sm:w-auto px-7 py-3 bg-white text-orange-600 rounded-full font-semibold text-sm md:text-base hover:bg-orange-50 transition"
                                >
                                    Join as Student
                                </Link>
                                <Link
                                    href="/internships"
                                    className="w-full sm:w-auto px-7 py-3 rounded-full border border-orange-100 text-white font-semibold text-sm md:text-base hover:bg-orange-600/40 transition"
                                >
                                    Explore Jobs & Internships
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/30 p-6 md:p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                    😊
                                </div>
                                <div>
                                    <p className="text-sm text-orange-50/80">Student Testimonial</p>
                                    <p className="font-semibold">“HunarHub helped me get my first MNC internship.”</p>
                                </div>
                            </div>
                            <p className="text-sm text-orange-50/90">
                                “I built my profile on HunarHub with projects and a strong resume. Within a few weeks, I started
                                getting interview calls from multiple companies. The one-click apply feature saved me so much
                                time.”
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-neutral-50">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1 rounded-3xl bg-white border border-neutral-200 p-6 md:p-8 space-y-4 shadow-lg shadow-neutral-200/60">
                            <h2 className="text-3xl md:text-4xl font-bold">Hire Skilled Talent from HunarHub</h2>
                            <p className="text-neutral-600">
                                Access pre-screened students ready for internships and entry-level jobs, with the skills your team
                                actually needs.
                            </p>
                            <ul className="space-y-3 text-sm text-neutral-600">
                                <li>• Post internships and jobs in minutes</li>
                                <li>• Filter candidates by skills, projects, and availability</li>
                                <li>• Shortlist and contact candidates directly from the dashboard</li>
                            </ul>
                            <div className="pt-3">
                                <Link
                                    href="/signup?role=recruiter"
                                    className="inline-flex items-center px-7 py-3 rounded-full bg-neutral-900 text-white text-sm md:text-base font-semibold hover:opacity-90 transition"
                                >
                                    Post Internship
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white p-6 md:p-8 space-y-6">
                            <p className="text-sm text-neutral-300">For Companies</p>
                            <p className="text-xl font-semibold">
                                “HunarHub gives us a focused pool of students who already prove their skills with real projects.”
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                                    🧑‍💼
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">HR Lead, Tech Startup</p>
                                    <p className="text-xs text-neutral-400">Hired multiple interns via HunarHub</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6 space-y-8">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
                            <p className="text-neutral-600 max-w-2xl mx-auto">
                                Students and companies across India are building their careers and teams with HunarHub.
                            </p>
                        </div>

                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
                            <TestimonialCard
                                role="Student"
                                name="Riya, B.Tech CSE"
                                quote="I discovered multiple internships and finally landed an offer from an MNC—everything from one dashboard."
                            />
                            <TestimonialCard
                                role="Company"
                                name="Talent Acquisition Manager"
                                quote="The quality of applicants on HunarHub is impressive. We quickly found students who matched our tech stack."
                            />
                            <TestimonialCard
                                role="Student"
                                name="Arjun, MCA"
                                quote="The platform made it simple to apply, track, and respond to interview calls without messy spreadsheets."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-neutral-200 bg-white py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-neutral-500 text-sm">
                        © {new Date().getFullYear()} HunarHub. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <Link href="#" className="hover:text-orange-600">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-orange-600">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-orange-600">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-orange-100 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group text-left">
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 group-hover:text-orange-600 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
        </div>
    )
}

function TimelineStep({
    step,
    title,
    description,
}: {
    step: string
    title: string
    description: string
}) {
    return (
        <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                    {step}
                </div>
                <span className="text-sm font-semibold text-neutral-900">{title}</span>
            </div>
            <p className="text-xs text-neutral-600">{description}</p>
            <div className="hidden md:block absolute -bottom-4 left-4 right-0 h-px bg-gradient-to-r from-orange-200 to-transparent" />
        </div>
    )
}

function CompanyLogo({ label }: { label: string }) {
    return (
        <div className="aspect-[3/1] rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-sm font-semibold text-neutral-500 hover:border-orange-300 hover:bg-white hover:text-neutral-900 transition-all duration-200 grayscale hover:grayscale-0">
            {label}
        </div>
    )
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-6 py-5 text-center">
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-900">{value}</p>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">{label}</p>
        </div>
    )
}

function LogoBubble({ label }: { label: string }) {
    return (
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs border-2 border-white shadow-sm">
            {label}
        </div>
    )
}

function TestimonialCard({ role, name, quote }: { role: string; name: string; quote: string }) {
    return (
        <div className="min-w-[260px] max-w-sm snap-center rounded-3xl bg-white/70 backdrop-blur-xl border border-neutral-200 px-6 py-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-orange-600">{role}</p>
                    <p className="text-sm font-medium text-neutral-900">{name}</p>
                </div>
                <div className="flex text-orange-400 text-xs">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">{quote}</p>
        </div>
    )
}
