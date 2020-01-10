//load in environment const and set the inside process.env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session =require('express-session')
const methodOverride = require('method-override')

//foxy add
const db = require("./models");
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

//require passport function
const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => users.find(user  => user.email === email),
    id => users.find(user  => user.id === id)
    )
//for  storing locally nodb (at every refresh it's gonna be deleted)
const users = []
//Pointing its using .ejs

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))//taking formas and bulding access
//server to use passport
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false 
}))
app.use(passport.initialize())//func inside pass to set the basics
app.use(passport.session())//to make const persited during the cross of the entire session
app.use(methodOverride('_method'))

//set the route for application
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

//Routes for views
app.get('/login', checkNotAuthenticated, (req, res) => { //verify user
    res.render('login')
})

app.post('/login', checkNotAuthenticated ,passport.authenticate('local',{
   successRedirect: '/', //where to go when success
   failureRedirect: '/login',
   failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

//app for registering users
app.post('/register', checkNotAuthenticated, async (req,  res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,  10)//10 is fast and secure
        users.push({ //this would be automathically generated with a db
            id: Date.now().toString(),
            name:  req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
//  console.log(users);
})

//LogOut

app.delete('/logout', (req, res) => {
    req.logOut() //set by passport to clear the session 
    res.redirect('/login')
})


//middleware funct
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
      return next() //true
  }  
//flase it'll  redirect the user
  res.redirect('/login')
}

//wont allows  to login if its already loged
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
       return res.redirect('/')
    }  
    next()
}


//PORT
app.listen(3000, function() {
    //console.log('Example app')
})

//pasportjs for auth and persisting the user thru all the dif requests 

//foxy add 
// Starting the server, syncing our models ------------------------------------/
//db.sequelize.sync(syncOptions).then(function() {
//    app.listen(PORT, function() {
//      console.log(
//        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
//        PORT,
//        PORT
//      );
//    });
//  });
//  
//  module.exports = app;