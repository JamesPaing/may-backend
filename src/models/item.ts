import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const itemSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        price: Number,
        mainImage: String,
        images: [String],
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

export const Item = mongoose.model('Item', itemSchema);
