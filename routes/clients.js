let clients = require("express").Router();

clients.get("/", (req, res) => {
    res.render(__dirname + "/../views/Home.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        title: "Начало"
    })
})

clients.get("/reservation", (req, res) => {
    res.render(__dirname + "/../views/Reservation.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        title: "Резервация"
    })
})

clients.get("/menu", (req, res) => {
    res.render(__dirname + "/../views/Menu.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        title: "Меню"
    })
})

clients.get("/contacts", (req, res) => {
    res.render(__dirname + "/../views/Contacts.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        title: "Контакти"
    })
})

module.exports = clients