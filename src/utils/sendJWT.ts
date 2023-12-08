const jwt = require('jsonwebtoken');

const signJWT = async (id: string) => {
    return await jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const createSendToken = async (user: any) => {
    const token = await signJWT(user._id);

    const expiresIn = 90 * 24 * 60 * 60 * 1000;

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + expiresIn),
    };

    process.env.NODE_ENV === 'production'
        ? (cookieOptions.httpOnly = false)
        : null;

    // user.password = undefined;

    // [fixed] this, right here is taking so loong with vendorLogin, you need to find out
    await user.save({
        validateBeforeSave: false,
    });

    return {
        token,
        user,
        isAuth: true,
    };
};
