import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import mongoose from 'mongoose';
import { typeDefs } from '../src/graphql/typedefs';
import { resolvers } from '../src/graphql/resolvers';
import Message from '../src/model/message';
import Rooms from '../src/model/room';
require('dotenv').config(); // don't forget .env

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((error) => console.error(error));
};

const dropTestDb = async () => {
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.db
      .dropDatabase()
      .catch((error) => console.error(error));
  }
};

const closeDbConnection = async () => {
  await mongoose.connection.close().catch((error) => console.error(error));
};

const QUERY_MESSAGES = gql`
  query getMessages($roomName: String!) {
    messages(roomName: $roomName) {
      body
      from {
        name
      }
    }
  }
`;

const MUTATION_SEND_MESSAGE = gql`
  mutation SendMessage($roomName: String!, $message: String!, $name: String!) {
    sendMessage(
      roomName: $roomName
      input: { body: $message, from: { name: $name } }
    ) {
      successful
    }
  }
`;

const MUTATION_CREATE_ROOM = gql`
  mutation CreateRoom($roomName: String!) {
    createRoom(roomName: $roomName) {
      successful
    }
  }
`;

const QUERY_ROOM = gql`
  query GetRoom($roomName: String!) {
    rooms(roomName: $roomName) {
      roomName
    }
  }
`;

describe('Message', () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      req,
      res,
      Message,
      Rooms,
    }),
  });
  const { query, mutate } = createTestClient(server);
  it('connect mongodo', async () => {
    await connectToDb();
    await dropTestDb();
    expect(true).toEqual(true);
  }, 30000);
  describe('room1', () => {
    it('get messages in room1', async () => {
      await mutate({
        query: MUTATION_SEND_MESSAGE,
        variables: {
          roomName: 'room1',
          message: '#1 message body in room1',
          name: 'Jeff',
        },
      });
      const res = await query({
        query: QUERY_MESSAGES,
        variables: { roomName: 'room1' },
      });
      expect(res.data.messages).toEqual([
        {
          body: '#1 message body in room1',
          from: {
            name: 'Jeff',
          },
        },
      ]);
    }, 30000);

    it('add message into room1', async () => {
      const res = await mutate({
        query: MUTATION_SEND_MESSAGE,
        variables: {
          roomName: 'room1',
          message: '#2 message body in room1',
          name: 'Jeff',
        },
      });
      expect(res.data.sendMessage.successful).toEqual(true);
    }, 30000);

    it('messages in room1 should added', async () => {
      const res = await query({
        query: QUERY_MESSAGES,
        variables: { roomName: 'room1' },
      });
      expect(res.data.messages).toEqual([
        {
          body: '#1 message body in room1',
          from: {
            name: 'Jeff',
          },
        },
        {
          body: '#2 message body in room1',
          from: {
            name: 'Jeff',
          },
        },
      ]);
    }, 30000);
  });

  describe('room2', () => {
    it('get messages in room2', async () => {
      await connectToDb();
      await dropTestDb();
      await mutate({
        query: MUTATION_SEND_MESSAGE,
        variables: {
          roomName: 'room2',
          message: '#1 message body in room2',
          name: 'Jeff',
        },
      });
      const res = await query({
        query: QUERY_MESSAGES,
        variables: { roomName: 'room2' },
      });
      expect(res.data.messages).toEqual([
        {
          body: '#1 message body in room2',
          from: {
            name: 'Jeff',
          },
        },
      ]);
    }, 30000);

    it('add message into room2', async () => {
      const res = await mutate({
        query: MUTATION_SEND_MESSAGE,
        variables: {
          roomName: 'room2',
          message: '#2 message body in room2',
          name: 'Jeff',
        },
      });
      expect(res.data.sendMessage.successful).toEqual(true);
    }, 30000);

    it('messages in room2 should added', async () => {
      const res = await query({
        query: QUERY_MESSAGES,
        variables: { roomName: 'room2' },
      });
      expect(res.data.messages).toEqual([
        {
          body: '#1 message body in room2',
          from: {
            name: 'Jeff',
          },
        },
        {
          body: '#2 message body in room2',
          from: {
            name: 'Jeff',
          },
        },
      ]);
    }, 30000);
  });

  describe('rooms', () => {
    it('create room3 in rooms', async () => {
      const res = await mutate({
        query: MUTATION_CREATE_ROOM,
        variables: {
          roomName: 'room3',
        },
      });
      expect(res.data.createRoom.successful).toEqual(true);
    }, 30000);

    it('room3 in rooms should added', async () => {
      const res = await query({
        query: QUERY_ROOM,
        variables: { roomName: 'room3' },
      });
      expect(res.data.rooms).toEqual([
        {
          roomName: 'room3',
        },
      ]);
    }, 30000);
  });

  it('close connect mongodo', async () => {
    await dropTestDb();
    await closeDbConnection();
    expect(true).toEqual(true);
  }, 30000);
});
