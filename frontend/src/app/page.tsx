import Link from '@/components/no-prefetch-link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Timer,
  Pencil,
  Zap,
  CalendarDays,
} from 'lucide-react'
import { getUser } from '@/actions/auth'
import { RotatingText } from '@/components/rotating-text'
import { ForceLightTheme } from '@/components/force-light-theme'
import { Suspense } from 'react'

async function AuthHeader() {
  const user = await getUser()
  return (
    <Header
      isLoggedIn={!!user}
      userEmail={user?.email}
      userAvatar={user?.user_metadata?.avatar_url}
      userName={user?.user_metadata?.full_name}
    />
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <ForceLightTheme />
      <Suspense fallback={<Header />}>
        <AuthHeader />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section */}
        <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden border-b border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              AI-Powered Band Scoring Live
            </div>

            <h1 className="text-5xl md:text-[140px] font-black text-black mb-8 md:md-12 leading-[0.9] tracking-tighter uppercase font-bold">
              Get Your <br />
              <span className="text-primary">IELTS</span> Band <br className="hidden md:block" /> Score <br className="md:hidden" /><RotatingText />
            </h1>

            <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-end">
              <p className="text-xl md:text-2xl text-black max-w-xl leading-snug font-normal tracking-tight">
                Practice with real exam questions and get instant AI-powered feedback. Target band 5.0 to{' '}
                <span className="text-primary font-black">8.0+</span> with Swiss-style precision.
              </p>
              <Link
                href="/dashboard/reading"
                className="md:hidden inline-block bg-primary text-[13px] text-white px-6 py-3.5 font-black hover:bg-primary/90 transition-all uppercase tracking-widest rounded-lg text-center mt-6"
              >
                Free Mock Test
              </Link>
              {/* <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 px-10 py-5 rounded-none font-black text-sm tracking-tight transition-all uppercase text-center"
                >
                  Start Mock Test
                </Link>
              </div> */}
            </div>
          </div>
        </header>

        {/* Methodology / How it Works */}
        <section className="py-32 bg-white border-b border-black" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-24">
              <h2 className="text-5xl md:text-8xl font-black text-black mb-4 uppercase tracking-tighter font-bold">Methodology</h2>
              <div className="h-3 w-32 bg-primary"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 md:p-12 border border-black rounded-2xl hover:bg-neutral-50 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-6 md:mb-12 text-primary">Step 01</span>
                <h3 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tighter font-bold">Choose Test</h3>
                <p className="text-neutral-600 leading-snug font-normal text-lg">
                  Select Academic or General training and pick a specific module: Listening, Reading, Writing, or Speaking.
                </p>
              </div>
              <div className="p-6 md:p-12 border border-black rounded-2xl hover:bg-neutral-50 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-6 md:mb-12 text-primary">Step 02</span>
                <h3 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tighter font-bold">Execute Tasks</h3>
                <p className="text-neutral-600 leading-snug font-normal text-lg">
                  Experience a realistic exam interface with strict time constraints and authentic question types.
                </p>
              </div>
              <div className="p-6 md:p-12 border border-black rounded-2xl hover:bg-neutral-50 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-6 md:mb-12 text-primary">Step 03</span>
                <h3 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tighter font-bold">AI Feedback</h3>
                <p className="text-neutral-600 leading-snug font-normal text-lg">
                  Receive an AI-generated band score and detailed breakdown of your performance metrics instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 border-b border-black" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div>
                <h2 className="text-4xl md:text-8xl font-black text-black mb-10 md:mb-16 leading-[0.85] uppercase tracking-tighter font-bold">
                  Superior <br />Mock Tech.
                </h2>

                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <Timer className="text-white w-4 h-4" />
                    </div>
                    <h4 className="font-black text-xl uppercase tracking-tight font-bold">Real Exam Format</h4>
                    <p className="text-neutral-600 font-normal leading-snug">
                      Timed sessions that strictly mimic the official IELTS test environment.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <Pencil className="text-white w-4 h-4" />
                    </div>
                    <h4 className="font-black text-xl uppercase tracking-tight font-bold">Writing Correction</h4>
                    <p className="text-neutral-600 font-normal leading-snug">
                      Deep analysis of grammar, vocabulary range, and coherence.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Zap className="text-white w-4 h-4" />
                    </div>
                    <h4 className="font-black text-xl uppercase tracking-tight font-bold">Instant Band Score</h4>
                    <p className="text-neutral-600 font-normal leading-snug">
                      Predictive scoring models with industrial-grade precision.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <CalendarDays className="text-white w-4 h-4" />
                    </div>
                    <h4 className="font-black text-xl uppercase tracking-tight font-bold">Daily Practice</h4>
                    <p className="text-neutral-600 font-normal leading-snug">
                      Access 500+ fresh questions updated on a weekly cycle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Card */}
              <div className="relative lg:mt-12">
                <div className="border border-black p-10 bg-white rounded-2xl">
                  <div className="flex items-center gap-4 mb-12 border-b border-black pb-6">
                    <div className="w-4 h-4 rounded-full border border-black"></div>
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary">Analytics_v2</div>
                  </div>
                  <div className="space-y-10">
                    <div className="flex items-baseline justify-between border-b border-black pb-8">
                      <span className="text-6xl md:text-9xl font-black tracking-tighter text-primary">8.5</span>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Overall Band</span>
                    </div>
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-12">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Writing</p>
                          <p className="text-5xl font-black text-primary">8.0</p>
                          <div className="h-1.5 bg-primary w-4/5 mt-4"></div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Speaking</p>
                          <p className="text-5xl font-black text-primary">9.0</p>
                          <div className="h-1.5 bg-primary w-full mt-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Analysis Section */}
        <section className="py-32 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-20 border-b border-white/20 pb-12">
              <h2 className="text-4xl md:text-8xl font-black mb-4 uppercase tracking-tighter font-bold">Live Analysis</h2>
              <p className="text-neutral-400 font-normal text-xl">High-precision linguistic feedback engine.</p>
            </div>

            <div className="max-w-5xl border border-white/20 bg-neutral-900 rounded-2xl">
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">AI-Powered Review</p>
                </div>
                <div className="bg-primary text-white px-4 md:px-6 py-2 md:py-3 font-black text-xs md:text-sm uppercase tracking-widest rounded-lg whitespace-nowrap">
                  Band 7.5
                </div>
              </div>
              <div className="p-6 md:p-12">
                <p className="text-2xl md:text-4xl leading-[1.2] font-normal text-white italic">
                  In contemporary society, environmental issues have become a{' '}
                  <span className="bg-primary text-white px-2 not-italic font-black">crucial</span>{' '}
                  topic of discussion. Many argue that governments should take{' '}
                  <span className="border-b-[4px] border-primary font-black not-italic text-primary">decisive</span>{' '}
                  steps to mitigate the effects of climate change. However, individuals also{' '}
                  <span className="underline decoration-[4px] decoration-primary font-black not-italic text-primary">play</span>{' '}
                  a vital role...
                </p>
                <div className="mt-20 grid md:grid-cols-3 gap-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Grammar</p>
                    <p className="text-sm text-neutral-300 leading-snug font-normal">
                      Strong usage of complex structures. Minor subject-verb agreement correction identified.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Lexical Resource</p>
                    <p className="text-sm text-neutral-300 leading-snug font-normal">
                      Exceptional range. Suggested academic collocations for higher precision.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Task Response</p>
                    <p className="text-sm text-neutral-300 leading-snug font-normal">
                      Fully addressed all prompts with clear logical positioning and structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Matrix */}
        {/* <section className="py-32 border-b border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-black text-left mb-24 tracking-tighter uppercase">Comparison Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-[6px] border-black">
                    <th className="py-8 font-black text-neutral-400 uppercase text-[10px] tracking-[0.2em]">Criteria</th>
                    <th className="py-8 px-8 font-black text-black uppercase text-sm tracking-widest">Traditional</th>
                    <th className="py-8 px-8 font-black text-white bg-black uppercase text-sm tracking-widest">ielts.zone AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="py-10 font-black uppercase text-xs tracking-widest">Feedback Speed</td>
                    <td className="py-10 px-8 text-neutral-500 font-normal">2-3 Working Days</td>
                    <td className="py-10 px-8 font-black bg-neutral-50 text-primary">Instant (120s)</td>
                  </tr>
                  <tr>
                    <td className="py-10 font-black uppercase text-xs tracking-widest">Unit Cost</td>
                    <td className="py-10 px-8 text-neutral-500 font-normal">$50.00 - $100.00</td>
                    <td className="py-10 px-8 font-black bg-neutral-50 text-primary">$0.50 Average</td>
                  </tr>
                  <tr>
                    <td className="py-10 font-black uppercase text-xs tracking-widest">Availability</td>
                    <td className="py-10 px-8 text-neutral-500 font-normal">Business Hours Only</td>
                    <td className="py-10 px-8 font-black bg-neutral-50 text-primary">24/7/365 On-Demand</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section> */}

        {/* Pricing Section */}
         {/* <section className="py-32 bg-white" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-24">
              <h2 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase">Plans</h2>
              <div className="h-3 w-32 bg-primary"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <div className="p-16 flex flex-col border-b md:border-b-0 md:border-r border-black">
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Essential</h3>
                <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-12">Casual practice</p>
                <div className="text-8xl font-black mb-16 tracking-tighter">$0</div>
                <ul className="space-y-6 mb-16 flex-grow">
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> 1 Mock Exam / Mo
                  </li>
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> Basic Data Analysis
                  </li>
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight text-neutral-300">
                    <span className="w-3 h-3 bg-neutral-200 inline-block"></span> Writing Correction
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="w-full py-6 border-2 border-primary text-primary font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-white transition-all text-center block"
                >
                  Select Essential
                </Link>
              </div>

              <div className="p-16 flex flex-col bg-black text-white relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3">
                  Most Popular
                </div>
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Premium</h3>
                <p className="text-neutral-400 text-xs font-black uppercase tracking-widest mb-12">Complete Preparation</p>
                <div className="text-8xl font-black mb-16 tracking-tighter">$29</div>
                <ul className="space-y-6 mb-16 flex-grow">
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> Unlimited Exams
                  </li>
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> AI Writing Feedback
                  </li>
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> Speaking Analysis
                  </li>
                  <li className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                    <span className="w-3 h-3 bg-primary inline-block"></span> Progress Tracking
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="w-full py-6 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/90 transition-all text-center block"
                >
                  Go Premium
                </Link>
              </div>
            </div>
          </div>
        </section>  */}

        {/* Support / FAQ Section */}
        {/* <section className="py-32 bg-neutral-50 border-y border-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-6xl font-black text-center mb-20 uppercase tracking-tighter">Support</h2>
            <div className="space-y-0 border border-black divide-y divide-black bg-white">
              <details className="group">
                <summary className="flex justify-between items-center p-10 cursor-pointer font-black uppercase text-xs tracking-[0.2em] select-none hover:bg-neutral-50 transition-colors">
                  AI Accuracy Standards
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform group-open:text-primary" />
                </summary>
                <div className="px-10 pb-10 text-neutral-600 text-base leading-snug font-normal">
                  Our models are calibrated against 500k+ examiner-graded scripts. Deviation is limited to{' '}
                  <span className="text-primary font-black">+/- 0.5 bands</span>.
                </div>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center p-10 cursor-pointer font-black uppercase text-xs tracking-[0.2em] select-none hover:bg-neutral-50 transition-colors">
                  Format Support
                  <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform group-open:text-primary" />
                </summary>
                <div className="px-10 pb-10 text-neutral-600 text-base leading-snug font-normal">
                  Full architectural support for both Academic and General Training formats across all modules.
                </div>
              </details>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-[8px] md:border-[16px] border-primary p-8 md:p-20 text-center bg-white rounded-3xl">
              <h2 className="text-5xl md:text-9xl font-black mb-10 tracking-tighter uppercase leading-[0.8] font-bold">
                Join the <br />
                <span className="text-primary">Standard.</span>
              </h2>
              <p className="text-2xl text-neutral-600 mb-16 max-w-2xl mx-auto font-normal leading-snug">
                The global benchmark for AI-driven IELTS preparation.
              </p>
              <Link
                href="/dashboard/reading"
                className="inline-block bg-primary text-white px-10 md:px-20 py-6 md:py-8 text-sm md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-primary/90 transition-all rounded-xl"
              >
                Start for free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
