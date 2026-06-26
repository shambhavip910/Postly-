const app = require("./src/app");
const connectdb = require("./src/db/db");
require('dotenv').config();

connectdb();
app.listen(process.env.PORT || 3000, () => console.log("Server running"));
