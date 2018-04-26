const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models/index');
const middleware = require('../middleware/index');

router.get('/',function(req,res){
    res.render('index/landing');
});

router.get('/register',middleware.showAuthPages,function(req,res){
    res.render('index/register');
});

router.post('/register',middleware.showAuthPages,function(req,res){
    db.User.register(new db.User({
        username: req.body.username,
        bio: req.body.bio,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        bio: req.body.bio,
        fors: req.body.fors
    }),req.body.password,function(err,user){
        if(err){
            req.flash('error',err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash('success','Welcome to UniCo '+user.username);
            res.redirect('/');
        });
    })
});

router.get('/login',middleware.showAuthPages,function(req,res){
    res.render('index/login');
})

router.post('/login',middleware.showAuthPages,passport.authenticate('local',{
    failureRedirect:'/login'
    }),
    function(req,res){
        if(req.session.redirectTo === undefined || req.session.redirectTo === null)
            res.redirect('/');
        else{
            res.redirect(req.session.redirectTo);
        }
});

router.get('/logout',middleware.isLoggedIn,function(req,res){
    req.logout();
    req.flash('success','Successfuly logged out!');
    res.redirect('/');
});

module.exports = router;