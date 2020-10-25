import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DynamicSchema = (roomName) => {
  delete mongoose.connection.models[roomName];
  const messageSchema = new Schema({
    id: { type: String },
    body: { type: String },
    image: { type: String },
    createAt: { type: Date },
    from: {
      name: { type: String },
    },
  });
  return mongoose.model(roomName, messageSchema);
};

export default DynamicSchema;
