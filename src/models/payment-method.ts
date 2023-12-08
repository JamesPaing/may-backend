import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        type: {
            type: String,
            enum: ['cod', 'bank', 'wallet', 'point'],
        },
        extra: String,
    },
    {
        timestamps: true,
    }
);

export const PaymentMethod = mongoose.model(
    'PaymentMethod',
    paymentMethodSchema
);
