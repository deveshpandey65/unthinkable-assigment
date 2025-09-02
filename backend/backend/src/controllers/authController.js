const authService = require('../services/authService');
const express = require('express');

exports.signup = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");

        const { name, email, password, role } = body; // multer parses text fields


        const result = await authService.registerUser({
            name,
            email,
            password,
            role,
        });

        res.status(201).json({
            success: true,
            user: result.user,
            token: result.token
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};



exports.login = async (req, res) => {
    
    try {
        const body = JSON.parse(req.body || "{}");
        const { email, password } = body;
        console.log("Login attempt for:", email);
        const result = await authService.loginUser({ email, password });
        console.log(result)
        res.status(200).json({ success: true, user: result.user, token: result.token, });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
};

exports.signOut = async (req, res) => {
    res.clearCookie('token'); // assuming token is stored in cookie
    res.status(200).json({ message: 'Signed out successfully' });
};
