'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const formSchema = z.object({
  centerName: z.string().min(3, 'Center name must be at least 3 characters'),
  centerType: z.enum(['learning-center', 'test-center', 'coaching', 'university', 'other'], {
    error: 'Please select a center type'
  }),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(3, 'Location is required'),
  studentBase: z.enum(['under-100', '100-500', '500-1000', '1000-5000', 'over-5000'], {
    error: 'Please select your student base'
  }),
  description: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to our terms and conditions'
  })
})

type FormData = z.infer<typeof formSchema>

export function PartnerApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const centerType = watch('centerType')
  const studentBase = watch('studentBase')
  const agreeTerms = watch('agreeTerms')

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitted(true)
        reset()
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-accent bg-accent/5 p-8 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2 text-xl font-bold text-foreground">Application Submitted!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest in partnering with BandUp. Our team will review your application and contact you within 24-48 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Check your email for a confirmation message.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-4">
        <h3 className="text-lg font-semibold text-foreground">Center Information</h3>

        <Field>
          <FieldLabel>Center Name *</FieldLabel>
          <FieldContent>
            <Input
              placeholder="e.g., Global IELTS Academy"
              {...register('centerName')}
              aria-invalid={!!errors.centerName}
            />
            <FieldError errors={errors.centerName ? [errors.centerName] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Center Type *</FieldLabel>
          <FieldContent>
            <Select value={centerType} onValueChange={(value) => setValue('centerType', value as FormData['centerType'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select center type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learning-center">Learning Center</SelectItem>
                <SelectItem value="test-center">Test Centre</SelectItem>
                <SelectItem value="coaching">Coaching Institute</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={errors.centerType ? [errors.centerType] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Location *</FieldLabel>
          <FieldContent>
            <Input
              placeholder="City, Country"
              {...register('location')}
              aria-invalid={!!errors.location}
            />
            <FieldError errors={errors.location ? [errors.location] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Number of Students *</FieldLabel>
          <FieldContent>
            <Select value={studentBase} onValueChange={(value) => setValue('studentBase', value as FormData['studentBase'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select your student base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-100">Less than 100</SelectItem>
                <SelectItem value="100-500">100 - 500</SelectItem>
                <SelectItem value="500-1000">500 - 1,000</SelectItem>
                <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                <SelectItem value="over-5000">Over 5,000</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={errors.studentBase ? [errors.studentBase] : []} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>

        <Field>
          <FieldLabel>Full Name *</FieldLabel>
          <FieldContent>
            <Input
              placeholder="Your full name"
              {...register('fullName')}
              aria-invalid={!!errors.fullName}
            />
            <FieldError errors={errors.fullName ? [errors.fullName] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email Address *</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            <FieldError errors={errors.email ? [errors.email] : []} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone Number *</FieldLabel>
          <FieldContent>
            <Input
              type="tel"
              placeholder="+1234567890"
              {...register('phone')}
              aria-invalid={!!errors.phone}
            />
            <FieldError errors={errors.phone ? [errors.phone] : []} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <h3 className="text-lg font-semibold text-foreground">Additional Details</h3>

        <Field>
          <FieldLabel>Tell us about your center</FieldLabel>
          <FieldContent>
            <Textarea
              placeholder="Share details about your center, current solutions, and why you're interested in partnering with BandUp..."
              className="min-h-24"
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            <FieldDescription>
              This helps us understand your needs and suggest the best solution for you.
            </FieldDescription>
            <FieldError errors={errors.description ? [errors.description] : []} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={(checked) => setValue('agreeTerms', checked as boolean)}
                className="mt-1"
              />
              <span className="text-sm leading-relaxed">
                I agree to BandUp&apos;s terms and conditions and understand that a member of our team will contact me to discuss partnership opportunities.
              </span>
            </div>
          </FieldLabel>
        </Field>
        <FieldError errors={errors.agreeTerms ? [errors.agreeTerms] : []} />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent/90 h-11 disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Application'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We&apos;ll review your application and reach out within 24 hours.
      </p>
    </form>
  )
}
