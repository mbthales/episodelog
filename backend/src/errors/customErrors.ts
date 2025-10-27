export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ExternalApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExternalApiError'
  }
}
