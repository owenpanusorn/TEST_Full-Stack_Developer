const express = require("express")
const app = express();
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require("./src/routes/routes"))

app.listen(port, () => {
  console.log(`Server running port is ${port}`);
});

