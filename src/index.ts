import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import resolvers from '@/resolvers'
import typeDefs from '@/typedefs'
import createContext from '@/context'

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

async function startServer() {
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
  });
  console.log(`🚀  Apollo Server ready at: ${url}`);
}

startServer();