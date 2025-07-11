let clients = require("express").Router();
let { createReservation, getAvailableFoods } = require("../database");

clients.get("/", (req, res) => {
  res.render(__dirname + "/../views/Home.ejs", {
    layout: __dirname + "/../views/layouts/layout1.ejs",
    title: "Начало",
  });
});

clients.get("/reservation", (req, res) => {
  res.render(__dirname + "/../views/Reservation.ejs", {
    layout: __dirname + "/../views/layouts/layout1.ejs",
    title: "Резервация",
  });
});

clients.post("/reservation", (req, res) => {
  console.log(req.body);

  createReservation(req.body, (err) => {
    if (err) {
      console.log(err);

      return res.send("Unknown error!");
    }

    res.render(__dirname + "/../views/Info.ejs", {
      layout: __dirname + "/../views/layouts/layout1.ejs",
      title: "Info",
      text: "Успешно подадена заявка за резервация! Ние ще ви информираме!",
    });

    // Missing websocket for employees
  });
});

clients.get("/menu", (req, res) => {
  getAvailableFoods((err, foods) => {
    if (err) {
      console.error(err);
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/layout1.ejs",
        text: "Неочаквана грешка!",
      });
    }
    res.render(__dirname + "/../views/Menu.ejs", {
      layout: __dirname + "/../views/layouts/layout1.ejs",
      title: "Меню",
      foods: foods
    });
  });
});

clients.get("/contacts", (req, res) => {
  res.render(__dirname + "/../views/Contacts.ejs", {
    layout: __dirname + "/../views/layouts/layout1.ejs",
    title: "Контакти",
  });
});

module.exports = clients;
