const express = require('express')
const router = express.Router();

// the indexController
const indexController = require('../controllers/index')
/*
// indexing methods
router.get('/', indexController.index);


// login and register methods
router.get('/login', indexController.login);
*/
// administration pages
// Edit page
router.get('/edit/:id', indexController.edit);
router.post('/updatee/:id', indexController.update);
/*
// Delete
router.get('/delete/:id' , indexController.delete);


router.get('/new', indexController.new_get);

router.post('/new', indexController.new_post);

router.get('/post/:id', indexController.post);
*/
module.exports = router
