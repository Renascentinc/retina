export default class Tool {
  id = ''

  brand = {
    id: '',
    name: ''
  }

  type = {
    id: '',
    name: ''
  }

  year = '-'

  status = ''

  modelNumber = ''

  serialNumber = ''

  purchasedFrom = {
    id: '',
    name: '-'
  }

  datePurchased = '-'

  price = ''

  photo = ''

  owner = {
    id: '',
    type: ''
  }

  get formattedDate () {
    return this.datePurchased ? new Date(this.datePurchased).toLocaleDateString('en-US') : '-'
  }

  get formattedStatus () {
    return this.status.replace(/_/g, ' ').toUpperCase()
  }

  get formattedPrice () {
    return this.price ? `$${this.price / 100}` : '$ -'
  }

  get formattedId () {
    if (this.id) {
      return `#${this.id}`
    }

    return ''
  }

  get statusClass () {
    return this.status
      .split('_')
      .join('-')
      .toLowerCase()
  }

  updateInfo (tool) {
    this.id = tool.id
    this.brand = tool.brand
    this.type = tool.type
    this.status = tool.status
    this.owner = tool.owner
    this.modelNumber = tool.model_number
    this.serialNumber = tool.serial_number

    if (tool.year) this.year = tool.year
    if (tool.purchased_from) this.purchasedFrom = tool.purchased_from
    if (tool.date_purchased) this.datePurchased = tool.date_purchased
    if (tool.price) this.price = tool.price
    if (tool.photo) this.photo = tool.photo
  }
}
