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
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
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
            enum: ['shop', 'market'],
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [
                {
                    type: Number,
                    default: undefined,
                },
            ],
        },
        coordinate: {
            type: mongoose.Types.ObjectId,
            ref: 'Coordinate',
        },
    },
    {
        timestamps: true,
        autoIndex: true,
    }
);

vendorSchema.index({ location: '2dsphere' });

vendorSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name -vendors',
    });

    next();
});

export const Vendor = mongoose.model('Vendor', vendorSchema);
