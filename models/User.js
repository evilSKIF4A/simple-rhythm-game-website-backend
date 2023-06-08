import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
