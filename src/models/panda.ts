import mongoose from "mongoose";

const pandaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    habitat: { type: String, required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zookeeper",
      required: true,
      index: true
    },
  },
  { timestamps: true },
);

export default mongoose.model("Panda", pandaSchema);
