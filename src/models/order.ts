import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

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
            ref: 'Payment',
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            },
        },
        address: String,
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
                'completed',
                'cancelled',
            ],
            default: 'reviewing',
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ location: '2dsphere' });

orderSchema.pre('save', function (next) {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

    this.ref = `MAY-${nanoid()}`;

    next();
});

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'payments',
        select: '_id amount',
    }).populate({
        path: 'orderItems',
        select: '_id quantity item',
    });

    next();
});

export const Order = mongoose.model('Order', orderSchema);
