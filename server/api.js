const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
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

const conString = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
    res.send("hello");
});

// Register user
app.post("/register-user", (req, res) => {
    var user = {
        UserId: parseInt(req.body.UserId),
        UserName: req.body.UserName,
        Email: req.body.Email,
        Password: req.body.Password,
        Mobile: parseInt(req.body.Mobile)
    };
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providers").insertOne(user).then(() => {
            console.log("User Registered");
            res.json(user);
        });
    });
});

// Get all providers (for login verification)
app.get("/providers", (req, res) => {
    mongoClient.connect(conString).then(async (clientObj) => {
        try {
            var db = clientObj.db("serviceHunt");
            // Get data from providers collection where user credentials are stored
            const providers = await db.collection("providers").find({}).toArray();
            console.log("Providers data:", providers);
            res.json(providers);
        } catch (error) {
            console.error("Error fetching providers:", error);
            res.status(500).json({ error: "Error fetching providers" });
        }
    }).catch(err => {
        console.error("Database connection error:", err);
        res.status(500).json({ error: "Database connection error" });
    });
});

// Create provider profile
app.post("/create-profile", (req, res) => {
    var profile = {
        UserName: req.body.UserName,
        Email: req.body.Email,
        MobileNumber: req.body.MobileNumber,
        YearsOfExperience: parseInt(req.body.YearsOfExperience),
        HourlyRate: parseInt(req.body.HourlyRate),
        Service: req.body.Service,
        Location: req.body.Location,
        UserId: parseInt(req.body.UserId),
    };
    mongoClient.connect(conString).then(clientObj => {
        clientObj.db("serviceHunt").collection("providersInfo").insertOne(profile).then(() => {
            console.log("Profile Created");
            res.send(profile);
        });
    });
});

// Get profile by UserId
app.get("/get-profile/:UserId", (req, res) => {
    console.log("Fetching profile for UserId:", req.params.UserId);
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        const query = { UserId: parseInt(req.params.UserId) };
        console.log("MongoDB Query:", query);
        db.collection("providersInfo").findOne(query).then(profile => {
            console.log("Found profile:", profile);
            if (profile) {
                res.json(profile);
            } else {
                console.log("No profile found for UserId:", req.params.UserId);
                res.status(404).json({ message: "Profile not found" });
            }
        }).catch(err => {
            console.error("MongoDB Error:", err);
            res.status(500).json({ message: "Error fetching profile", error: err });
        });
    }).catch(err => {
        console.error("MongoDB Connection Error:", err);
        res.status(500).json({ message: "Database connection error", error: err });
    });
});

app.put("/edit-profile/:UserId", (req, res) => {
    console.log("Received edit profile request for UserId:", req.params.UserId);
    console.log("Request body:", req.body);

    var profile = {
        UserName: req.body.UserName,
        Email: req.body.Email,
        MobileNumber: req.body.MobileNumber,
        YearsOfExperience: parseInt(req.body.YearsOfExperience),
        HourlyRate: parseInt(req.body.HourlyRate),
        Service: req.body.Service,
        Location: req.body.Location,
        UserId: parseInt(req.params.UserId)
    };

    console.log("Processed profile data:", profile);

    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo").updateOne(
            { UserId: parseInt(req.params.UserId) },
            { $set: profile }
        ).then((result) => {
            console.log("MongoDB update result:", result);
            if (result.matchedCount > 0) {
                console.log("Profile Updated");
                res.json({ success: true, message: "Profile updated successfully", profile });
            } else {
                console.log("No profile found to update");
                res.status(404).json({ success: false, message: "No profile found to update" });
            }
        }).catch(err => {
            console.error("Error updating profile:", err);
            res.status(500).json({ success: false, message: "Error updating profile", error: err });
        });
    }).catch(err => {
        console.error("MongoDB connection error:", err);
        res.status(500).json({ success: false, message: "Database connection error", error: err });
    });
});

// Get all providers info
app.get("/providersInfo", (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo").find({}).toArray().then(profiles => {
            console.log("Found profiles:", profiles);
            res.json(profiles);
        });
    }).catch(err => {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ error: "Database error" });
    });
});

// Get all service providers info for dashboard
app.get("/api/getAllProvidersInfo", (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo")
            .find({})
            .toArray()
            .then(providersInfo => {
                console.log("Service providers info:", providersInfo);
                res.json(providersInfo);
            })
            .catch(err => {
                console.error("Error getting providers info:", err);
                res.status(500).json({ error: "Failed to get providers info" });
            });
    });
});

// Get profiles by location
app.get("/get-profiles/:Location", (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo").find({ Location: req.params.Location }).toArray().then(profile => {
            res.json(profile)
            console.log(profile)
        })
    })
})

// Get filtered providers based on service and location
app.get("/get-filtered-providers", (req, res) => {
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

    // Connect to MongoDB and fetch the filtered providers
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo")
            .find(filter)
            .toArray()
            .then(providers => {
                res.json(providers);
            })
            .catch(err => {
                res.status(500).send("Error fetching providers: " + err.message);
            });
    }).catch(err => {
        res.status(500).send("Database connection error: " + err.message);
    });
});

app.listen(5500, () => {
    console.log("app is listening on http://localhost:5500");
});
//locationInput