const express = require('express')
const router = express.Router()

const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Lesson = require('../models/Lesson')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'loginLayout'
    })
})

// @desc dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        console.log('This is dashboard')
        const lessons = await Lesson.find({user: req.user.id}).lean()
        res.render("dashboard", {
            lessons,
            name: req.user.firstName
        })
    } catch (error) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router