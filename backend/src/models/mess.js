import mongoose from "mongoose";
const Schema = mongoose.Schema;
const MessSchema = new Schema({
  send: {
    type: String,
    required: [true, "Send field is required."],
  },
  to: {
    type: String,
    required: [true, "To field is required."],
  },
  body: {
    type: String,
    required: [true, "Body field is required."],
  },
})
const Message = mongoose.model("message", MessSchema);
export default Message;
