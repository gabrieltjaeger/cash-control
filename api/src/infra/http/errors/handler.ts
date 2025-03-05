import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function handler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: "Invalid request data",
      errors: error.errors,
    });
  }

  return response.status(500).send({
    message: "Internal server error",
  });
}
