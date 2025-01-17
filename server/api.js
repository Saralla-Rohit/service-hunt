const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const path = require("path"); // To resolve file paths
require('dotenv').config();
const app = express();

// CORS configuration
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const conString = process.env.MONGO_URL;
if (!conString) {
    console.error("MongoDB connection string not found in environment variables!");
    process.exit(1);
}

// MongoDB connection setup
let dbClient = null;
let db = null;

async function connectDB() {
    try {
        if (!dbClient) {
            dbClient = await mongoClient.connect(conString);
            db = dbClient.db("serviceHunt");
            console.log("Successfully connected to MongoDB database: serviceHunt");
        }
        return db;
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
    }
}

// Ensure database connection before starting the server
connectDB().then(() => {
    app.listen(5500, () => {
        console.log("App is listening on http://localhost:5500");
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve index.html for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); // Serve index.html
});

// Register user
app.post("/register-user", async (req, res) => {
    try {
        const db = await connectDB();
        const user = {
            UserId: parseInt(req.body.UserId),
            UserName: req.body.UserName,
            Email: req.body.Email,
            Password: req.body.Password,
            Mobile: parseInt(req.body.Mobile)
        };
        await db.collection("providers").insertOne(user);
        console.log("User Registered");
        res.json(user);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Get all providers (for login verification)
app.get("/providers", async (req, res) => {
    try {
        const db = await connectDB();
        const providers = await db.collection("providers").find({}).toArray();
        console.log("Providers data:", providers);
        res.json(providers);
    } catch (err) {
        console.error("Error fetching providers:", err);
        res.status(500).json({ error: "Error fetching providers" });
    }
});

// Create provider profile
app.post("/create-profile", async (req, res) => {
    try {
        const db = await connectDB();
        const profile = {
            UserName: req.body.UserName,
            Email: req.body.Email,
            MobileNumber: req.body.MobileNumber,
            YearsOfExperience: parseInt(req.body.YearsOfExperience),
            HourlyRate: parseInt(req.body.HourlyRate),
            Service: req.body.Service,
            Location: req.body.Location,
            UserId: parseInt(req.body.UserId),
        };
        await db.collection("providersInfo").insertOne(profile);
        console.log("Profile Created");
        res.send(profile);
    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ error: "Failed to create profile" });
    }
});

// Get profile by UserId
app.get("/get-profile/:UserId", async (req, res) => {
    try {
        const db = await connectDB();
        const query = { UserId: parseInt(req.params.UserId) };
        console.log("MongoDB Query:", query);
        const profile = await db.collection("providersInfo").findOne(query);
        console.log("Found profile:", profile);
        if (profile) {
            res.json(profile);
        } else {
            console.log("No profile found for UserId:", req.params.UserId);
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (err) {
        console.error("MongoDB Error:", err);
        res.status(500).json({ message: "Error fetching profile", error: err });
    }
});

// Edit provider profile by UserId
app.put("/edit-profile/:UserId", async (req, res) => {
    try {
        const db = await connectDB();
        const profile = {
            UserName: req.body.UserName,
            Email: req.body.Email,
            MobileNumber: req.body.MobileNumber,
            YearsOfExperience: parseInt(req.body.YearsOfExperience),
            HourlyRate: parseInt(req.body.HourlyRate),
            Service: req.body.Service,
            Location: req.body.Location,
            UserId: parseInt(req.params.UserId)
        };

        await db.collection("providersInfo").updateOne(
            { UserId: parseInt(req.params.UserId) },
            { $set: profile }
        );
        console.log("Profile Updated");
        res.json({ success: true, message: "Profile updated successfully", profile });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Error updating profile", error: err });
    }
});

// Get all provider profiles
app.get("/providersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo").find({}).toArray();
        console.log("Found profiles:", profiles);
        res.json(profiles);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Get all service providers info for dashboard
app.get("/api/getAllProvidersInfo", async (req, res) => {
    try {
        const db = await connectDB();
        const providersInfo = await db.collection("providersInfo").find({}).toArray();
        console.log("Service providers info:", providersInfo);
        res.json(providersInfo);
    } catch (err) {
        console.error("Error getting providers info:", err);
        res.status(500).json({ error: "Failed to get providers info" });
    }
});

// Get profiles by location
app.get("/get-profiles/:Location", async (req, res) => {
    try {
        const db = await connectDB();
        const profiles = await db.collection("providersInfo")
            .find({ 
                Location: { 
                    $regex: req.params.Location, 
                    $options: 'i' 
                } 
            })
            .toArray();
        res.json(profiles);
        console.log(profiles);
    } catch (err) {
        console.error("Error fetching profiles by location:", err);
        res.status(500).json({ error: "Failed to fetch profiles by location" });
    }
});

// Get filtered providers based on service and location
app.get("/get-filtered-providers", async (req, res) => {
    try {
        const db = await connectDB();
        const { service, location } = req.query;

        let filter = {};

        // Apply service filter if provided
        if (service) {
            filter.Service = service;
        }

        // Apply location filter if provided
        if (location) {
            filter.Location = location;
        }

        const providers = await db.collection("providersInfo")
            .find(filter)
            .toArray();
        res.json(providers);
    } catch (err) {
        console.error("Error fetching filtered providers:", err);
        res.status(500).json({ error: "Failed to fetch filtered providers" });
    }
});

// Check if user ID exists
app.get("/users/:userId", async (req, res) => {
    try {
        const db = await connectDB();
        const userId = parseInt(req.params.userId);
        const user = await db.collection("providers").find({ UserId: userId }).toArray();
        res.json(user);
    } catch (err) {
        console.error("Error checking user ID:", err);
        res.status(500).json({ error: "Failed to check user ID" });
    }
});
