var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var cors = require('cors');
var bodyParser = require("body-parser");

var dataModule = require("./modules/serverDataModule.js");

app.use(cors({
    origin: 'http://localhost:3000'
    // origin: 'https://still-thicket-95361.herokuapp.com'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req,res)=>{
    res.redirect("/games");
})

app.get("/games",(req, res) => {
    dataModule.getAllGames().then((data) => {
        if (data.length > 0) {
            return res.json(data);
        } else {
            return res.json([]);
        }
    })
    .catch((err) => {
        return res.json([]);
    })
});

app.post("/games/add", (req, res) => {
    dataModule.addGame(req.body).then(()=> {
    }).catch(err=>{
        res.status(500).send(err);
    });
});

app.get("/games/delete/:gameNum",(req,res)=> {
    dataModule.deleteGameByNum(req.params.gameNum).then((data)=>{
    }).catch(err=>{
        res.status(500).send("Unable to Remove Game / Game not found");
    });
});

app.get("/categories",(req, res) => {
    dataModule.getAllCategories().then((data) => {
        if (data.length > 0) {
            return res.json(data);
        } else {
            return res.json([]);
        }
    })
    .catch((err) => {
        return res.json([]);
    })
});

//finding user login data
app.post("/loginPage", (req, res) => {
    const username = req.body.userName;
    const password = req.body.password;
    if (username === "" || password === "" ){
        //return res.render("login", {errorMsg: "Both fields are required!", user: req.session.user})
        return res.json("login", {errorMsg: "Both fields are required!"})
    }
    dataModule.getUser(username).then((data)=>{
        console.log(data);
        return res.json(data);
        
    }).catch((err)=>{
        res.status(500).send(err);
    })  
});

//creating a new user
/* app.post("/login/add", (req, res) => {
    dataModule.addGame(req.body).then(()=> {
        res.json("succesfully created a new user")
    }).catch(err=>{
        res.status(500).send(err);
    });
}); */

app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});
dataModule.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port: " + HTTP_PORT);
    });
})
.catch((err) => {
    console.log(err);
})