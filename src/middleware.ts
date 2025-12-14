import type { MiddlewareHandler } from 'astro';

/**
 * Middleware to add Content Security Policy headers for development
 * This ensures YouTube embeds and other iframes work correctly in dev mode
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Only add CSP headers in development
  if (import.meta.env.DEV) {
    // Set Content Security Policy to allow YouTube embeds and other iframes
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://giscus.app https://platform.twitter.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://giscus.app; frame-src 'self' https://www.youtube.com https://giscus.app https://platform.twitter.com; object-src 'none'; base-uri 'self';"
    );
  }
  
  return response;
};
