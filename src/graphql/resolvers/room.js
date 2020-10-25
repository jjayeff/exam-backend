import Rooms from '../../model/room';

export default {
  Query: {
    rooms: async (parent, { roomName }) => {
      const rooms = await Rooms.find({ roomName });
      return rooms;
    },
  },
  Mutation: {
    createRoom: async (parent, { roomName }) => {
      await Rooms.create({ roomName });
      return {
        successful: true,
      };
    },
  },
};
