import { showErrorMsg } from '@/utils/alerts'
import ApiStatusCodes from '@/utils/api-status-codes'

export function handleCommonErrors (error, displayErrorMessage = false) {
  let foundCommonError = false
  let msgText = ''

  if (error) {
    if (error.message === 'Network error: Failed to fetch' || (error.networkError && error.networkError.message === 'TypeError: Failed to fetch')) {
      msgText = 'Network Error. Please Try Again.'
      foundCommonError = true
    } else if (hasGraphqlErrorCode(error, ApiStatusCodes.USER_UNIQUE_ACTIVE_CONSTRAINT_VIOLATION) &&
    error.graphQLErrors[0].message.includes('User with email') &&
    error.graphQLErrors[0].message.includes('already exists in active state')) {
      msgText = 'This email address is already in use by another user'
      foundCommonError = true
    } else if (hasGraphqlErrorCode(error, ApiStatusCodes.USER_UNIQUE_ACTIVE_CONSTRAINT_VIOLATION) &&
    error.graphQLErrors[0].message.includes('User with email') &&
    error.graphQLErrors[0].message.includes('already exists in inactive state')) {
      msgText = 'This email address is in use by a deactivated user'
      foundCommonError = true
    }
  }

  if (displayErrorMessage && foundCommonError) {
    showErrorMsg(msgText)
  }

  return foundCommonError
}

export function hasGraphqlErrorCode (error, statusCode) {
  return error && error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions.code === statusCode
}
