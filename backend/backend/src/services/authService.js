const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async ({ name, email, password, role }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const user = new User({ name, email, passwordHash:password, role, preferences: {} });
    await user.save();

    return {
        user,
        token: generateToken(user)
    };
};

exports.loginUser = async ({ email, password }) => {
    console.log(email)
    const user = await User.findOne({ email });
    if (!user || !( user.passwordHash === password)) {
        throw new Error("Invalid credentials");
    }

    return {
        user,
        token: generateToken(user)
    };
};
