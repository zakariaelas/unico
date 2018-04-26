const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const db = require('./models/index');
const flash = require('connect-flash');
const passport = require('passport'),
        passportLocalMongoose = require('passport-local-mongoose'),
        localStrategy = require('passport-local');
        expressSession = require('express-session');
const methodOverride = require('method-override');

var indexRoutes = require('./routes/index');
var blogRoutes = require('./routes/blogs');
var commentRoutes = require('./routes/comment');
var profileRoutes = require('./routes/profile');
var myBackpackRoutes = require('./routes/mybackpack');
var opportunitiesRoutes = require('./routes/opportunities');
var commentOppRoutes = require('./routes/commentOpportunity');

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static',express.static(__dirname + '/public'));
app.use(expressSession({
    secret:'uniCoBadr&Zakaria',
    resave:false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());//explain
app.use(passport.session());//explain
app.use(flash());
app.use(function(req,res,next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    res.locals.moment = require('moment');
    next();
});

passport.use(new localStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser()); //explain
passport.deserializeUser(db.User.deserializeUser()); //explain


app.use('/',indexRoutes);
app.use('/blogs',blogRoutes,commentRoutes);
app.use('/opportunities',opportunitiesRoutes,commentOppRoutes);
app.use('/profile',profileRoutes);
app.use('/mybackpack',myBackpackRoutes);

app.listen(PORT, ()=>{
    console.log("Server has started !");
});