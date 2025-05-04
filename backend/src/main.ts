import Fastify from 'fastify'
import 'dotenv/config'
import cors from '@fastify/cors'
import { userRoutes } from './routes/user'

const fastify = Fastify({
  logger: true,
})

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
})

userRoutes(fastify)

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
