const { compare } = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, companyLogo: user.companyLogo },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = generateToken;
