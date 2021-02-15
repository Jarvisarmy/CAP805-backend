var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataModule = require("./modules/serverDataModule.js");



app.get("/", (req, res) => {
    console.log("here");
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