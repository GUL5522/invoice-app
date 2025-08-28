const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Invoice = require('./modal/InsertInvoice')

const cors = require('cors')
app.use(cors());


app.use(express.json());
const url = "mongodb+srv://gulshankurgupta:gulshan@cluster0.f2p96.mongodb.net/"

// Database Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(url)
.then(() => console.log('Connected to MongoDB') )
.catch(err => console.error('Error connecting to MongoDB:', err));

// signup route
app.get('/api/auth/signup',async(req, res) => {
    const {username, password} = req.body;
    const user = new User({ username: "gulshan", password: "123567" });
    await user.save();
    return res.status(200).json({success: true, message: 'Signup successful' });
});


app.post('/api/auth/login',async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    return res.status(200).json({success: true, message: 'Login successful' });
    
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

const port = process.env.PORT || 5500
app.listen(port, () => console.log(`Server is running on port ${port}`));