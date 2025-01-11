export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // Log the Accept-Language header
  console.log('Accept-Language header:', request.headers.get('Accept-Language'));
  
  // Skip middleware for assets
  if (url.pathname.startsWith('/assets/')) {
    return context.next();
  }

  // Get user's preferred languages from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());
    
  // Log the parsed preferred languages
  console.log('Preferred languages:', preferredLanguages);

  // Check if user is explicitly requesting Catalan version
  if (url.pathname.startsWith('/ca/')) {
    return context.next();
  }

  // Check if user is on the root path and prefers Catalan
  if (url.pathname === '/' && (
    preferredLanguages.includes('ca') ||
    preferredLanguages.includes('ca-es')
  )) {
    // Redirect to Catalan version
    return Response.redirect(`${url.origin}/ca/`, 302);
  }

  // Otherwise, continue to the English version
  return context.next();
} 