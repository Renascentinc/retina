import gql from 'graphql-tag'

export const configurableItemQuery = gql`
  query {
    getAllConfigurableItem {
      id
      type
      name
      sanctioned
    }
  }
`

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

export const decomissionToolMutation = gql`
  mutation ($tool_id: ID!, $decomissioned_status: DecomissionedToolStatus!, $decomission_reason: String!) {
    decomissionTool(tool_id: $tool_id, decomissioned_status: $decomissioned_status, decomission_reason: $decomission_reason) {
      id
    }
  }
`

export const usersQuery = gql`
  query {
    getAllUser {
      id
      first_name
      last_name
      role
    }
  }
`

export const createNewToolMutation = gql`
  mutation newTool($newTool: NewTool!) {
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
  }
`

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

export const requestPasswordResetMutation = gql`
  mutation ($email: String!) {
    requestPasswordReset(email: $email)
  }
`

export const loginMutation = gql`
  mutation attemptUserLogin($organization_name: String!, $email: String!, $password: String!) {
     login(organization_name: $organization_name, email: $email, password: $password) {
      token,
      user {
        id,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        status
      }
    }
  }
`

export const resetCodeValidityQuery = gql`
  query checkResetCode($password_reset_code: ID!) {
    isPasswordResetCodeValid(password_reset_code: $password_reset_code)
  }
`

export const passwordResetMutation = gql`
  mutation attemptPasswordReset($new_password: String!, $password_reset_code: ID!) {
    resetPassword(new_password: $new_password, password_reset_code: $password_reset_code)
  }
`

export const locationsQuery = gql`
  query {
    getAllLocation {
      id
      name
      type
    }
  }
`

export const multiToolQuery = gql`
  query selectedTools($tool_ids: [ID!]!) {
    getMultipleTool(tool_ids: $tool_ids) {
      id
      type {
        id
        name
      }
      brand {
        id
        name
      }
      status
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
           type
        }
      }
    }
  }
`

export const searchToolsQuery = gql`
  query tools($query: String, $toolFilter: ToolFilter, $pagingParameters: PagingParameters) {
    searchTool(query: $query, toolFilter: $toolFilter, pagingParameters: $pagingParameters) {
      id
      type {
        id
        name
      }
      brand {
        id
        name
      }
      status
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
           type
        }
      }
    }
  }
`

export const toolTransferMutation = gql`
  mutation transferTools($tool_id_list: [ID!]!, $to_owner_id: ID!) {
    transferMultipleTool (tool_id_list: $tool_id_list, to_owner_id: $to_owner_id) {
      id
      type {
        id
        name
      }
      brand {
        id
        name
      }
      status
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
           type
        }
      }
    }
  }
`
