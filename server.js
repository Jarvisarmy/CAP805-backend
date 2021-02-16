var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");

var dataModule = require("./modules/serverDataModule.js");


app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get("/", (req,res)=>{
    res.redirect("/games");
})

app.get("/games",(req, res) => {
    dataModule.getAllGames().then((data) => {
        if (data.length > 0) {
            return res.send(JSON.stringify(data));
        } else {
            return res.send(JSON.stringify([]));
        }
    })
    .catch((err) => {
        return res.send(JSON.stringify({message: "no results"}));
    })
});

app.post("/games/add", (req, res) => {
    console.log(req.body);
    dataModule.addGame(req.body).then(()=> {
    }).catch(err=>{
        res.status(500).send('Unable to add game');
    });
});
app.get("/games/delete/:gameNum",(req,res)=> {
    dataModule.deleteGameByNum(req.params.gameNum).then((data)=>{
    }).catch(err=>{
        res.status(500).send("Unable to Remove Game / Game not found");
    });
});

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