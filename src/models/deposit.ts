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

depositSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name',
    });

    next();
});

export const Deposit = mongoose.model('Deposit', depositSchema);
