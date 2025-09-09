const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Invoice = require('./modal/InsertInvoice')
require('dotenv').config();

const cors = require('cors')
app.use(cors());

app.use(express.json());

// Environment variables with fallback defaults
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT || 5500

// Validate required environment variables
if (!MONGODB_URI || MONGODB_URI.includes('your-database-name')) {
  console.warn('Warning: MONGODB_URI is not set or contains placeholder. Please set a valid MONGODB_URI in .env file.');
}
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Please set JWT_SECRET in .env file for security.');
}

// Database Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Connect to MongoDB only if URI is provided
if (MONGODB_URI && !MONGODB_URI.includes('your-database-name')) {
  mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB') )
  .catch(err => console.error('Error connecting to MongoDB:', err));
} else {
  console.error('MongoDB connection skipped: MONGODB_URI is not properly configured');
}

// signup route - RESTRICTED TO ONLY ONE USER
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if any user already exists (only one user allowed for bill generation)
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'System already has a registered user. Only one user is allowed for bill generation.'
            });
        }

        // Check if user already exists (additional check)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        return res.status(201).json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

// update user credentials route
app.put('/api/auth/update', async (req, res) => {
    try {
        const { currentPassword, newUsername, newPassword } = req.body;

        // Get the current user (since we only have one user, get the first user)
        const user = await User.findOne();
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Prepare update object
        const updateData = {};

        if (newUsername && newUsername !== user.username) {
            // Check if new username already exists
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }
            updateData.username = newUsername;
        }

        if (newPassword) {
            // Hash new password
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
            updateData.password = hashedNewPassword;
        }

        // Update user
        await User.findByIdAndUpdate(user._id, updateData);

        return res.status(200).json({
            success: true,
            message: 'User credentials updated successfully',
            user: {
                id: user._id,
                username: updateData.username || user.username
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

// insert invoice in db
app.post('/api/invoices', async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        return res.status(200).json({success: true, message: 'Invoice saved successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Failed to save invoice' });
    }
})

// get all invoices
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        return res.status(200).json({success: true, invoices });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Failed to fetch invoices' });
    }
})

// get invoice by id
app.get('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({success: false, message: 'Invoice not found' });
        }
        return res.status(200).json({success: true, invoice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Failed to fetch invoice' });
    }
})

const port = process.env.PORT || 5500
app.listen(port, () => console.log(`Server is running on port ${port}`));
