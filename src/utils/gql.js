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
