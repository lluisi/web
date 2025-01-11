export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // Skip middleware for assets
  if (url.pathname.startsWith('/assets/')) {
    return context.next();
  }

  // Get user's preferred languages from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());

  // If user is accessing Catalan version or any other path, continue
  if (url.pathname !== '/') {
    return context.next();
  }

  // Only redirect to Catalan version if user is on the root path
  // and prefers Catalan (first visit)
  if (url.pathname === '/' && (
    preferredLanguages.includes('ca') ||
    preferredLanguages.includes('ca-es')
  )) {
    // Redirect to Catalan version
    return Response.redirect(`${url.origin}/ca/`, 302);
  }

  // For all other cases, continue to the requested version
  return context.next();
} 