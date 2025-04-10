
import { signupSchema, signinSchema } from '../validators/user';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcrypt';
import { AuthError } from '../utils/errors';
import jwt from 'jsonwebtoken';

import type { FastifyRequest } from 'fastify';

export async function signupService(req: FastifyRequest) {
    const parsed = signupSchema.parse(req.body);

    const password = await hash(parsed.password, 10);

    const timestamp = Math.floor(Date.now() / 1000)

    const newUser = {
        email: parsed.email,
        username: parsed.username,
        createdAt: timestamp,
        updatedAt: timestamp,
        password,
    };

    const user = await db.insert(users).values(newUser).returning();

    return user;
}

export async function signinService(req: FastifyRequest) {
    const parsed = signinSchema.parse(req.body);

    const user = await db.select().from(users).where(eq(users.username, parsed.username)).limit(1);

    if (user.length === 0 || !user[0]) {
        throw new AuthError('Invalid username or password');
    }

    const isPasswordValid = await compare(parsed.password, user[0].password);

    if (!isPasswordValid) {
        throw new AuthError('Invalid username or password');
    }

    const accessToken = jwt.sign({ id: user[0].id }, 'teste', {
        expiresIn: '15minutes',
    });

    const refreshToken = jwt.sign({ id: user[0].id }, 'teste', {
        expiresIn: '7d',
    });

    return { user: user[0], accessToken, refreshToken };
}