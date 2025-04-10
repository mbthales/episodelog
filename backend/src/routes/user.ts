import { signup, signin } from "../controllers/user";
import type { FastifyInstance } from "fastify";

export function userRoutes(fastify: FastifyInstance) {
    fastify.post('/signup', signup);
    fastify.post('/signin', signin);
}