import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const itemSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        price: Number,
        mainImage: String,
        images: [String],
        favouritedBy: {
            type: [ObjectId],
            ref: 'User',
        },
        description: String,
        quantity: {
            type: Number,
            default: 5,
        },
        vendor: {
            type: ObjectId,
            ref: 'Vendor',
        },
        categories: {
            type: [ObjectId],
            ref: 'Category',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

itemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'vendor',
        select: '_id name',
    }).populate({
        path: 'categories',
        select: '_id name',
    });

    next();
});

export const Item = mongoose.model('Item', itemSchema);
