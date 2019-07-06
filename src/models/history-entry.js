import Tool from '@/models/tool'
import User from '@/models/user'

export default class HistoryEntry {
  id
  metadata
  currentSnapshot
  previousSnapshot

  get diff () {
    let diff = [
      {
        title: 'TIME',
        value: this.metadata.formattedTimeStamp
      },
      {
        title: 'DONE BY',
        value: this.metadata.actor.name
      },
      {
        title: 'STATUS',
        value: this.currentSnapshot.formattedStatus,
        previousValue: this.previousSnapshot && this.previousSnapshot.status !== this.currentSnapshot.status ? this.previousSnapshot.formattedStatus : null
      },
      {
        title: 'OWNER',
        value: this.currentSnapshot.owner.name,
        previousValue: this.previousSnapshot && this.previousSnapshot.owner.id !== this.currentSnapshot.owner.id ? this.previousSnapshot.owner.name : null
      }
    ]

    if (this.previousSnapshot) {
      if (this.previousSnapshot.model_number !== this.currentSnapshot.model_number) {
        diff.push({
          title: 'MODEL NUMBER',
          value: this.currentSnapshot.model_number,
          previousValue: this.previousSnapshot.model_number
        })
      }

      if (this.previousSnapshot.serial_number !== this.currentSnapshot.serial_number) {
        diff.push({
          title: 'SERIAL NUMBER',
          value: this.currentSnapshot.serial_number,
          previousValue: this.previousSnapshot.serial_number
        })
      }

      if (this.previousSnapshot.date_purchased !== this.currentSnapshot.date_purchased) {
        diff.push({
          title: 'PURCHASE DATE',
          value: this.currentSnapshot.formattedDate,
          previousValue: this.previousSnapshot.formattedDate
        })
      }

      if (this.previousSnapshot.price !== this.currentSnapshot.price) {
        diff.push({
          title: 'PRICE',
          value: this.currentSnapshot.formattedPrice,
          previousValue: this.previousSnapshot.formattedPrice
        })
      }

      if (this.previousSnapshot.year !== this.currentSnapshot.year) {
        diff.push({
          title: 'MODEL YEAR',
          value: this.currentSnapshot.year,
          previousValue: this.previousSnapshot.year || '-'
        })
      }

      if (this.previousSnapshot.photo !== this.currentSnapshot.photo) {
        diff.push({
          title: 'PHOTO',
          value: 'PHOTO UPDATED'
        })
      }

      if (this.previousSnapshot.brand.id !== this.currentSnapshot.brand.id) {
        diff.push({
          title: 'BRAND',
          value: this.currentSnapshot.brand.name,
          previousValue: this.previousSnapshot.brand.name
        })
      }

      if (this.previousSnapshot.type.id !== this.currentSnapshot.type.id) {
        diff.push({
          title: 'TYPE',
          value: this.currentSnapshot.type.name,
          previousValue: this.previousSnapshot.type.name
        })
      }

      if (this.previousSnapshot.purchased_from.id !== this.currentSnapshot.purchased_from.id) {
        diff.push({
          title: 'SUPPLIER',
          value: this.currentSnapshot.purchased_from.name,
          previousValue: this.previousSnapshot.purchased_from.name
        })
      }
    }
    return diff
  }

  update (entry) {
    this.id = entry.id
    this.metadata = new HistoryMetadata(entry.metadata)
    this.currentSnapshot = new Tool(entry.tool)
    if (entry.previous_tool_snapshot) this.previousSnapshot = new Tool(entry.previous_tool_snapshot.tool)
  }

  constructor (entry) {
    if (entry) this.update(entry)
  }
}

class HistoryMetadata {
  timestamp
  tool_action
  action_note
  actor

  get formattedTimeStamp () {
    return this.timestamp && new Date(this.timestamp).toLocaleDateString('en-US')
  }

  get formattedToolAction () {
    return this.tool_action && this.tool_action.toLowerCase()
  }

  update (meta) {
    this.timestamp = meta.timestamp
    this.tool_action = meta.tool_action
    this.action_note = meta.action_note
    this.actor = new User(meta.actor)
  }

  constructor (meta) {
    if (meta) this.update(meta)
  }
}
