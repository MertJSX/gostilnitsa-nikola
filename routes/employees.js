let employees = require("express").Router();

employees.get("/", (req, res) => {
    res.send("It's working! This route is for employees!")
})

module.exports = employees