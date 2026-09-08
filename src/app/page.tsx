import Link from 'next/link'
import {
  ArrowRight,
  Users,
  FolderKanban,
  Receipt,
  BarChart3,
  CheckSquare,
  Clock,
} from 'lucide-react'

const features = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Organize projects with boards, tasks, and timelines. Keep everything on track.',
  },
  {
    icon: Receipt,
    title: 'Invoicing & Payments',
    description: 'Create professional invoices and track payments with ease.',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Manage client relationships, contacts, and communication in one place.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Get insights into your business performance with real-time dashboards.',
  },
  {
    icon: CheckSquare,
    title: 'Task Tracking',
    description: 'Assign tasks, set deadlines, and track progress across all projects.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Log hours automatically and export timesheets for accurate billing.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-sm">FO</span>
            </div>
            <span className="font-semibold text-foreground">FreelancerOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
          Run your agency<br />like a well-oiled machine
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Everything you need to manage clients, projects, invoices, and teams.
          Built for modern freelance businesses.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="https://muadme.gumroad.com/l/FreelancerOS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-150"
          >
            Get Started — $29/mo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://muadme.gumroad.com/l/Freelancer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-150"
          >
            Buy Source Code
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0A0A0D]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8 text-center">
            Everything you need
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 bg-background dark:bg-[#0A0A0D] border border-zinc-200 dark:border-[#151518] rounded-xl"
              >
                <feature.icon className="w-5 h-5 text-muted-foreground mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
          Ready to streamline your workflow?
        </h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of freelancers who manage their business with FreelancerOS.
        </p>
        <Link
          href="https://muadme.gumroad.com/l/FreelancerOS"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-150"
        >
          Get Started — $29/mo <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-2xs">FO</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">FreelancerOS</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
