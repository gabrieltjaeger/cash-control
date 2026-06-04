import { DomainError } from '@/core/errors/domain-error'
import { ExistingResourceError } from '@/core/errors/existing-resource-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { View } from '@/infra/types/view'

interface PresenterErrorProps {
  error: Error
}

export class PresenterErrorMapper {
  static toView({ error }: PresenterErrorProps): View {
    if (error instanceof DomainError) {
      if (error instanceof ResourceNotFoundError) {
        return {
          statusCode: 404,
          body: {
            message: error.message,
          },
        }
      }

      if (error instanceof ExistingResourceError) {
        return {
          statusCode: 409,
          body: {
            message: error.message,
          },
        }
      }
    }

    console.error(error)
    return {
      statusCode: 500,
      body: {
        message: `Internal server error: ${error.message}`,
      },
    }
  }
}
