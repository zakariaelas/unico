var db = require('../models/index');

module.exports.showAuthPages = function(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

module.exports.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
            req.session.redirectTo = null;
            return next();
        }
        req.flash('error','Please log in first !');
        if(req.method==="GET")
            req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }

    
module.exports.ensureCorrectUserBlog = function (req,res,next){
    db.Blog.findById(req.params.id,function(err,blog){
        if(err || !blog){
            req.flash('error','Blog cannot be found, try again later!');
            return res.redirect('/blogs/');
        }

        if(blog.author.id.equals(req.user._id)){
            next();
        }
        else{
            console.log('about to redirect');
            res.redirect('back');
        }

    })
}

module.exports.ensureCorrectOpportunity = function (req,res,next){
    db.Opportunity.findById(req.params.id,function(err,opportunity){
        if(err || !opportunity){
            req.flash('error','Opportunity cannot be found, please try again later');
            return res.redirect('/opportunities/')
        }

        if(opportunity.author.id.equals(req.user._id)){
            next();
        }
        else{
            res.redirect('back');
        }
        
    });
}

// module.exports.ensureCorrectUserVideoconference = function (req,res,next){
//     db.Videoconference.findById(req.params.id,function(err,videoconference){
//         if(err) throw err;

//         if(videoconference.author.id.equals(req.user._id)){
//             next();
//         }
//         else{
//             res.redirect('back');
//         }
        
//     })
// }

module.exports.ensureCorrectUserComment = function (req,res,next){
    db.Comment.findById(req.params.idC,function(err,comment){
        if(err || !comment){
            req.flash('error','Comment cannot be found, please try again later!');
            return res.redirect('/');
        }

        if(comment.author.id.equals(req.user._id)){
            next();
        }
        else{
            res.redirect('back');
        }
        
    })
}
