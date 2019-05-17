export default class User {
  id = ''
  first_name = 'test'
  last_name = 'user'
  email = ''
  phone_number = ''
  role = ''
  status = ''

  get isUser () {
    return true
  }

  startPhoneCall () {
    window.location.href = `tel:${this.phone_number}`
  }

  startEmail () {
    window.location = `mailto:${this.email}`
  }

  update (user) {
    this.id = user.id
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.email = user.email
    this.phone_number = user.phone_number
    this.role = user.role
    this.status = user.status
  }

  constructor (user) {
    if (user) this.update(user)
  }
}
