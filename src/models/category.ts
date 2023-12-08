import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    count: Number,
    forMarket: {
        type: Boolean,
        default: false,
    },
    image: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});

export const Category = mongoose.model('Category', categorySchema);
