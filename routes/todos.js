const express = require('express');
const router = express.Router();
const db = require('../models/index');
const middleware = require('../middleware/index');

router.get('/',middleware.isLoggedIn,function(req,res){
    console.log('here');
    res.render('mybackpack/todos');
})

router.get('/todos',middleware.isLoggedIn,function(req,res){
    db.User.findById(req.user._id).populate("todos").exec(function(err,user){
        if(err) throw err;

        console.log("Console.log : ");
        console.log(user.todos);
        res.json(user.todos);
    })
});

router.post('/todo',middleware.isLoggedIn,function(req,res){
    db.Todo.create(req.body,function(err,todo){
        db.User.findById(req.user._id,function(err,user){
            if(err) throw err;

            user.todos.push(todo);
            user.save();
            res.status(201);
            res.json(todo);
        });
    })
});

router.put('/todo/:id',middleware.isLoggedIn,function(req,res){
    db.Todo.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err,todo){
        if(err) throw err;

        // db.User.findById(req.user._id,function(err,user){
        //     if(err) throw err;
            
        //     console.log("this is a console.log ");
        //     console.log(user.todos);
        //     user.todos = user.todos.map(function(nestedTodo){
        //         if(nestedTodo.equals(todo._id)){
        //             return todo;
        //         }
        //         return nestedTodo;
        //     });
        //     user.save();
        //     res.status(204);
        //     res.send();
        // });
        res.status(204);
        res.send();
    })
});

router.delete('/todo/:id',middleware.isLoggedIn,function(req,res){
    
    // db.Todo.findByIdAndRemove(req.params.id,function(err,todo){
    //     if(err) throw err;

    //     db.User.findById(req.user._id,function(err,user){
    //         if(err) throw err;

    //         let index = user.todos.findIndex((todoElement) => {
    //             return todoElement.equals(todo._id);
    //         });

    //         user.todos.splice(index,1);

    //         user.save();
    //     })

    //     res.status(204);
    //     res.send();
    // })
    db.Todo.findByIdAndRemove(req.params.id,function(err,todo){
        if(err) throw err;

        db.User.findByIdAndUpdate(req.user._id,{$pull : {todos: req.params.id}},function(err,user){
            if(err){
                throw err;
            }
            res.status(204);
            res.send();
        });
    });
});

module.exports = router;