import mongoose, { mongo } from "mongoose";

const zookeeperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Zookeeper", zookeeperSchema)