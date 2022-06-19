import { authHelper } from './model/auth';
import { userHelper } from './model/user';
import { postHelper } from './model/post';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const SECRET = process.env.SECRET as string;

async function createContext({ req }: any) {
  // 取出(x-token 可隨意取名)
  const token = req.headers['x-token'] as string
  const context = {
    secret: SECRET,
    saltRounds: SALT_ROUNDS,
    user: await authHelper.checkToken(token, SECRET),
    authHelper,
    userHelper,
    postHelper
  }
  return context
}

export default createContext
