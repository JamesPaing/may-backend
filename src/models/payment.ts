import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        id: Number,
        paymentMethod: {
            type: mongoose.Types.ObjectId,
            ref: 'PaymentMethod',
        },
        amount: Number,
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model('Payment', paymentSchema);
