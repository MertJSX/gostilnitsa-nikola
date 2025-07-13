let express = require("express")
let expressLayouts = require("express-ejs-layouts")
let yaml = require("js-yaml")
let fs = require("fs")
let session = require("express-session")
let employees = require("./routes/employees")
let clients = require("./routes/clients")
let { initializeDatabase } = require("./database")
initializeDatabase();
let ws = require("./websocket")
let api = require("./routes/api")
const opt = yaml.load(fs.readFileSync("settings.yml", "utf8"));
const PORT = opt.port;
let app = express()

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(expressLayouts)
app.use(express.urlencoded({extended: false}))
app.use(
  session({
    secret: opt.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  "/public",
  express.static(
    "public"
  )
);
app.use("/", clients)
app.use("/admin/", employees)
app.use("/api", api)


app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}!`)
})