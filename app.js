const path= require("path");
const express = require("express");
const app=express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
var cors=require('cors');
const errorHandler = require("./middleware/error");
const authRoutes =require('./routes/authRoutes');
const userRoutes =require('./routes/userRoutes');
const jobTypeRoutes =require('./routes/jobsTypeRoutes');
const jobRoutes = require("./routes/jobsRoutes"); 


//database connection
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("DB connected"))
   .catch((err) => console.log(err));

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
app.use(cors());

app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',jobTypeRoutes);
app.use('/api',jobRoutes);

__dirname = path.resolve() 

app.use(express.static(path.join(__dirname, '/frontend/build'))) 
app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )

  app.get('/', (req, res) => {
    res.send('API is running....')
  })

//error handler
app.use(errorHandler);

//routes
// app.get('/',(req,res)=>{
//         res.send("Hello from node js");
//})

// app.get('/',(req,res)=>{
//     res.send("welcome");
// })

//port 
const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});