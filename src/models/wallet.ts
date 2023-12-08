import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
    {
        id: Number,
        owner: {
            type: mongoose.Types.ObjectId,
            refPath: 'kind',
        },
        kind: {
            type: String,
            enum: ['User', 'Vendor'],
        },
        balance: Number,
    },
    {
        timestamps: true,
    }
);

walletSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'owner',
        select: '_id name ',
    });

    next();
});

export const Wallet = mongoose.model('Wallet', walletSchema);
