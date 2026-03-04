'use client'

import { useState } from 'react'
import Link from '@/components/no-prefetch-link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ForceLightTheme } from '@/components/force-light-theme'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'

export default function ForBusinessPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      learning_centre_name: formData.get('learning_centre_name') as string,
      students_size: formData.get('students_size') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/for-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Something went wrong. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <ForceLightTheme />
      <Header />

      <main className="flex-1">
        <section className="py-24 lg:py-32 border-b border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                For Learning Centres
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-black mb-8 leading-[0.85] tracking-tighter uppercase">
                Partner <br />
                With <span className="text-primary">Us.</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-600 leading-snug font-normal tracking-tight">
                Bring AI-powered IELTS preparation to your learning centre. Fill out the form below and we&apos;ll get in touch.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              {success ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                    Thank You!
                  </h2>
                  <p className="text-lg text-neutral-600 mb-8">
                    We&apos;ve received your inquiry and will get back to you soon.
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-primary text-white px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-primary/90 transition-all rounded-lg"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learning_centre_name" className="text-xs font-black uppercase tracking-widest">
                      Learning Centre Name
                    </Label>
                    <Input
                      id="learning_centre_name"
                      name="learning_centre_name"
                      type="text"
                      placeholder="Your learning centre name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="students_size" className="text-xs font-black uppercase tracking-widest">
                      Number of Students
                    </Label>
                    <Input
                      id="students_size"
                      name="students_size"
                      type="number"
                      placeholder="e.g. 150"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest">
                      Message <span className="text-neutral-400 normal-case tracking-normal font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your needs..."
                      rows={5}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 font-black uppercase text-[11px] tracking-widest hover:bg-primary/90 transition-all rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
