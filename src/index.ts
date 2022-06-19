import { ApolloServer } from 'apollo-server'
import resolvers from '@/resolvers'
import typeDefs from '@/typedefs'
import createContext from '@/context'

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: createContext
})

server.listen(4000).then(({
  url
}) => {
  console.log(`Apollo Server ready at ${url}`);
})