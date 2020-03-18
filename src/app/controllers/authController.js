const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const User = require('../models/user');
const authConfig = require('../../config/auth');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try {
        let email = req.body.email;
        if (await User.findOne({ email })) return res.status(400).send({ error: 'User already exists' });
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({ user, generateToken: ({ id: user.id }) });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).send({ error: 'User not found' });
    if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Invalid password' });
    user.password = undefined;
    res.send({ user, token: generateToken({ id: user.id }) });
});

router.post('/forgot_password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ error: 'User not found' });
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            to: email,
            from: 'gbwellington@hotmail.com',
            template: 'auth/forgot_password',
            partialsDir: 'auth/forgot_password',
            layoutsDir: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err) {
                return res.status(400).send({ error: 'Error on password, try again' })
            }
        })

    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'error on password, try again' });
    }
})

module.exports = app => app.use('/auth', router);