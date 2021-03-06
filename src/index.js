import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const server = new ApolloServer({
  typeDefs: gql`
    ${typeDefs}
  `,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
