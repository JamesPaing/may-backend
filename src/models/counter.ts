import { model, Schema } from 'mongoose';

const counterSchema = new Schema(
    {
        id: String,
        seq: Number,
    },
    { timestamps: true }
);

export const Counter = model('Counter', counterSchema);
