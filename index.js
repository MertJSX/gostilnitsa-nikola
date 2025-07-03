let express = require("express")
let expressLayouts = require("express-ejs-layouts")
let session = require("express-session")
const PORT = 3000;
let employees = require("./routes/employees")
let clients = require("./routes/clients")
let app = express()

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(expressLayouts)
app.use(express.urlencoded({extended: false}))
app.use(
  session({
    secret: "aerth3456H",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  "/public",
  express.static(
    "public",
    // { maxAge: 24 * 60 * 60 * 1000 } // 1 day cache
  )
);
app.use("/", clients)
app.use("/emp", employees)


app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}!`)
})