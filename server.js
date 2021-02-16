var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var cors = require("cors");
var bodyParser = require("body-parser");

var dataModule = require("./modules/serverDataModule.js");

const allowedOrigins = ["http://localhost:3000","http://localhost:8080"];

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
);

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req,res)=>{
    res.redirect("/games");
})

app.get("/games",(req, res) => {
    dataModule.getAllGames().then((data) => {
        if (data.length > 0) {
            return res.send(JSON.stringify(data));
        } else {
            return res.send(JSON.stringify({message: "no results"}));
        }
    })
    .catch((err) => {
        return res.send(jSON.stringify({message: "no results"}));
    })
});

app.post("/games/add", (req, res) => {
    console.log(req.body);
    dataModule.addGame(req.body).then(()=> {
    }).catch(err=>{
        res.status(500).send('Unable to add game');
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