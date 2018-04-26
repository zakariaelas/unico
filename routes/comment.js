const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

router.post('/:idB/comment',middleware.isLoggedIn,function(req,res){
    db.Comment.create({
        ...req.body,
        author:{
            id: req.user._id,
            username: req.user.username,
            fors: req.user.fors
        }},function(err,comment){
            if(err){
                req.flash('error','Cannot create comment, please try again later!');
                return res.redirect('/blogs/'+req.params.idB);
            }
            db.Blog.findById(req.params.idB,function(err,blog){
                if(err){
                    req.flash('error','Cannot find blog, please try again later!');
                }
                blog.comments.push(comment._id);
                blog.save();
                req.flash('success',"Comment successfuly added!");
                res.redirect('/blogs/'+req.params.idB);
            });
        });
});

router.get('/:idB/comment/:idC/edit',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findById(req.params.idC,function(err, comment){
        if(err){
            req.flash('error','Cannot get comment edit page, please try again later!');
            return res.redirect('/blogs/'+req.params.idB);
        }
        res.render('comment/edit',{comment: comment, blogId: req.params.idB});
    });
});

router.put('/:idB/comment/:idC',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findByIdAndUpdate(req.params.idC,{...req.body},function(err,comment){
        if(err){
            req.flash('error','Cannot update comment, please try again later');
            return res.redirect('/blogs/'+req.params.idB);
        }
        req.flash('success',"Comment successfuly edited!");
        res.redirect('/blogs/'+req.params.idB);
    });
});

router.delete('/:idB/comment/:idC',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findByIdAndRemove(req.params.idC,function(err,comment){
        if(err){
            req.flash('error','Cannot delete comment, please try again later!');
            return res.redirect('/blogs/'+req.params.idB);
        }
        req.flash('success',"Comment successfuly deleted!");
        res.redirect('/blogs/'+req.params.idB);
    });
});

module.exports = router;
