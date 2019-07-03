export default class Location {
  id
  type
  city
  state
  zip
  address_line_one
  address_line_two
  name

  get isLocation () {
    return true
  }

  get iconClass () {
    return 'fa-map-marker-alt'
  }

  update (location) {
    this.id = location.id
    this.type = location.type
    this.city = location.city
    this.state = location.state
    this.zip = location.zip
    this.address_line_one = location.address_line_one
    this.address_line_two = location.address_line_two
  }

  constructor (location) {
    if (location) this.update(location)
  }
}
