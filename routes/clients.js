let clients = require("express").Router();

clients.get("/", (req, res) => {
    res.render(__dirname + "/../views/Home.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        title: "Начало"
    })
})

module.exports = clients