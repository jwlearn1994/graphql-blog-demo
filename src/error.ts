import { GraphQLError, GraphQLErrorOptions } from 'graphql'

class ForbiddenError extends GraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)
    this.name = 'ForbiddenError'
  }
}

export {
  ForbiddenError,
}