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

export function showSuccessMsg (text = 'Operation Succeeded', title = 'Success') {
  swal({
    type: 'success',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  })
}

export function showErrorMsg (text = 'Operation Failed. Please Try Again or Contact Support', title = 'ERROR') {
  swal({
    type: 'error',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  })
}

export function showWarningMessage (text = 'Operation threw a warning', title = 'WARNING') {
  swal({
    type: 'warning',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  })
}
