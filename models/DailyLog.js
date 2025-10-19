import { Schema, model } from 'mongoose';

const DailyLogSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    mood: { type: String }
  },
  { timestamps: true }
);

DailyLogSchema.index({ content: 'text' });

export const DailyLog = model('DailyLog', DailyLogSchema);
