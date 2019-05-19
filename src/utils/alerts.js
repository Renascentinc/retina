import swal from 'sweetalert2'

export function showInvalidIDMsg () {
  swal({
    type: 'error',
    title: 'ERROR',
    text: 'Invalid Tool ID',
    timer: 4000,
    showConfirmButton: false
  })
}

export function showSuccessMsg () {
  swal({
    type: 'success',
    title: 'Success',
    text: 'Operation Succeeded',
    timer: 3000,
    showConfirmButton: false
  })
}

export function showErrorMsg () {
  swal({
    type: 'error',
    title: 'ERROR',
    text: 'Operation Failed. Please Try Again or Contact Support',
    timer: 3000,
    showConfirmButton: false
  })
}
