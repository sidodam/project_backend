import mongoose from "mongoose";
const UserMessageSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  textarea: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UserMessage", UserMessageSchema);
