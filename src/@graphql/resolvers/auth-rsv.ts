import { createSendToken } from '../../utils/sendJWT';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { User } from '../../models/user';
import { TUserArgs } from '../../@types/user-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';

export const authResolvers = {
    Mutation: {
        login: async (
            _: undefined,
            {
                credentials,
            }: { credentials: { contact: string; password: string } }
        ) => {
            const { contact, password } = credentials;

            const user: any = await User.findOne({
                contact,
            }).select('+password');

            if (
                !user ||
                //@ts-ignore
                !(await user.correctPassword(password, user.password))
            ) {
                throw 'Incorrect contact or password.';
            }

            if (!user.verifyRole(user, 'user')) {
                throw 'You are not authorized for this app.';
            }

            return await createSendToken(user);
        },
        vendorLogin: async (
            _: undefined,
            {
                credentials,
            }: { credentials: { email: string; password: string } }
        ) => {
            const { email, password } = credentials;

            const user: any = await User.findOne({
                email,
            }).select('+password -vendors');

            if (
                !user ||
                //@ts-ignore
                !(await user.correctPassword(password, user.password))
            ) {
                throw 'Incorrect email or password.';
            }

            if (!user.verifyRole(user, 'vendor')) {
                throw 'You are not authorized for this app.';
            }

            return await createSendToken(user);
        },
        bikerLogin: async (
            _: undefined,
            {
                credentials,
            }: { credentials: { email: string; password: string } }
        ) => {
            const { email, password } = credentials;

            const user: any = await User.findOne({
                email,
            }).select('+password');

            if (
                !user ||
                //@ts-ignore
                !(await user.correctPassword(password, user.password))
            ) {
                throw 'Incorrect email or password.';
            }

            if (!user.verifyRole(user, 'biker')) {
                throw 'You are not authorized for this app.';
            }

            return await createSendToken(user);
        },
        register: async (
            _: undefined,
            {
                credentials,
            }: {
                credentials: {
                    email: string;
                    password: string;
                    name: string;
                    passwordConfirmation: string;
                    contact: string;
                };
            }
        ) => {
            const { email } = credentials;

            const existedUser = await User.findOne({
                email,
            });

            if (existedUser)
                throw new Error(
                    'There is already a user with contact number you provided, please use other number'
                );

            const id = await new AutoIncrement('user_id').incSequence();

            const newUser = await User.create({
                id,
                ...credentials,
            });

            return await createSendToken(newUser);
        },
        updateUser: async (_: undefined, { _id, user }: TUserArgs) => {
            const updatedUser = await User.findByIdAndUpdate(_id, user, {
                new: true,
                runValidators: true,
            });

            return updatedUser;
        },
        deleteUser: async (_: undefined, { _id }: TUserArgs) => {
            await User.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
