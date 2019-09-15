import { showErrorMsg } from '@/utils/alerts'

export function handleCommonErrors (error, displayErrorMessage = false) {
  let foundCommonError = false
  if (error) {
    if (error.message === 'Network error: Failed to fetch' || (error.networkError && error.networkError.message === 'TypeError: Failed to fetch')) {
      if (displayErrorMessage) {
        showErrorMsg('Network Error. Please Try Again.')
      }
      foundCommonError = true
    }
  }
  return foundCommonError
}

export function hasGraphqlErrorCode (error, statusCode) {
  return error && error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions.code === statusCode
}
