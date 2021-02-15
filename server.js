var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataModule = require("./modules/serverDataModule.js");

app.get("/", (req,res)=>{
    res.redirect("/games");
})

app.get("/games",(req, res) => {
    dataModule.getAllGames().then((data) => {
        if (data.length > 0) {
            res.json(data);
        } else {
            res.json({message: "no results"});
        }
    })
    .catch((err) => {
        res.json({message: "no results"});
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