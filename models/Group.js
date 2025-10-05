import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    members: { type: [MemberSchema], default: [] },
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', GroupSchema);
export default Group;
