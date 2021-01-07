const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = Router();


// /api/auth/register
router.post('/register',
    [
        check('email', 'invalid email').isEmail(),
        check('password', '1 char - min password length').isLength({ min: 1 })
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'The registration data is incorrect'
                });
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email })
            if (candidate) {
                res.status(400).json({ message: 'This user already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 2234);
            const user = new User({ email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: ' New user was successfully registered' });

        } catch (e) {
            res.status(500).json({ message: "something is wrong, try it again" })
        }
    });


// /api/auth/login
router.post('/login',
    [
        check('email', 'enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter Password').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'The login data is incorrect'
                });
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'User is not found' })
            }

            const isPassMatch = await bcrypt.compare(password, user.password);
            if (!isPassMatch) {
                return res.status(400).json({ message: 'wrong password, please, try to enter it again' });
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({ message: "something is wrong, try it again" })
        }
    });

module.exports = router;