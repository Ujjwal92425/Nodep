const express = require("express");
const mongoose = require ("mongoose");
const bodyParser = require("body-parser");
const dotenv = require ("dotenv");
const path = require('path');

const app = express();
app.use(express.static('public'));

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});


const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.post("/register", async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const existingUser = await Registration.findOne({email:email});
        if(!existingUser) {
            const registrationData = new Registration ({
                name,
                email,
                password 
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User Exist");
            res.redirect("/error");
        }
        
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});


app.get("/success", (req,res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Index1.html'));
});

app.get("/error", (req,res) => {
    res.sendFile(path.join(__dirname, 'pages', 'error.html'));
});

app.listen(port , () => {
    console.log(`server is running at ${port}`);
});
