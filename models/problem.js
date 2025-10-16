import mongoose from "mongoose";

const ExampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const SolutionsSchema = new mongoose.Schema(
  {
    html: { type: String, default: "" },
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topics: { type: [String], default: [] },
    examples: { type: [ExampleSchema], default: [] },
    solutions: { type: SolutionsSchema, default: () => ({}) },
    isGeneric: { type: Boolean, default: false, index: true }, // visible to all logged-in users if true
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    assignedTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      index: true,
    }, // visible to specific users
  },
  { timestamps: true }
);

// Make id a string and hide __v
ProblemSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
