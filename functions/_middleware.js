const cookieName = "lang-cookie"
const catPath = "/ca"

const handleLanguageCookie = (request) => {
  const cookie = request.headers.get("cookie")
  
  // If cookie exists, return its value
  if (cookie && cookie.includes(cookieName)) {
    const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`))
    return {
      exists: true,
      value: match ? match[1] : 'en'
    }
  }
  
  // If no cookie, prepare to set default
  return {
    exists: false,
    value: 'en'
  }
}

const switchLang = async (context) => {
  const url = new URL(context.request.url)
  
  // if homepage
  if (url.pathname === "/") {
    const cookieStatus = handleLanguageCookie(context.request)
    
    // Handle Catalan
    if (cookieStatus.exists && cookieStatus.value === 'ca') {
      return Response.redirect(`${url.origin}${catPath}`, 302)
    }
    
    // Handle English or no cookie
    const response = Response.redirect(`${url.origin}/`, 302)
    
    // Set cookie if it didn't exist
    if (!cookieStatus.exists) {
      response.headers.append("Set-Cookie", `${cookieName}=${cookieStatus.value}; path=/`)
    }
    
    return response
  }
  
  return context.next()
}

export const onRequest = [switchLang]