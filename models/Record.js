import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    coins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Record", RecordSchema);
