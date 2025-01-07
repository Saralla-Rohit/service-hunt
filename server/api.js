const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["get", "post", "put", "delete"],
    allowedHeaders: ['Content-Type']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providers").find({}).toArray().then(users => {
            res.json(users);
        });
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
        UserId: parseInt(req.body.UserId)
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
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt");
        db.collection("providersInfo").findOne({ UserId: parseInt(req.params.UserId) }).then(profile => {
            if (profile) {
                res.json(profile);
                console.log(profile);
            } else {
                res.status(404).json({ message: "Profile not found" });
            }
        }).catch(err => {
            res.status(500).json({ message: "Error fetching profile", error: err });
        });
    });
});
app.put("/edit-profile/:UserId",(req,res)=>{
    var profile = {
        UserName: req.body.UserName,
        Email: req.body.Email,
        MobileNumber: req.body.MobileNumber,
        YearsOfExperience: parseInt(req.body.YearsOfExperience),
        HourlyRate: parseInt(req.body.HourlyRate),
        Service: req.body.Service,
        UserId: parseInt(req.body.UserId)
    };
    mongoClient.connect(conString).then(clientObj=>{
        var db=clientObj.db("serviceHunt");
        db.collection("providersInfo").updateOne(
            {UserId:parseInt(req.params.UserId)},
            {$set:profile}
        ).then(()=>{
            console.log("Profile Updated")
            res.send(profile)
        })
    })
})


app.listen(5500, () => {
    console.log("app is listening on http://localhost:5500");
});
