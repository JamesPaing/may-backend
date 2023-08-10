import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
    {
        id: Number,
        owner: {
            type: mongoose.Types.ObjectId,
            refPath: 'kind',
        },
        kind: String,
        balance: Number,
    },
    {
        timestamps: true,
    }
);

export const Wallet = mongoose.model('Wallet', walletSchema);
