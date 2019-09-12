import { showErrorMsg } from '@/utils/alerts'

export function handleCommonErrors (error) {
  let foundCommonError = false
  if (error) {
    if (error.message === 'Network error: Failed to fetch') {
      showErrorMsg('Network Error. Please Try Again.')
      foundCommonError = true
    }
  }
  return foundCommonError
}
