import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { TUser } from 'src/@types/user-types';

const userSchema = new Schema(
    {
        id: Number,
        name: String,
        contact: String,
        email: String,
        address: String,
        role: {
            type: String,
            enum: ['user', 'admin', 'super_admin', 'vendor', 'biker'],
            default: 'user',
        },
        password: String,
        passwordConfirmation: String,
        passwordResetToken: String,
        passwordChangedAt: Date,
        wallet: {
            type: Types.ObjectId,
            ref: 'Wallet',
        },
        vendors: {
            type: [Types.ObjectId],
            ref: 'Vendor',
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },
        currentCoordinate: {
            type: Types.ObjectId,
            ref: 'Coordinate',
        },
        coordinates: {
            type: [Types.ObjectId],
            ref: 'Coordinate',
        },
        favourites: {
            type: [Types.ObjectId],
            ref: 'Item',
        },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        autoIndex: true,
    }
);

userSchema.index({ location: '2dsphere' });

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'favourites',
        select: '_id name mainImage price vendor',
    })
        .populate({
            path: 'vendors',
            select: '_id name -user',
        })
        .populate({
            path: 'wallet',
            select: '_id balance -owner',
        });

    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //@ts-ignore
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    //@ts-ignore
    this.passwordChangedAt = Date.now() - 1000; //hacked

    next();
});

// Methods
userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.verifyRole = function (user: TUser, role: string) {
    return user.role === role;
};

export const User = model('User', userSchema);
