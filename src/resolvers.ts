import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import {
  getHello,
  getCurrentUser,
  getAllUsers,
  getUserByName,
  getAllPosts,
  getPostByPostId
} from '@/model/query'
import {
  getUserPosts,
  getUserFriends,
  updateMyInfo,
  addFriend
} from '@/model/user'
import {
  getPostAuthor,
  getLikeGivers,
  addPost,
  deletePost,
  likePost
} from '@/model/post'
import {
  isAuthenticated,
  signUp,
  logIn
} from '@/model/auth'

const resolvers = {
  // Custom Scalar Type
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
      return value.getTime(); // value sent to the client
    },
    parseValue(value: any) {
      return new Date(value); // value from the client
    },
    parseLiteral(ast: any) {
      if (ast.kind === Kind.INT) {
        // ast value is always in string format
        return new Date(parseInt(ast.value, 10));
      }
      return ast.value;
    },
  }),
  Query: {
    hello: getHello,
    now: () => new Date(),
    isFriday: (root: any, { date }: any) => date.getDay() === 5,
    me: isAuthenticated(getCurrentUser),
    users: getAllUsers,
    user: getUserByName,
    posts: getAllPosts,
    post: getPostByPostId,
  },
  Mutation: {
    updateMyInfo: isAuthenticated(updateMyInfo),
    addFriend: isAuthenticated(addFriend),
    addPost: isAuthenticated(addPost),
    deletePost: isAuthenticated(deletePost),
    likePost: isAuthenticated(likePost),
    signUp,
    logIn,
  },
  User: {
    posts: getUserPosts,
    friends: getUserFriends
  },
  Post: {
    author: getPostAuthor,
    likeGivers: getLikeGivers
  },
}

export default resolvers
