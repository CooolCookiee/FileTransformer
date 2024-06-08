const express = require("express");
const cors = require("cors");

//Initializing express
const app = express();

//cors
app.use(cors());

// Read and parse body
app.use(express.json());

//Routes
app.use("/ari", require("./routes/convert"));

//Listen requests
app.listen(4000, () => {
  console.log(`Server running on port 4000.`);
});
