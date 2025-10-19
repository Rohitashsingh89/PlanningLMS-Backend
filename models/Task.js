import { Schema, model } from 'mongoose';

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

TaskSchema.index({ title: 'text' });
TaskSchema.index({ tags: 1 }); 
TaskSchema.index({ status: 1 });

export const Task = model('Task', TaskSchema);
