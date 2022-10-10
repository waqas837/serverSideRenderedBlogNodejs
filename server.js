const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");

const PORT = process.env.PORT || 3000;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodelogin",
});

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
app.get("/dashboard", (req, res) => {
  res.render(path.join(__dirname + "/Frontend/dashboard"));
});

// http://localhost:3000/auth
app.post("/auth", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          // Authenticate the user
          request.session.loggedin = true;
          request.session.username = username;
          // Redirect to home page
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

// http://localhost:3000/home
app.get("/home", function (request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    // Output username
    response.send("Welcome back, " + request.session.username + "!");
  } else {
    // Not logged in
    response.send("Please login to view this page!");
  }
  response.end();
});

app.listen(PORT, () => {
  console.log("Server is up at", PORT);
});
