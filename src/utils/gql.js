import gql from 'graphql-tag'

export const configurableItemQuery = gql`
  query {
    getAllConfigurableItem {
      id
      type
      name
      sanctioned
    }
}`

export const toolQuery = gql`
  query ($tool_id: ID!) {
    getTool(tool_id: $tool_id) {
      id
      brand {
        id
        name
      }
      type {
        id
        name
      }
      year
      status
      model_number
      serial_number
      purchased_from {
        id
        name
      }
      date_purchased
      price
      photo

      owner {
        ... on Location {
          id
          name
          type
        }
        ... on User {
          id
          first_name
          last_name
          email
          phone_number
          type
        }
      }
    }
  }
`

export const updateToolMutation = gql`
  mutation updateTool($tool: UpdatedTool!) {
    updateTool(updatedTool: $tool) {
      id
      status
    }
  }
`

export const createConfigurableItemMutation = gql`
  mutation newConfigurableItem($newConfigurableItem: NewConfigurableItem!) {
    createConfigurableItem(newConfigurableItem: $newConfigurableItem) {
      id
    }
  }
`

export const updateConfigurableItemMutation = gql`
  mutation updateConfigurableItem($item: UpdatedConfigurableItem!) {
    updateConfigurableItem(updatedConfigurableItem: $item) {
      id
      type
      name
      sanctioned
    }
  }
`

export const decomissionToolMutation = gql`mutation ($tool_id: ID!, $decomissioned_status: DecomissionedToolStatus!, $decomission_reason: String!) {
  decomissionTool(tool_id: $tool_id, decomissioned_status: $decomissioned_status, decomission_reason: $decomission_reason) {
    id
  }
}`

export const userQuery = gql`query {
  getAllUser {
    id
    first_name
    last_name
    role
  }
}`

export const createNewToolMutation = gql`mutation newTool($newTool: NewTool!) {
  createTool(newTool: $newTool) {
    id
    brand {
      id
      name
    }
    type {
      id
      name
    }
    year
    status
    model_number
    serial_number
    purchased_from {
      id
      name
    }
    date_purchased
    price
    photo

    owner {
      ... on Location {
        id
        name
        type
      }
      ... on User {
        id
        first_name
        last_name
        email
        phone_number
        type
      }
    }
  }
}`

export const deleteConfigurableItemMutation = gql`
  mutation deleteConfigurableItem($id: ID!) {
    deleteConfigurableItem(configurable_item_id: $id) {
      toolsWithConfigurableItem {
        id,
        type {
          id
        },
        brand {
          id
        },
        model_number,
        serial_number,
        status,
        owner {
          ... on Location {
            id
          }
          ... on User {
            id
          }
        },
        purchased_from {
          id
        },
        date_purchased,
        photo,
        price,
        year
      }
      deletedConfigurableItem {
        id
      }
    }
  }
`
