const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

router.post('/:idO/comment',middleware.isLoggedIn,function(req,res){
    db.Comment.create({
        ...req.body,
        author:{
            id: req.user._id,
            username: req.user.username,
            fors: req.user.fors
        }},function(err,comment){
            if(err){
                req.flash('error','Comment not created, please try again later!');
                return res.redirect('/opportunities/'+req.params.idO);
            }

            db.Opportunity.findById(req.params.idO,function(err,opportunity){
                if(err || !opportunity){
                    req.flash('error','Opportunity could not be found, please try again later!');
                    return res.redirect('/opportunities/'+req.params.idO);
                };

                opportunity.comments.push(comment._id);
                opportunity.save();
                req.flash('success','Comment created successfuly !');
                res.redirect('/opportunities/'+req.params.idO);
            });
        });
});

router.get('/:idO/comment/:idC/edit',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findById(req.params.idC,function(err, comment){
        if(err || !comment){
            req.flash('error','Comment cannot be found, please try again later!');
            return res.redirect('/opportunities/'+req.params.idO);
        }
        res.render('comment/showCommentOpp',{comment: comment, opportunityId: req.params.idO});
    });
});

router.put('/:idO/comment/:idC',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findByIdAndUpdate(req.params.idC,{...req.body},function(err,comment){
        if(err || !comment){
            req.flash('error','Comment could not be updated, please try again later!');
            return res.redirect('/opportunities/'+req.params.id0);
        }
        req.flash('success','Comment updated successfuly !');
        res.redirect('/opportunities/'+req.params.idO);
    });
});

router.delete('/:idO/comment/:idC',middleware.isLoggedIn,middleware.ensureCorrectUserComment,function(req,res){
    db.Comment.findByIdAndRemove(req.params.idC,function(err,comment){
        if(err || !comment){
            req.flash('error','Comment could not be deleted, please try again later!');
            return res.redirect('/opportunities/'+req.params.idO);
        }
        req.flash('success','Comment deleted successfuly !');
        res.redirect('/opportunities/'+req.params.idO);
    });
});

module.exports = router;
