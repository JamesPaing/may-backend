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

orderItemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'item',
        select: '_id name vendor',
    });

    next();
});

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
