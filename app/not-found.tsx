import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent dark:text-accent-light">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Page not found.</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-10">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
