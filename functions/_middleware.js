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
  const cookieStatus = handleLanguageCookie(context.request)
  
  // Only redirect if we're not already on the correct path
  if (cookieStatus.value === 'ca' && url.pathname !== catPath) {
    const response = Response.redirect(`${url.origin}${catPath}`, 302)
    cookieStatus.headers.forEach((value, key) => {
      response.headers.append(key, value)
    })
    return response
  }
  
  if (cookieStatus.value === 'en' && url.pathname !== '/') {
    const response = Response.redirect(`${url.origin}/`, 302)
    cookieStatus.headers.forEach((value, key) => {
      response.headers.append(key, value)
    })
    return response
  }
  
  // If we're already on the correct path, just continue
  return context.next()
}

export const onRequest = [switchLang]