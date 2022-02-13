const session = require('express-session')
const con = require('../njdb/db/connector')
const truncate = require('truncate');

// admin edit blog post
exports.edit = (req, res) => {
   
        con.query(
            'SELECT * FROM post WHERE postid = ?',
            [req.params.id],
            (error, results) => {
                res.render('./admin/editpost', {post: results[0], verified: req.session.loggedin,layout:'./layout/dashboard'});
            }
        );
    }


// Update method for /edit page
exports.update = (req, res) => {
    if (req.session.loggedin) {
        con.query(
            'UPDATE post SET topicid =?, title = ?, content = ?, file_src = ? WHERE id = ?',
            [req.body.topicid,req.body.title, req.body.content, req.params.id],
            (error, results) => {
                res.redirect('/admin');
            }
        );
    }
}
