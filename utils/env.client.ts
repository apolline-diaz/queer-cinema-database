import { z } from 'zod';

const env = z
  .object({
    BETTER_AUTH_URL: z.url().optional(),
  })
  .parse({
    BETTER_AUTH_URL:
      import.meta.env.VITE_PUBLIC_BETTER_AUTH_URL ||
      (typeof globalThis.window !== 'undefined' ? globalThis.window.location.origin : undefined),
  });

export { env };
