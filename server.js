require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required.'});
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email address.'});
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact: ${name}`,
            text: `From: ${name} (${email})\n\n${message}`,
            html: `
            <p><strong>From:</strong>${name} (${email})</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Email sent successfully!'});
    } catch (err) {
        console.error('Email send error:', err);
        return res.status(500).json({success: false, error: 'Server error. Please try again later.'});
    }
});

app.use(express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is runnning at http://localhost:${port}`);
});