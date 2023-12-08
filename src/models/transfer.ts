import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
    {
        id: Number,
        transferrer: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        amount: Number,
        status: {
            type: String,
            enum: ['completed'],
            default: 'completed',
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

transferSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'transferrer',
        select: '_id name',
    }).populate({
        path: 'receiver',
        select: '_id name',
    });

    next();
});

export const Transfer = mongoose.model('Transfer', transferSchema);
