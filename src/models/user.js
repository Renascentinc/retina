import PhoneNumberFormatter from 'phone-number-formats'

export default class User {
  id
  first_name
  last_name
  email
  phone_number
  role
  status

  get isUser () {
    return true
  }

  get full_name () {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`
    }
    return ''
  }

  get formattedPhoneNumber () {
    if (this.phone_number) {
      return new PhoneNumberFormatter(this.phone_number).format({
        type: 'domestic'
      }).string
    }
    return ''
  }

  startPhoneCall () {
    if (!this.phone_number) {
      return
    }

    window.location.href = `tel:${this.phone_number}`
  }

  startEmail () {
    if (!this.email) {
      return
    }

    window.location.href = `mailto:${this.email}`
  }

  getState () {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      role: this.role,
      status: this.status
    }
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
