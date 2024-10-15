const express = require("express");
const cors  = require("cors");
const app = express(); 
const auth = require("./auth");
const category = require("./categories");
const countrystatecity = require("./countrystatecity")


app.use(cors());
app.use(express.json());
app.use(auth);
app.use(category);
app.use(countrystatecity);



const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
