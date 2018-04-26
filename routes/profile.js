const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

router.get('/',middleware.isLoggedIn,function(req,res){
    var theUser = req.user;
    theUser.same = true;
    res.render('index/profile',{userProfile: theUser});
});

router.get('/edit',function(req,res){
    res.render('index/editProfile');
});

router.get('/:username',function(req,res){
    db.User.find({username: req.params.username},function(err,user){
        if(err || user.length==0){
            req.flash('error','User profile cannot be found, please try again later!');
            return res.redirect('/');
        }
        var same = false;
        if(req.user){
            if(req.user._id.equals(user[0]._id)){
                same = true;
            }
        }
        var theUser = user[0];
        theUser.same = same;
        res.render('index/profile',{userProfile:theUser});
    });
});


router.put('/',middleware.isLoggedIn,function(req,res){
    db.User.findByIdAndUpdate(req.user._id,{...req.body},function(err,user){
        if(err || user.length < 0){
            req.flash('error','Cannot update profile, please try again later!');
            return res.redirect('/profile');
        }
        req.flash('success','Profile updated successfuly !');
        res.redirect('/profile');
    });
});

module.exports = router;