const cookieName = "lang-cookie"
const catPath = "/ca"

const switchLang = async (context) => {
  const url = new URL(context.request.url)
  // if homepage
  if (url.pathname === "/") {
    // if cookie lang-cookie=ca then change the request to go to /ca
    // if no cookie set, set a cookie value to "en"

    let cookie = request.headers.get("cookie")
    // is cookie set?
    if (cookie && cookie.includes(`${cookieName}=ca`)) {
      // pass the request to /ca
      url.pathname = catPath
      return context.env.ASSETS.fetch(url)
    } else {
      let version = "en" // default version
      const asset = await context.env.ASSETS.fetch(url)
      let response = new Response(asset.body, asset)
      response.headers.append("Set-Cookie", `${cookieName}=${version}; path=/`)
      return response
    }
  }
  return context.next()
};

export const onRequest = [switchLang];




/*
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
    //return Response.redirect(`${url.origin}/ca/`, 302);
  }

  // Otherwise, continue to the English version
  return context.next();
} 
*/