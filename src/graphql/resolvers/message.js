import { pubsub } from '../pubsub';
import { v4 as uuid_v4 } from 'uuid';
import Message from '../../model/message';

const NEW_MESSAGE = 'NEW_MESSAGE';

export default {
  Query: {
    messages: async (parent, { roomName }) => {
      return await Message(roomName).find();
    },
  },
  Mutation: {
    sendMessage: async (parent, { roomName, input }) => {
      const { body, from } = input;
      const data = {
        id: uuid_v4(),
        body,
        createAt: new Date(),
        from,
        roomName,
      };
      await Message(roomName).create(data);
      await pubsub.publish(NEW_MESSAGE, { newMessage: data });
      return {
        successful: true,
      };
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator([NEW_MESSAGE]),
    },
  },
};
