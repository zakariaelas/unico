const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

//READ ALL BLOGS
router.get('/',function(req,res){
    db.Blog.find({}).sort({votes:'desc'}).exec(function(err,blogs){
        if(err){
            req.flash('error',"Something happened... Please try again later !");
        }
        res.render('blog/blogs',{blogs});
    });
});

//POST NEW BLOG
router.post('/',middleware.isLoggedIn,function(req,res){
    db.Blog.create({
    title: req.body.title,
    text: req.body.text,
    image: req.body.image,
    category: req.body.category.toLowerCase(),
    author:{
        id: req.user._id,
        username: req.user.username,
        fors: req.user.fors
    }},function(err,blog){
        if(err){
            req.flash('error','Blog cannot be created, please try again later!');
        }
        else{
            req.flash('success','Blog successfully created !');
        }
        res.redirect('/blogs');
    });
});


// SHOW BLOG FORM
router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render('blog/blogsNew');
});

//GET BY CATEGORY
router.get('/category/:cat',function(req,res){
    db.Blog.find({category: req.params.cat}).sort({votes:'descending'}).exec(function(err,data){
        if(err){
            req.flash('error','Cannot get blogs, please try again later!');
            return res.redirect('/blogs/');
        }
        res.render('blog/blogs',{blogs:data});
    }); 
})

//READ SPECIFIC BLOG
router.get('/:id',function(req,res){
    db.Blog.findById(req.params.id).populate('comments').exec(function(err,blog){
        if(err || !blog){
            req.flash('error','Blog cannot be found, please try again!');
            return res.redirect('/blogs/');
        }
        res.render('blog/blogShow',{blog});
    });
})

//SHOW EDIT PAGE

router.get('/:id/edit',middleware.isLoggedIn,middleware.ensureCorrectUserBlog,function(req,res){
    db.Blog.findById(req.params.id,function(err,blog){
        if(err || !blog){
            req.flash('error','Cannot get edit page, please try again later!');
            return res.redirect('/blogs/'+req.params.id);
        }
        res.render('blog/blogEdit',{blog});
    });
});

//EDIT BLOG
router.put('/:id',middleware.isLoggedIn,middleware.ensureCorrectUserBlog,function(req,res){
    db.Blog.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        text:req.body.text,
        category:req.body.category.toLowerCase(),
        image: req.body.image
    },function(err,blog){
        if(err || !blog){
            req.flash('error','Cannot update blog, please try again later!');
        }
        else{
            req.flash('success','Blog successfully updated !');
        }
        res.redirect('/blogs/'+req.params.id);
    });
})

//DELETE BLOG

router.delete('/:id',middleware.isLoggedIn,middleware.ensureCorrectUserBlog,function(req,res){
    db.Blog.findByIdAndRemove(req.params.id,function(err,blog){
        if(err || !blog){
            req.flash('error','Blog could not be deleted, please try again later!');
        }
        else{
            req.flash('success','Blog successfully deleted !');

        }
        res.redirect('/blogs');
    })
});

//Upvote
router.put('/:id/upvote',function(req,res){
    db.Blog.findById(req.params.id,function(err,blog){
        if(err || !blog){
            req.flash('error','Blog could not get upvoted, please try again later!');
            return res.redirect('/blogs/'+req.params.id);
        }

        let bool = true;
        blog.voters.forEach((voter) =>{
            if(voter.equals(req.user._id))
                bool=false;
        });

        if(bool){
            blog.votes = blog.votes + 1;
            blog.voters.push(req.user._id);
            blog.save();
        }
        res.redirect('/blogs/'+req.params.id);
    });
});

// //Downvote
// router.put('/:id/downvote',function(req,res){
//     db.Blog.findById(req.params.id,function(err,blog){
//         if(err) throw err;

//         let bool = true;
//         blog.voters.forEach((voter) =>{
//             if(voter.equals(req.user._id))
//                 bool=false;
//         });

//         if(bool){
//             blog.votes = blog.votes - 1;
//             blog.voters.push(req.user._id);
//             blog.save();
//         }
//         res.redirect('/blogs/'+req.params.id);
//     });
// });


module.exports = router;