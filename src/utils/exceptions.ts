class CustomError extends Error {
  readonly statusCode: number = 400;
  readonly success = false;
  constructor(statusCode?: number, message?: string, options?: ErrorOptions) {
    super(message, options);
    if (statusCode) this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends CustomError {
  readonly message = "Unauthorized";
  readonly statusCode = 401;
  constructor() {
    super();
  }
}

export class NotFoundError extends CustomError {
  readonly message: string = "Data Not Found";
  readonly statusCode = 404;
  constructor(message?: string) {
    super();
    if (message) this.message = message;
  }
}

export class InvalidRequestError extends CustomError {
  readonly message: string = "Bad Request";
  readonly statusCode = 400;
  constructor(message?: string) {
    super();
    if (message) this.message = message;
  }
}
