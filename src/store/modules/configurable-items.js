import { defaultClient as apollo } from '@/apollo'
import { createConfigurableItemMutation } from '@/utils/gql'

const configurableItems = {
  actions: {
    async createNewConfigurableItem (store, configurableItem) {
      if (!configurableItem || !configurableItem.isNewConfigurableItem) {
        return
      }

      await apollo.mutate({
        mutation: createConfigurableItemMutation,
        variables: {
          newConfigurableItem: {
            type: configurableItem.type,
            name: configurableItem.name,
            sanctioned: true
          }
        }
      })
    }
  }
}

export default configurableItems
