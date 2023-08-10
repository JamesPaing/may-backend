import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema(
    {
        id: Number,
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        amount: Number,
        screenShot: String,
        status: {
            type: String,
            enum: ['pending', 'approved'],
        },
        approvedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export const Deposit = mongoose.model('Deposit', depositSchema);
