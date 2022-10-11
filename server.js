const express = require("express");
const session = require("express-session");
const path = require("path");
require("./DBConnection");
const PORT = process.env.PORT || 3000;

const app = express();
// Set the view engine to ejs
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Frontend")));

// http://localhost:3000/
app.get("/", function (request, response) {
  request.session.user = "amy";
  request.session.admin = true;
  var name = "Louise";
  response.render(path.join(__dirname + "/Frontend/index"), {
    name,
  });
});
// routing for dynamic files
app.get("/author", (req, res) => {
  res.render(path.join(__dirname + "/Frontend/author"));
});

app.get("/post", (req, res) => {
  res.render(path.join(__dirname + "/Frontend/post"));
});

app.get("/login", (req, res) => {
  res.render(path.join(__dirname + "/Frontend/login"));
});
app.get("/dashboard", (req, res) => {
  if (!req.session.user === "amy") {
    res.render(path.join(__dirname + "/Frontend/dashboard"));
  } else {
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log("Server is up at", PORT);
});
