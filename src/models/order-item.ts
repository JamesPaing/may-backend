import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        id: Number,
        item: {
            type: mongoose.Types.ObjectId,
            ref: 'Item',
        },
        quantity: Number,
    },
    {
        timestamps: true,
    }
);

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
