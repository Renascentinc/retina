import { showErrorMsg } from '@/utils/alerts'

export function handleCommonErrors (error) {
  let foundCommonError = false
  if (error) {
    if (error.message === 'Network error: Failed to fetch' || error.networkError) {
      showErrorMsg('Network Error. Please Try Again.')
      foundCommonError = true
    }
  }
  return foundCommonError
}

export function hasGraphqlErrorCode (error, statusCode) {
  return error && error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions.code === statusCode
}
