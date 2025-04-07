const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
    favoriteMovies: [Movie!]
  }

  type Movie {
    id: ID!
    name: String!
    yearOfPublication: Int!
    isInTheaters: Boolean!
  }

  type Query {
    users: UsersResult
    user(id: ID!): User!
    movies: [Movie!]!
    movie(name: String!): Movie!
  }

  input CreateUserInput {
    name: String!
    username: String!
    age: Int! # = 18
    nationality: Nationality = BRAZIL
  }

  input UpdateUsernameInput {
    id: ID!
    newUsername: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUsername(input: UpdateUsernameInput!): User
    deleteUser(id: ID!): User
  }

  enum Nationality {
    CANADA
    BRAZIL
    CHILE
    INDIA
    GERMANY
    UKRAINE
  }

  type UsersSuccessfulResult {
    users: [User!]!
  }

  type UsersErrorResult {
    message: String!
  }

  union UsersResult = UsersSuccessfulResult | UsersErrorResult
`;

/** -- using results
 * query Query {
  users {
    ...on UsersSuccessfulResult {
      users {
        id
        name
        age
      }
    }

    ...on UsersErrorResult {
      message
    }
  }
}
 */

module.exports = { typeDefs };
