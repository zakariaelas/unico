const express = require('express');
const router = express.Router();
const db = require('../models/index');
const todosRoutes = require('./todos');
const notesRoutes = require('./notes');
const middleware = require('../middleware/index');

router.get('/',middleware.isLoggedIn,function(req,res){
    res.render("mybackpack/index");
});

router.use('/todos',todosRoutes);
router.use('/notes',notesRoutes);

module.exports = router;