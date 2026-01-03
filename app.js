require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express();

//imported routes
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const { connectionDB } = require('./connection')
const { checkForAuthCookie, noCache } = require('./middleware/auth')
const Blog = require('./models/blog')

//ejs
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(checkForAuthCookie)  //global middleware
app.use(noCache)
app.use(express.static(path.resolve('./public')))


//DBconnection
const MONGO_URL = process.env.MONGO_URLL;
// console.log("MONGO_URL =",MONGO_URL);
connectionDB(MONGO_URL)


app.get('/', async (req, res) => {
    const allblogs = await Blog.find({}).populate('createdBy');
    res.render('home', {
        user: req.isLoggedInUser,
        blogs: allblogs,
    })
    // console.log("user",req.isLoggedInUser)
    // console.log("blogs",allblogs)
})

//routes
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)




let PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`running,${PORT}`);
})