const express=require("express")
const mongoClient=require("mongodb").MongoClient
const cors=require("cors")
const app=express()
app.use(cors({
    origin:"http://127.0.0.1:5500",
    methods:["get","post","put","delete"],
    allowedHeaders:['Content-Type']

}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const conString="mongodb://127.0.0.1:27017"
app.get("/",(req,res)=>{
    res.send("hello")
})
app.post("/register-user",(req,res)=>{
    var user={
        UserId:parseInt(req.body.UserId),
        UserName:req.body.UserName,
        Email:req.body.Email,
        Password:req.body.Password,
        Mobile:parseInt(req.body.Mobile)
    }  
    mongoClient.connect(conString).then(clientObj=>{
        var db=clientObj.db("serviceHunt")
        db.collection("providers").insertOne(user).then(()=>{
            console.log("User Registered")
            res.json(user)
        })


    })  
})
app.get("/providers", (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var db = clientObj.db("serviceHunt")
        db.collection("providers").find({}).toArray().then(user => {
            res.json(user)
            console.log(user)
        })
    })
})

app.listen(5500,()=>{
    console.log("app is listening on http://localhost:5500")
})