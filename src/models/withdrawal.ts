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
            default: 'pending',
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

withdrawalSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name',
    });

    next();
});

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
