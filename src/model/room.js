import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomName: { type: String },
});

export default mongoose.model('rooms', roomSchema);
