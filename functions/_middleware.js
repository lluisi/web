const cookieName = "lang-cookie"
const catPath = "/ca"

const switchLang = async (context) => {
  const url = new URL(context.request.url)
  
  // if homepage
  if (url.pathname === "/") {
    // Check for existing cookie
    let cookie = context.request.headers.get("cookie")
    
    // if cookie lang-cookie=ca then redirect to /ca
    if (cookie && cookie.includes(`${cookieName}=ca`)) {
      return Response.redirect(`${url.origin}${catPath}`, 302)
    } else {
      // if no cookie set, set a cookie value to "en" and stay on homepage
      let version = "en" // default version
      const response = Response.redirect(`${url.origin}/`, 302)
      response.headers.append("Set-Cookie", `${cookieName}=${version}; path=/`)
      return response
    }
  }
  return context.next()
}

export const onRequest = [switchLang]