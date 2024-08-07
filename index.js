const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user.js");
const blogRoutes = require("./routes/blog.js")


require("dotenv").config();

// [SECTION] Server setup
const app = express();

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(cors());  


// [SECTION] MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes)



// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
} 

module.exports = { app, mongoose };
