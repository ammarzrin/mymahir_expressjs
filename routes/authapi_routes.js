const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const bcrypt = require('bcrypt');
const upload = multer();
require('dotenv').config();
const jwt = require('jsonwebtoken');

// POST /auth/login - User Login
router.post('/login', upload.none(), async (req, res) => {
    const data = { ...req.body, ...req.query };
    const { email, password } = data;
    try {
        const [rows] = await db.query(
            `SELECT * FROM users WHERE email = ? AND type = ?`,
            [email, 'admin']
        );
        if (rows.length < 1) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.hash_password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }
        // Generate JWT Token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed due to server error.",
            error: error.message
        });
    }
});

// POST /auth/register - User Registration
router.post('/register', upload.none(), async (req, res) => {
    const data = { ...req.body, ...req.query };
    const { name, email, password } = data;
    const errors = [];

    // Basic validation
    if (!name || name.trim() == '') {
        errors.push('Name is required.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email.');
    }
    if (!password || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(password)) {
        errors.push('Password must be 8-20 characters long, include uppercase, lowercase, number, and special character.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        })
    }
    try {
        // Check if email already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User with this email is already registered."
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const type = 'admin'
        const result = await db.query('INSERT INTO users (name, email, hash_password, type) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, type]);
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: result.insertId
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server or database error during email check.",
            error: err.message
        });
    }
});

module.exports = router;