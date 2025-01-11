const cookieName = "lang-cookie"
const catPath = "/ca"

const handleLanguageCookie = (request) => {
  const cookie = request.headers.get("cookie")
  
  // If cookie exists, return its value
  if (cookie && cookie.includes(cookieName)) {
    const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`))
    return {
      value: match ? match[1] : 'en',
      headers: new Headers()
    }
  }
  
  // If no cookie, create headers with Set-Cookie
  const headers = new Headers()
  headers.append("Set-Cookie", `${cookieName}=en; path=/`)
  
  return {
    value: 'en',
    headers
  }
}

const switchLang = async (context) => {
  const url = new URL(context.request.url)
  
  // if homepage
  //if (url.pathname === "/") {
    const cookieStatus = handleLanguageCookie(context.request)
    
    // Handle Catalan
    if (cookieStatus.value === 'ca') {
      const response = Response.redirect(`${url.origin}${catPath}`, 302)
      cookieStatus.headers.forEach((value, key) => {
        response.headers.append(key, value)
      })
      return response
    }
    
    // Handle English
    const response = Response.redirect(`${url.origin}/`, 302)
    cookieStatus.headers.forEach((value, key) => {
      response.headers.append(key, value)
    })
    return response
  //}
  
  return context.next()
}

export const onRequest = [switchLang]