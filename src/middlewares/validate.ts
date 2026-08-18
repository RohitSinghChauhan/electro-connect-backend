import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type RequestPart = "body" | "query" | "params";

export const validate = (schema: ZodType, source: RequestPart = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed!",
        statusCode: 400,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (source === "query") {
      Object.defineProperty(req, "query", {
        value: result.data,
        enumerable: true,
        configurable: true,
      });
    } else {
      (req as Request & Record<RequestPart, unknown>)[source] = result.data;
    }

    next();
  };
};