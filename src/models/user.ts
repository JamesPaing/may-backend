import { Schema, Types, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        id: Number,
        name: String,
        contact: String,
        email: String,
        address: String,
        role: {
            type: String,
            enum: ['user', 'admin', 'super_admin'],
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
        currentCoordinate: {
            type: Types.ObjectId,
            ref: 'Coordinate',
        },
        coordinates: {
            type: [Types.ObjectId],
            ref: 'Coordinate',
        },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

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

export const User = model('User', userSchema);
