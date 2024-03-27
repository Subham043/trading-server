export class CustomInputValidationError {
  readonly statusCode = 422;
  readonly success = false;
  readonly message = 'Bad Request';
  readonly errors: Record<string, string>;
  constructor(errors: Record<string, string>) {
    this.errors = errors;
    throw {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
    };
  }
}

export class CustomNotFoundError {
  readonly statusCode = 404;
  readonly success = false;
  readonly message = 'Not Found';
  constructor() {
    throw {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
    };
  }
}

export class CustomInvalidRequestError {
  readonly statusCode = 400;
  readonly success = false;
  private message = 'Not Found';
  constructor(message: string) {
    this.message = message;
    throw {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
    };
  }
}

export class CustomUnauthorizedError {
  readonly statusCode = 401;
  readonly success = false;
  readonly message = 'Unauthorized';
  constructor() {
    throw {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
    };
  }
}
