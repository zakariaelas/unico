const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

router.get('/',middleware.isLoggedIn,function(req,res){
    res.render('mybackpack/notes');
});

router.get('/notes',middleware.isLoggedIn,function(req,res){
    db.User.findById(req.user._id).populate('notes').exec(function(err,user){
        if(err) throw err;

        res.json(user.notes);
    });
});

router.post('/',middleware.isLoggedIn,function(req,res){
    db.User.findById(req.user._id,function(err,user){
        if(err) throw err;

        db.Note.create(req.body,function(err,note){
            if(err) throw err;

            user.notes.push(note._id);
            user.save();
            res.status(201);
            res.json(note);
        })
    })
});

router.put('/:id',middleware.isLoggedIn,function(req,res){
    db.User.findById(req.user._id,function(err,user){
        if(err) throw err;

        db.Note.findByIdAndUpdate(req.params.id,req.body,function(err,note){
            if(err) throw err;

            res.status(204);
            res.send();
        });
    })
});

router.delete('/:id',middleware.isLoggedIn,function(req,res){
    // db.Note.findByIdAndRemove(req.params.id,function(err,note){
    //     if(err) throw err;

    //     db.User.findById(req.user._id,function(err,user){
    //         if(err) throw err;
    
    //         let index = user.notes.findIndex((noteElement) => {
    //             return noteElement.equals(note._id);
    //         });
    
    //         user.notes.splice(index,1);
    
    //         user.save();
    //     })
    
    //     res.status(204);
    //     res.send();
    // })
    db.Note.findByIdAndRemove(req.params.id,function(err,note){
        if(err) throw err;

        db.User.findByIdAndUpdate(req.user._id,{$pull : {notes: req.params.id}},function(err,user){
            if(err){
                throw err;
            }
            res.status(204);
            res.send();
        });
    });
});

module.exports = router;