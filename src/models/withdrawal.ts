import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
    {
        id: Number,
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        amount: Number,
        bankAccount: String,
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

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
