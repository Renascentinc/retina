import Tool from '@/models/tool'
import User from '@/models/user'
// import DeepDiff from 'deep-diff'

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
        value: this.currentSnapshot.formattedStatus
      },
      {
        title: 'OWNER',
        value: this.currentSnapshot.owner.name
      }
    ]

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
