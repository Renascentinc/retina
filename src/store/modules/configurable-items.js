import { defaultClient as apollo } from '@/apollo'
import { createConfigurableItemMutation } from '@/utils/gql'

const configurableItems = {
  namespaced: true,

  actions: {
    createNewConfigurableItem (store, configurableItem) {
      if (!configurableItem || !configurableItem.isNewConfigurableItem) {
        return
      }

      return apollo.mutate({
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
