const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173", "http://localhost:5173/"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./src/routes/routes"));

app.listen(port, () => {
  console.log(`Server running port is ${port}`);
});
