'use client'

import Link from '@/components/no-prefetch-link'

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2 md:col-span-1">
            <div className="text-3xl font-black tracking-tighter text-black mb-8">
               band<span className="text-primary">.</span>up
            </div>
            <p className="text-neutral-500 text-base leading-snug font-normal">
              Industrial precision in English language assessment.
            </p>
          </div>

          <div>
            <h4 className="font-black mb-8 text-sm uppercase tracking-[0.3em]">Platform</h4>
            <ul className="space-y-4 text-neutral-400 text-sm font-bold uppercase tracking-widest">
              <li><Link className="hover:text-primary transition-colors" href="/dashboard">Mock Exams</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/writing">AI Writing</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/dashboard/speaking">Speaking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-sm uppercase tracking-[0.3em]">Resources</h4>
            <ul className="space-y-4 text-neutral-400 text-sm font-bold uppercase tracking-widest">
              <li><Link className="hover:text-primary transition-colors" href="#">Documentation</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Logistics</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Help Desk</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-sm uppercase tracking-[0.3em]">Legal</h4>
            <ul className="space-y-4 text-neutral-400 text-sm font-bold uppercase tracking-widest">
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-black text-black text-xs font-black uppercase tracking-[0.4em]">
          <p>&copy; {new Date().getFullYear()} band<span className="text-primary">.</span>up International</p>
          <div className="flex gap-10 mt-6 md:mt-0">
            <Link className="hover:text-primary transition-colors" href="#">Twitter</Link>
            <Link className="hover:text-primary transition-colors" href="#">LinkedIn</Link>
            <Link className="hover:text-primary transition-colors" href="#">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
