export const users = [
  {
    id: 1,
    email: 'fong@test.com',
    password: '$2b$04$wcwaquqi5ea1Ho0aKwkZ0e51/RUkg6SGxaumo8fxzILDmcrv4OBIO', // 123456
    name: 'Fong',
    age: 23,
    friendIds: [2, 3]
  },
  {
    id: 2,
    email: 'kevin@test.com',
    passwrod: '$2b$04$uy73IdY9HVZrIENuLwZ3k./0azDvlChLyY1ht/73N4YfEZntgChbe', // 123456
    name: 'Kevin',
    age: 40,
    friendIds: [1]
  },
  {
    id: 3,
    email: 'mary@test.com',
    password: '$2b$04$UmERaT7uP4hRqmlheiRHbOwGEhskNw05GHYucU73JRf8LgWaqWpTy', // 123456
    name: 'Mary',
    age: 18,
    friendIds: [1]
  }
];

// helpers
const findUserByUserId = (userId: number) => users.find(user => user.id === Number(userId));

const filterUsersByUserIds = (userIds: number[]) =>
  users.filter(user => userIds.includes(user.id));

const updateUserInfo = (userId: number, data: any) => {
  const target = findUserByUserId(userId)
  if (target) {
    Object.assign(target, data)
  }
  return target
}

const findUserByName = (name: string) => users.find(user => user.name === name);

const findUserByEmail = (email: string) => users.find(user => user.email === email)

const checkEmailDuplicate = (email: string) => {
  return users.some(user => user.email === email);
}

const signUpUser = ({
  email,
  password,
  name,
  age = 18
}: {
  email: string
  password: string
  name: string
  age?: number
}) => {
  const newUser = {
    id: users[users.length - 1].id + 1,
    email,
    password,
    name,
    age,
    friendIds: []
  }
  users.push(newUser)
  return newUser
}

export const userHelper = {
  findUserByUserId,
  filterUsersByUserIds,
  updateUserInfo,
  findUserByName,
  findUserByEmail,
  checkEmailDuplicate,
  signUpUser,
}

// user query
export const getUserPosts = (parent: any, _: any, { postHelper }: any) => {
  return postHelper.filterPostsByUserId(parent.id)
}

export const getUserFriends = (parent: any) => {
  return filterUsersByUserIds(parent.friendIds)
}

export const updateMyInfo = (root: any, {
  input
}: any, {
  user
}: any) => {
  // 過濾空值
  const data = ['name', 'age'].reduce(
    (obj, key) => (input[key] ? {
      ...obj,
      [key]: input[key]
    } : obj), {}
  );
  return updateUserInfo(user.id, data || {})
}

export const addFriend = (root: any, userId: number, { user }: any) => {
  const meId = user.id
  const me = findUserByUserId(meId);
  if (me?.friendIds.includes(userId))
    throw new Error(`User ${userId} Already Friend.`);

  const friend = findUserByUserId(userId);
  const newMe = updateUserInfo(meId, {
    friendIds: me?.friendIds.concat(userId)
  });
  updateUserInfo(userId, { friendIds: friend?.friendIds.concat(meId) });

  return newMe;
}