let employees = require("express").Router();
let yaml = require("js-yaml");
let fs = require("fs");
let {
  getAllFoods,
  createFood,
  deleteFood,
  getAllReservations,
  finishReservation,
  getStatistics
} = require("../database");
let image = require("../multer");
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

employees.get("/foods/delete", (req, res) => {
  let id = req.query.id;
  console.log(id);

  res.render(__dirname + "/../views/admin/FoodDeleteValidation.ejs", {
    layout: __dirname + "/../views/layouts/adminLayout.ejs",
    title: "Админ",
    id: id,
  });
});

employees.post("/foods/delete", (req, res) => {
  let id = req.query.id;

  deleteFood(id, (err) => {
    if (err) {
      res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      });
    }
    res.redirect("/admin/foods");
  });
});

employees.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

employees.get("/", (req, res) => {
  getStatistics((err, stats) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.render(__dirname + "/../views/admin/AdminHome.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      stats: stats
    });
  })
});

employees.get("/reservations/finish", (req, res) => {
  let id = req.query.id;

  finishReservation(id, (err) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.redirect("/admin/reservations")
  })
})

employees.get("/reservations", (req, res) => {
  getAllReservations((err, reservations) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.render(__dirname + "/../views/admin/Reservations.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      reservations: reservations
    });
  })
});

employees.get("/reservations/waiting", (req, res) => {
  getAllReservations((err, reservations) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.render(__dirname + "/../views/admin/Reservations.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      reservations: reservations
    });
  }, "waiting")
});

employees.get("/reservations/approved", (req, res) => {
  getAllReservations((err, reservations) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.render(__dirname + "/../views/admin/Reservations.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      reservations: reservations
    });
  }, "approved")
});

employees.get("/reservations/rejected", (req, res) => {
  getAllReservations((err, reservations) => {
    if (err) {
      return res.render(__dirname + "/../views/Error.ejs", {
        layout: __dirname + "/../views/layouts/adminLayout.ejs",
        title: "Админ"
      })
    }
    res.render(__dirname + "/../views/admin/Reservations.ejs", {
      layout: __dirname + "/../views/layouts/adminLayout.ejs",
      title: "Админ",
      reservations: reservations
    });
  }, "rejected")
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
    title: "Админ",
  });
});

employees.post("/newfood", image.single("image"), (req, res) => {
  const { name, description, price } = req.body;
  let imgPath = req.file.path.replace(/\\/g, "/").replace("public", "");

  createFood({ image: imgPath, ...req.body }, (err, food) => {
    if (!err) {
      console.log(food);
      return res.redirect("/admin/foods");
    }

    res.redirect("/admin/newfood");
  });
});

module.exports = employees;
