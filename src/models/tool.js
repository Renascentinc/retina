import User from './user'
import Location from './location'
import Statuses from '@/utils/statuses'

const statusObjects = {
  [Statuses.AVAILABLE]: {
    name: 'Available',
    id: Statuses.AVAILABLE
  },
  [Statuses.IN_USE]: {
    name: 'In Use',
    id: Statuses.IN_USE
  },
  [Statuses.MAINTENANCE]: {
    name: 'Maintenance',
    id: Statuses.MAINTENANCE
  }
}

export default class Tool {
  id
  year
  status
  model_number
  serial_number
  date_purchased
  price
  photo
  image
  brand = {}
  type = {}
  purchased_from = {}
  owner = {}

  get formattedYear () {
    return this.year || '-'
  }

  get formattedPurchasedFrom () {
    return this.purchased_from ? this.purchased_from.name : '-'
  }

  get formattedDate () {
    return this.date_purchased ? new Date(this.date_purchased).toLocaleDateString('en-US') : '-'
  }

  get formattedStatus () {
    if (!this.status) {
      return ''
    }

    return this.status.replace(/_/g, ' ').toUpperCase()
  }

  get name () {
    return `${this.brand.name} ${this.type.name}`
  }

  get formattedPrice () {
    return this.price ? `$ ${(this.price / 100).toFixed(2)}` : '$ -'
  }

  get formattedId () {
    return this.id ? `#${this.id}` : ''
  }

  get statusClass () {
    if (!this.status) {
      return ''
    }

    return this.status
      .split('_')
      .join('-')
      .toLowerCase()
  }

  get jsDate () {
    return this.date_purchased ? new Date(this.date_purchased) : null
  }

  set jsDate (newPurchaseDate) {
    this.date_purchased = new Date(newPurchaseDate).toISOString()
  }

  get statusObject () {
    return statusObjects[this.status]
  }

  set statusObject (newStatusObject) {
    this.status = newStatusObject.id
  }

  set formattedPrice (newPrice) {
    this.price = (newPrice.slice(2) * 100).toFixed(2)
  }

  getState () {
    return {
      id: this.id,
      type_id: this.type.id,
      brand_id: this.brand.id,
      model_number: this.model_number,
      serial_number: this.serial_number,
      status: this.status,
      owner_id: this.owner.id,
      purchased_from_id: this.purchased_from && this.purchased_from.id,
      date_purchased: this.date_purchased,
      price: this.price,
      year: this.year,
      photo: this.photo
    }
  }

  update (tool) {
    this.id = tool.id
    this.brand = tool.brand
    this.type = tool.type
    this.status = tool.status
    this.owner = tool.owner.isUser || tool.owner.type === 'USER' ? new User(tool.owner) : new Location(tool.owner)
    this.model_number = tool.model_number
    this.serial_number = tool.serial_number

    if (tool.year) this.year = tool.year
    if (tool.purchased_from) this.purchased_from = tool.purchased_from
    if (tool.date_purchased) this.date_purchased = tool.date_purchased
    if (tool.price) this.price = tool.price
    if (tool.photo) this.photo = tool.photo
  }

  constructor (tool) {
    if (tool) this.update(tool)
  }
}
