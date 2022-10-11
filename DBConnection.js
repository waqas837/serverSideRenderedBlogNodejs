const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/blogsystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(`DB connection failed ${err}`));