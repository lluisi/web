const cookieName = "lang-cookie"
const catPath = "/ca"

const switchLang = async (context) => {
  const url = new URL(context.request.url)
  
  // if homepage
  if (url.pathname === "/") {
    // Check for existing cookie
    let cookie = context.request.headers.get("cookie")
    
    // if cookie lang-cookie=ca then change the request to go to /ca
    if (cookie && cookie.includes(`${cookieName}=ca`)) {
      url.pathname = catPath
      return context.env.ASSETS.fetch(url)
    } else {
      // if no cookie set, set a cookie value to "en"
      let version = "en" // default version
      const asset = await context.env.ASSETS.fetch(url)
      let response = new Response(asset.body, asset)
      response.headers.append("Set-Cookie", `${cookieName}=${version}; path=/`)
      return response
    }
  }
  return context.next()
}

export const onRequest = [switchLang]