const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/recipes", require("./routes/recipes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
