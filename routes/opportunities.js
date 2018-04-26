const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

//show opportunities

router.get('/',function(req,res){
    db.Opportunity.find({}).sort({votes: 'desc'}).exec(function(err,opportunities){
        if(err){
            req.flash('error','Cannot get opportunities, please try again later!');
            return res.redirect('/');
        }
        res.render('opportunity/showOpportunities',{opportunities});
    });
});

//new opportunity

router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render("opportunity/newOpportunity");
})

//show opportunity

router.get('/:id',function(req,res){

    db.Opportunity.findById(req.params.id).populate('comments').exec(function(err,opportunity){
        if(err || !opportunity){
            req.flash('error','Opportunity cannot be found, please try again later!');
            return res.redirect('/opportunities/');
        }
        res.render('opportunity/showOpportunity',{opportunity});
    });
});

router.post('/',middleware.isLoggedIn,function(req,res){
    db.Opportunity.create({
        author:{
            id: req.user._id,
            username: req.user.username,
            fors: req.user.fors
        },
        title: req.body.title,
        oppType : req.body.oppType.toLowerCase(),
        description: req.body.description,
        location : req.body.location,
        requirement: req.body.requirement}, function(err,opportunity){
            if(err || !opportunity){
                req.flash('error','Opportunity cannot be created, please try again later!');
                return res.redirect('/opportunities/');
            };
            req.flash('success','Opportunity successfuly created!');
            res.redirect('/opportunities/');
        });

});

// Edit Opportunity
router.get('/:id/edit',middleware.isLoggedIn,middleware.ensureCorrectOpportunity,function(req,res){
    db.Opportunity.findById(req.params.id,function(err,opportunity){
        if(err || !opportunity){
            req.flash('error',"Opportunity cannot be found, please try again later");
            return res.redirect('/opportunities');
        }
        res.render('opportunity/editOpportunity',{opportunity});
    })
});

router.put('/:id',middleware.isLoggedIn,middleware.ensureCorrectOpportunity,function(req,res){
    db.Opportunity.findByIdAndUpdate(req.params.id,{
        author:{
            id: req.user._id,
            username: req.user.username,
            fors: req.user.fors
        },
        title: req.body.title,
        oppType : req.body.oppType.toLowerCase(),
        description: req.body.description,
        location : req.body.location,
        requirement: req.body.requirement},function(err,opportunity){
        if(err || !opportunity){
            req.flash('error',"Opportunity cannot be edited, try again later!");
            return res.redirect('/opportunities/'+req.params.id);
        }
        req.flash('success','Opportunity successfuly updated !');
        res.redirect('/opportunities/'+req.params.id);
    });
});

//Delete Opportunity

router.delete('/:id',middleware.isLoggedIn,middleware.ensureCorrectOpportunity,function(req,res){
    db.Opportunity.findByIdAndRemove(req.params.id,function(err,opportunity){
        if(err || !opportunity){
            req.flash('error','Opportunity cannot be deleted');
        }
        else{
            req.flash('success','Opportunity successfuly edited !');
        }
        res.redirect('/opportunities');
    });
})

//Get by category

router.get('/type/:oppType',function(req,res){
    db.Opportunity.find({oppType: req.params.oppType}).sort({votes:'desc'}).exec(function(err,opportunities){
        if(err || opportunities.length < 0){
            req.flash('error','Cannot get opportunities of specified category');
            return res.redirect('/opportunities');
        }
        res.render('opportunity/showOpportunities',{opportunities})
    });
});

//Upvote

router.put('/:id/upvote',middleware.isLoggedIn,function(req,res){

    db.Opportunity.findById(req.params.id,function(err,opportunity){
        if(err || !opportunity){
            req.flash('error','Cannot find opportunity, try again later!');
            return res.redirect('/opportunities/'+req.params.id)
        }
        let bool = true;
        opportunity.voters.forEach((voter) => {
            if(voter.equals(req.user._id))
                bool=false;
        })
        if(bool){
            opportunity.votes = opportunity.votes + 1;
            opportunity.voters.push(req.user._id);
            opportunity.save();
        }
        res.redirect('/opportunities/'+req.params.id);
    });
});

module.exports = router;