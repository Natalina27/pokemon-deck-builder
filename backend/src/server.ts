import Fastify from 'fastify'
import cors from '@fastify/cors'
import { deckRoutes } from './routes/decks'

const app = Fastify({ logger: true })

const start = async () => {
    await app.register(cors, { origin: 'http://localhost:5173' })
    await app.register(deckRoutes)
  
    await app.listen({ port: 3000 })
  }
  
  start()

