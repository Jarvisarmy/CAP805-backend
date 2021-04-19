var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var cors = require('cors');
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
var dataModule = require("./modules/serverDataModule.js");

app.use(cors({
    origin: 'http://localhost:3000',
    //origin: 'https://still-thicket-95361.herokuapp.com'
    credentials: true,
    methods : ["GET", "POST", "DELETE", "PUT"]
}));

app.use(cookieParser());

app.use(session({
    key : "userId",
    secret: "teamFalcon",
    resave: false,
    saveUninitialized : false,
    cookie: {
        expires : 1000*60*24,
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req,res)=>{
    res.redirect("/games");
})

//Functions
function ensureLogin(req, res, next) {
    if (req.session.user) {
        res.redirect("/loginPage");
    } else {
        next();
    }
}

function ensureAdmin(req, res, next) {
    if (!req.session.user.isAdmin) {
        res.redirect("/loginPage")
    } else {
        next();
    }
}

//Routes
app.get("/games",(req, res) => {
    if (req.query.user) {
        dataModule.getGamesByUser(req.query.user).then((data)=>{
            if (data.length > 0) {
                return res.json(data);
            } else {
                return res.json([]);
            }
        })
        .catch((err)=>{
            return res.json([]);
        })
    } else {
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
    }
});


app.get("/game/:id",(req,res)=>{
    dataModule.getGameById(req.params.id).then((data)=>{
        return res.json(data);
    })
    .catch((err)=>{
        return res.json({});
    })
});
app.post("/games/add", (req, res) => {
    dataModule.addGame(req.body).then((res)=> {
        return res.json(res);
    }).catch(err=>{
        return res.json(err);
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


app.post("/games/addRate", (req, res) => {
    dataModule.addRating(req.body).then(()=> {
    }).catch(err=>{
        res.status(500).send(err);
    });
});


app.get("/rate/:id",(req,res)=>{
    dataModule.getAvgRatingByGameId(req.params.id).then((data)=>{
        return res.json(data);
    })
    .catch((err)=>{
        return res.json({});
    })
});



app.get("/ratings",(req, res) => {
    dataModule.getAllRates().then((data) => {
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

    if(username === "" || password === ""){
        return res.status(404).send("Empty User or Password");
    }
    dataModule.getUser(username).then((data)=>{
        //console.log(data);
        //console.log(data.password);
        if(data[0].userName === username && data[0].password === password){
            req.session.user = data[0];
            console.log("session info:")
            console.log(req.session.user);
            return res.json(req.session.user);
            
        }
        else{
            console.log("didn't make it")
            return res.json({message: "wrong username or password"});
        }
        
    }).catch((err)=>{
        res.status(500).send(err);
    })  
});

app.get("/login", (req,res)=>{
    if (req.session.user){
        return res.json({loggedIn: true, user: req.session.user});
    }
    else{
       return res.json({loggedIn : false});
    }
})

//creating a new user
/* app.post("/login/add", (req, res) => {
    dataModule.addGame(req.body).then(()=> {
        res.json("succesfully created a new user")
    }).catch(err=>{
        res.status(500).send(err);
    });
}); */

app.post("/signupPage", (req, res) => {
    console.log(req.body);
    dataModule.addUser(req.body).then(()=> {
        res.json({status:"success",msg:"successfully created new user"});
    }).catch(err=>{
        res.json({status:"fail",msg:"unable to create the user"});
    });
});

app.post("/users",(req,res)=>{
    console.log(req.body);
    dataModule.updateUserInfo(req.body).then(()=> {
        res.json({status:"success",msg:"successfully update user infomation"});
    }).catch(err=>{
        res.json({status:"fail",msg:"unable to update the user information"});
    });
})

app.get("/adminPage",(req, res) => {
    dataModule.getUnApprovedGames().then((data) => {
        if (data.length > 0) {
            return res.json(data);
        } else {
            return res.json([]);
        }
    })
    .catch((err) => {
        return res.json([err]);
    })
});



app.get("/adminPage/users",(req, res) => {
    dataModule.getAllUsers().then((data) => {
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

app.get("/adminPage/delete/:userNum",(req,res)=> {
    dataModule.deleteUserByNum(req.params.userNum).then((data)=>{
    }).catch(err=>{
        res.status(500).send("Unable to Remove User / User not found");
    })
});

//approve game
app.get("/adminPage/:gameNum",(req,res)=> {
    console.log("approving game...")
    console.log(req.params.gameNum);
    dataModule.approveGames(req.params.gameNum).then((data)=>{
    }).catch(err=>{
        res.status(500).send("Unable to approve game/ game not found");
    });
});

app.get("/logout", (req,res)=>{
    req.session.destroy;
})

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