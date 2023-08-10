import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    id: Number,
    name: String,
    type: {
        type: String,
        enum: ['cod', 'bank account', 'mobile wallet', 'point'],
    },
    extra: String,
});

export const PaymentMethod = mongoose.model(
    'PaymentMethod',
    paymentMethodSchema
);
