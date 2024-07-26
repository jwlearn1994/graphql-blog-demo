import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ForbiddenError } from '@/error'

const hash = (v: string, saltRounds: string) => bcrypt.hash(v, saltRounds)

const checkHash = (v: string, hash: string) => bcrypt.compare(v, hash)

const createToken = ({
  id,
  email,
  name,
  secret
}: {
  id: string
  email: string
  name: string
  secret: string
}) => jwt.sign({
  id,
  email,
  name
}, secret, {
  expiresIn: '1d' // 1天過期
})

const checkToken = async (token: string, secret: string) => {
  if (token) {
    try {
      // 2. 檢查 token + 取得解析出的資料
      const me = await jwt.verify(token, secret);
      // 3. 放進 context
      return me;
    } catch (e) {
      throw new Error('Your session expired. Sign in again.');
    }
  }
  // 如果沒有 token 就回傳空的 context 出去
  return null;
}

export const authHelper = {
  hash,
  checkHash,
  createToken,
  checkToken
}

export const isAuthenticated = (resolverFunc: any) => (parent: any, args: any, context: any) => {
  if (!context.user) throw new ForbiddenError('Not logged in.');
  return resolverFunc.apply(null, [parent, args, context]);
};

export const signUp = async (root: any, {
  input
}: any, { saltRounds, userHelper }: any) => {
  const {
    email,
    password,
    name
  } = input
  const isUserEmailDuplicate = userHelper.checkEmailDuplicate(email)
  if (isUserEmailDuplicate) throw new Error('User Email Duplicate');

  const hashedPassword = await hash(password, saltRounds)
  return userHelper.signUpUser({
    email,
    password: hashedPassword,
    name
  })
}

export const logIn = async (root: any, {
  input
}: any, { secret, userHelper }: any) => {
  const {
    email,
    password
  } = input
  const user = userHelper.findUserByEmail(email)
  if (!user) throw new Error('Email Account Not Exists');

  const passwordIsValid = await checkHash(password, user.password as string)
  if (!passwordIsValid) throw new Error('Wrong Password');

  const token = await createToken({
    id: String(user.id),
    email: user.email,
    name: user.name,
    secret,
  })

  return {
    token
  };
}