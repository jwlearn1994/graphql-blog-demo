import { ForbiddenError } from '@/error'

export const posts = [
  {
    id: 1,
    authorId: 1,
    title: 'Hello World',
    body: 'This is my first post',
    likeGiverIds: [1, 2],
    createdAt: '2018-10-22T01:40:14.941Z'
  },
  {
    id: 2,
    authorId: 2,
    title: 'Nice Day',
    body: 'Hello My Friend!',
    likeGiverIds: [1],
    createdAt: '2018-10-24T01:40:14.941Z'
  }
];

// helpers
const filterPostsByUserId = (userId: number) =>
  posts.filter(post => userId === post.authorId);

const findPostByPostId = (postId: number) => posts.find(post => post.id === Number(postId))

const addUserPost = ({ authorId, title, body }: any) => (
  posts[posts.length] = {
    id: posts[posts.length - 1].id + 1,
    authorId,
    title,
    body,
    likeGiverIds: [],
    createdAt: new Date().toISOString()
  });

const deleteUserPost = (postId: number) => {
  return posts.splice(posts.findIndex((post) => post.id === postId))[0]
}

const updatePost = (postId: number, data: any) => {
  const target = findPostByPostId(postId)
  if (target) {
    Object.assign(target, data)
  }
  return target
}

export const postHelper = {
  filterPostsByUserId,
  findPostByPostId,
  addUserPost,
  deleteUserPost,
  updatePost,
}

const isPostAuthor = (resolverFunc: any) => (parent: any, args: any, context: any) => {
  const me = context.user
  const post = findPostByPostId(args.postId)
  const isAuthor = post?.authorId === me.id
  if (!isAuthor) throw new ForbiddenError('Only Author Can Delete this Post');
  return resolverFunc.apply(null, [parent, args, context])
}

// post query
export const getPostAuthor = (parent: any, _: any, { userHelper }: any) => {
  return userHelper.findUserByUserId(parent.authorId) || {}
}

export const getLikeGivers = (parent: any, _: any, { userHelper }: any) => {
  return userHelper.filterUsersByUserIds(parent.likeGiverIds)
}

export const addPost = (root: any, { input }: any, { user }: any) => {
  const { title, body } = input
  return addUserPost({
    authorId: user.id,
    title,
    body
  })
}

export const deletePost = isPostAuthor((root: any, { postId }: any) => {
  return deleteUserPost(postId)
})

export const likePost = (root: any, { postId }: any, { user }: any) => {
  const meId = user.id

  postId = Number(postId)
  const post = findPostByPostId(postId);

  if (!post) throw new Error(`Post ${postId} Not Exists`);

  if (!post.likeGiverIds.includes(meId)) {
    return updatePost(postId, {
      likeGiverIds: post.likeGiverIds.concat(meId)
    });
  }

  return updatePost(postId, {
    likeGiverIds: post.likeGiverIds.filter(id => id !== meId)
  });
}