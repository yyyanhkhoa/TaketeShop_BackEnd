const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const routes = require('./routes')
const db = require('./config/db/connect')
const app = express();
const port = process.env.PORT || 4000;


app.use(express.urlencoded({
    extended: true
}))

// Để app đọc được json gửi lên
app.use(express.json())

// để front end từ local host lấy api được
app.use(cors())

// đọc cookies
app.use(cookieParser())


app.use(fileUpload({
    useTempFiles: true,
}))

// nhận biến môi trường
dotenv.config()

//connect Db
db.connect();

//navigation
routes(app);



//connect server
app.listen(port);