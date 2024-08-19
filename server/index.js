require("dotenv").config();
const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
const connection = require("./db");
const expenseRoutes = require('./routes/Operation/expense'); 
const incomeRoutes = require("./routes/Operation/income"); 
const CoSignupRoutes = require("./routes/companies");
const iconv = require('iconv-lite');

connection();

app.use(express.json());
app.use(cors()); 
app.use(express.static("public"));
app.use("/expense", expenseRoutes); 
app.use("/income", incomeRoutes); 
app.use("/companies", CoSignupRoutes); 

const port = process.env.PORT ;
app.listen(port, () => console.log(`Listening on port ${port}...`)); 
