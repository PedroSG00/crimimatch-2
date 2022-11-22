const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const New = require('../models/New.model')
const Comment = require('../models/Comment.model')
const { loggedIn, loggedOut, checkRoles } = require('../middleware/route-guard')


router.post('/:id', (req, res, next) => {

    const { id: news_Id } = req.params
    const { text } = req.body
    // const { comments } = req.body

    Comment
        .create({ author: req.session.currentUser._id, text })

        .then((newComment) => {
            return New.findByIdAndUpdate(news_Id, { $push: { comments: newComment._id } })
        })
        .then(res.redirect(`/news/${news_Id}`))
        .catch(err => console.log(err))
})

router.post('/:news_Id/:comment_Id/delete-comment', (req, res, next) => {


    const { news_Id, comment_Id } = req.params
    // console.log('----------------------', newsId)

    Comment
        .findByIdAndDelete(comment_Id)
        .then((deletedComment) => {
            // console.log('---------------------------------', deletedComment, '----------------------------------')
            return New.findByIdAndUpdate(news_Id, { $pull: { comments: deletedComment._id } })
        })
        .then(res.redirect(`/news/${news_Id}`))
        .catch(err => console.log(err))

})


// router.get()

module.exports = router;


