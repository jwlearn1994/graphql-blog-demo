import { gql } from 'apollo-server'

const typeDefs = gql`
scalar Date

"""
使用者
"""
type User {
  id: ID!
  email: String!
  name: String
  age: Int
  friends: [User]
  posts: [Post]
}

"""
貼文
"""
type Post {
  id: ID!
  author: User!
  title: String
  body: String
  likeGivers: [User]
  "建立時間(ISO 格式)"
  createdAt: String
}

"""
Query
"""
type Query {
  "測試用 Hello World"
  hello: String
  "測試用時間戳記"
  now: Date
  "詢問是否為星期五!!"
  isFriday(date: Date!): Boolean
  "取得當前 User"
  me: User
  "取得所有 User"
  users: [User]
  "依 name 取得特定 User"
  user(name: String!): User
  "取得所有 Post"
  posts: [Post]
  "依 id 取得特定 Post"
  post(postId: ID!): Post
}

input UpdateMyInfoInput {
  name: String
  age: Int
}

input AddPostInput {
  title: String!
  body: String
}

input SignUpInput {
  email: String!
  password: String!
  name: String!
}

input LogInInput {
  email: String!
  password: String!
}

type Token {
  token: String!
}

"""
Mutation
"""
type Mutation {
  updateMyInfo(input: UpdateMyInfoInput): User
  addFriend(userId: ID!): User
  addPost(input: AddPostInput): Post
  deletePost(postId: ID!): Post
  likePost(postId: ID!): Post
  signUp(input: SignUpInput!): User
  logIn(input: LogInInput!): Token
}
`

export default typeDefs
