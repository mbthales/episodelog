import Fastify from 'fastify'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userShowsTable } from './db/schema';
import { insertUserShowSchema } from './validators/user';
import { ZodError } from 'zod';
import { eq } from 'drizzle-orm';
import cors from '@fastify/cors';

const db = drizzle(process.env.DATABASE_URL!);

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
});

fastify.get('/userShows', async function handler(_, reply) {
    try {
        const shows = await db.select().from(userShowsTable);
        return reply.status(200).send({
            data: shows,
            msg: 'Shows fetched successfully'
        });
    }
    catch (error) {
        return reply.status(500).send({
            error: 'Internal Server Error',
            details: error
        })
    }
})

fastify.post('/userShows', async function handler(request, reply) {
    try {
        const parsed = insertUserShowSchema.parse(request.body);

        const newShow = await db.insert(userShowsTable).values({
            name: parsed.name,
            showId: parsed.showId
        }).returning();

        return reply.status(201).send({
            data: newShow,
            msg: 'Show added successfully'
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return reply.status(400).send({
                error: 'Invalid data',
                details: error.errors
            })
        }

        return reply.status(500).send({
            error: 'Internal Server Error',
            details: error
        })
    }
})

fastify.delete('/userShows/:id', async function handler(request, reply) {
    const { id } = request.params as { id: string };

    try {
        const deletedShow = await db.delete(userShowsTable).where(eq(userShowsTable.showId, Number(id))).returning();

        if (deletedShow.length === 0) {
            return reply.status(404).send({
                error: 'Show not found'
            })
        }

        return reply.status(200).send({
            msg: 'Show removed successfully'
        })
    } catch (error) {
        return reply.status(500).send({
            error: 'Internal Server Error',
            details: error
        })
    }
})

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}