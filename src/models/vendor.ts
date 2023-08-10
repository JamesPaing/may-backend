import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        address: String,
        city: String,
        township: String,
        password: {
            type: String,
            min: 6,
        },
        passwordConfirmation: {
            type: String,
        },
        wallet: {
            type: mongoose.Types.ObjectId,
            ref: 'Wallet',
        },
        items: {
            type: [mongoose.Types.ObjectId],
            ref: 'Item',
        },
        logo: String,
        images: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ['shop', 'restaurant'],
        },
        coordinate: {
            type: mongoose.Types.ObjectId,
            ref: 'Coordinate',
        },
    },
    {
        timestamps: true,
    }
);

export const Vendor = mongoose.model('Vendor', vendorSchema);
