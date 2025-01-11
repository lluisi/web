export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  
  // Skip middleware for assets
  if (url.pathname.startsWith('/assets/')) {
    return context.next();
  }

  // Check for language preference cookie
  const cookies = request.headers.get('cookie') || '';
  const hasPreferredLang = cookies.includes('preferred_lang=');
  const preferredLang = hasPreferredLang ? 
    cookies.split('preferred_lang=')[1].split(';')[0] : null;

  // If user has explicitly chosen a language via cookie, respect that
  if (preferredLang === 'en') {
    return context.next();
  }
  if (preferredLang === 'ca') {
    return Response.redirect(`${url.origin}/ca/`, 302);
  }

  // Get user's preferred languages from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());

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