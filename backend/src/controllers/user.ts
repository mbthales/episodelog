import { ZodError } from "zod";

import { signinService, signupService } from "../services/user";

import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthError } from "../utils/errors";

export async function signup(req: FastifyRequest, res: FastifyReply) {
  try {
    const data = await signupService(req);

    return res.status(200).send({
      data,
      msg: "User signed up successfully",
    });
  } catch (err) {

    if (err instanceof ZodError) {
      return res.status(400).send({
        error: "Invalid data",
        details: err.errors
      });
    } {
      return res.status(500).send({
        error: "Internal Server Error",
        details: err
      });
    }
  }
}

export async function signin(req: FastifyRequest, res: FastifyReply) {
  try {
    const { user, accessToken, refreshToken } = await signinService(req);

    return res.status(200).send({
      data: {
        user,
        accessToken,
      },
      msg: "User signed in successfully",
    }).header("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=None; Secure`);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({
        error: "Invalid data",
        details: err.errors
      });
    } else if (err instanceof AuthError) {
      return res.status(401).send({
        error: "Unauthorized",
        details: err.message
      });

    } else {
      return res.status(500).send({
        error: "Internal Server Error",
        details: err
      });
    }
  }
}

