'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { CheckIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type FieldName = 'name' | 'email' | 'message';
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'submitting' | 'success';

const FIELDS: FieldName[] = ['name', 'email', 'message'];
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const initialValues: Values = { name: '', email: '', message: '' };

function validate(values: Values): Errors {
  const errors: Errors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < 2) errors.name = 'Your name should be at least 2 characters.';

  const email = values.email.trim();
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address, like name@example.com.';

  const message = values.message.trim();
  if (!message) errors.message = 'Please write a short message.';
  else if (message.length < MESSAGE_MIN) errors.message = `Your message should be at least ${MESSAGE_MIN} characters.`;
  else if (message.length > MESSAGE_MAX) errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;

  return errors;
}

const labelClass = 'block text-sm font-medium text-neutral-900 dark:text-neutral-100';

function inputClass(invalid: boolean) {
  return cn(
    'mt-2 block w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-4 dark:bg-black dark:text-white dark:placeholder:text-neutral-600',
    invalid
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
      : 'border-neutral-300 focus:border-accent focus:ring-accent/15 dark:border-neutral-700 dark:focus:border-accent-light',
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

/**
 * Join / contact form with client-side validation.
 * Errors appear once a field is left (blur) or on submit; the first invalid field gets focus.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submitted, setSubmitted] = useState({ name: '', email: '' });

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const errors = validate(values);
  const errorFor = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name as FieldName]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    setTouched({ name: true, email: true, message: true });
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus('submitting');
    // TODO: send `values` to a real backend (Next.js route handler, Formspree, Google Forms, etc.).
    // For now nothing leaves the browser: we only simulate a short request.
    timerRef.current = setTimeout(() => {
      setSubmitted({ name: values.name.trim().split(/\s+/)[0], email: values.email.trim() });
      setStatus('success');
    }, 700);
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <Card interactive={false} className="flex h-full flex-col items-center justify-center p-10 text-center sm:p-12">
        <div role="status" className="flex flex-col items-center">
          <div className="flex h-14 w-14 animate-fade-up items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="h-7 w-7" />
          </div>
          <h2
            ref={successRef}
            tabIndex={-1}
            className="mt-6 text-2xl font-semibold tracking-tight focus:outline-none sm:text-3xl"
          >
            Thanks, {submitted.name}!
          </h2>
          <p className="mt-3 max-w-sm text-pretty leading-relaxed text-neutral-600 dark:text-neutral-400">
            Your message is on its way. We will get back to you at{' '}
            <span className="font-medium text-neutral-900 dark:text-white">{submitted.email}</span> soon.
          </p>
        </div>
        <Button variant="outline" className="mt-8" onClick={reset}>
          Send another message
        </Button>
      </Card>
    );
  }

  const messageLength = values.message.trim().length;
  const nameError = errorFor('name');
  const emailError = errorFor('email');
  const messageError = errorFor('message');

  return (
    <Card interactive={false} className="p-8 sm:p-10">
      <form noValidate onSubmit={handleSubmit} aria-label="Join Apple Club" className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Name
            </label>
            <input
              ref={(el) => {
                fieldRefs.current.name = el;
              }}
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your full name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'contact-name-error' : undefined}
              className={inputClass(Boolean(nameError))}
            />
            <FieldError id="contact-name-error" message={nameError} />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              ref={(el) => {
                fieldRefs.current.email = el;
              }}
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'contact-email-error' : undefined}
              className={inputClass(Boolean(emailError))}
            />
            <FieldError id="contact-email-error" message={emailError} />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="contact-message" className={labelClass}>
              Message
            </label>
            <span
              id="contact-message-count"
              className={cn(
                'text-xs tabular-nums',
                messageLength > MESSAGE_MAX ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500',
              )}
            >
              {messageLength}/{MESSAGE_MAX}
            </span>
          </div>
          <textarea
            ref={(el) => {
              fieldRefs.current.message = el;
            }}
            id="contact-message"
            name="message"
            rows={6}
            required
            placeholder="Tell us a bit about yourself and what you would like to do in the club."
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(messageError)}
            aria-describedby={cn('contact-message-count', messageError && 'contact-message-error')}
            className={cn(inputClass(Boolean(messageError)), 'resize-y')}
          />
          <FieldError id="contact-message-error" message={messageError} />
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">All fields are required.</p>
          <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full sm:w-auto">
            {status === 'submitting' ? 'Sending...' : 'Send message'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
