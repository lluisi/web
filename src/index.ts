import { Hono } from 'hono'
import Template from './components/Template'
import Other from './components/Other'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// Load content
const enContent = {
  lang: 'en',
  meta: {
    title: 'Lluís Inglès Elias - CTO',
    description: 'Personal website of Lluís Inglès Elias, CTO and technology leader'
  },
  skills: ['Cloud Architecture', 'AWS', 'PHP', 'NodeJS', 'Leadership'],
  hero: {
    role: 'Chief Technology Officer',
    about: [
      'Technology leader with experience in scaling teams and products.',
      'Currently working as CTO at <a href="https://www.exoticca.com" target="_blank" rel="noopener noreferrer">Exoticca</a>.'
    ]
  },
  nav: {
    darkModeLabel: 'Toggle dark mode'
  },
  isEn: true,
  isCa: false
}
/*
app.get('/', (c) => {
  return c.html(<Template {...enContent} />)
})
*/



app.get("/public/*", async (ctx) => {
  return await ctx.env.ASSETS.fetch(ctx.req.raw)
})

export default app