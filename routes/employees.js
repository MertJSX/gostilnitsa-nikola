let employees = require("express").Router();
let yaml = require("js-yaml");
let fs = require("fs");
let { getAllFoods, createFood, updateFoodQuantity  } = require("../database");
let image = require("../multer")
const opt = yaml.load(fs.readFileSync("settings.yml", "utf8"));

employees.get("/login", (req, res) => {
  res.render(__dirname + "/../views/admin/Login.ejs", {
    layout: __dirname + "/../views/layouts/emptyLayout.ejs",
    title: "Админ",
  });
});

employees.post("/login", (req, res) => {
  let password = req.body.password;

  if (password == opt.adminPassword) {
    req.session.username = "admin";
    res.redirect("/admin/");
    return;
  }

  res.redirect("/admin/login");
});

employees.use("/", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/admin/login");
    return;
  }
  next();
});

employees.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

employees.get("/", (req, res) => {
  res.render(__dirname + "/../views/admin/AdminHome.ejs", {
    layout: __dirname + "/../views/layouts/adminLayout.ejs",
    title: "Админ",
  });
});

employees.get("/reservations", (req, res) => {
  res.render(__dirname + "/../views/admin/Reservations.ejs", {
    layout: __dirname + "/../views/layouts/adminLayout.ejs",
    title: "Админ",
  });
});

employees.get("/foods", (req, res) => {
  getAllFoods((err, foods) => {
    if (err) {
      res.send("Unknown error");
      return;
    }
    res.render(__dirname + "/../views/admin/Foods.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      foods: foods,
    });
  });
});

employees.get("/newfood", (req, res) => {
  res.render(__dirname + "/../views/admin/NewFood.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ"
    });
})

employees.post("/newfood", image.single("image"), (req ,res) => {
  const {name, description, price } = req.body;
  let imgPath = req.file.path.replace(/\\/g, "/").replace("public", "");

  createFood({image: imgPath, ...req.body}, (err, food) => {
    if (!err) {
      console.log(food);
      return res.redirect("/admin/foods");
    }

    res.redirect("/admin/newfood")

  });

  
})

module.exports = employees;
