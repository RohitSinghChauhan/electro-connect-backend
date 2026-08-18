export class ApiResponse<T = unknown> {
    success = true;
    statusCode: number;
    message: string;
    data: T | null;
    meta: unknown;
  
    constructor(
      statusCode: number,
      message: string,
      data: T | null = null,
      meta: unknown = null
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.meta = meta;
    }
  }