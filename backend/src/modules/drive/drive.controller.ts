import type { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { validateData } from "@/common/utils/validateData";
import { driveService } from "./drive.service";

export async function driveConnect(
  request: FastifyRequest,
  reply: FastifyReply,
) {}

export async function driveCallback(
  request: FastifyRequest,
  reply: FastifyReply,
) {}

export async function driveAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {}

export async function driveAccountDelete(
  request: FastifyRequest,
  reply: FastifyReply,
) {}
