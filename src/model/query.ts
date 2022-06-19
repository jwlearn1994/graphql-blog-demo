import { users } from './user'
import { posts } from './post'

export const getHello = () => 'Hello World'

export const getCurrentUser = (root: any, args: any, {
  user,
  userHelper
}: any) => userHelper.findUserByUserId(user.id)


export const getAllUsers = () => users

export const getUserByName = (root: any, {
  name
}: any, {
  userHelper
}: any) => userHelper.findUserByName(name)

export const getAllPosts = () => posts

export const getPostByPostId = (root: any, {
  postId
}: any, {
  postHelper
}: any) => postHelper.findPostByPostId(postId)