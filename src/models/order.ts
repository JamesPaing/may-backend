import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        id: Number,
        ref: {
            type: String,
            unique: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        orderItems: {
            type: [mongoose.Types.ObjectId],
            ref: 'OrderItem',
        },
        payments: {
            type: [mongoose.Types.ObjectId],
            ref: ' Payment',
        },
        total: Number,
        subTotal: Number,
        screenShot: String,
        note: String,
        status: {
            type: String,
            enum: [
                'reviewing',
                'processing',
                'delivering',
                'delivered',
                'cancelled',
            ],
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model('Order', orderSchema);
