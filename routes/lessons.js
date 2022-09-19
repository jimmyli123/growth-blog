const express = require('express')
const router = express.Router()
const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");

const { ensureAuth} = require('../middleware/auth')
const { cloudinary_js_config } = require('../middleware/cloudinary')

const Lesson = require('../models/Lesson')

// @desc    Show all lessons
// @route   GET /lessons
router.get('/', ensureAuth, async (req,res) => {
    
    try {
        const lessons = await Lesson.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean()
        res.render('lessons/publicLessons', {lessons})
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})


// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('lessons/add')
})


// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, upload.single("file"), async (req, res) => {
    try{
        const imageResult = await cloudinary.uploader.upload(req.file.path);
            await Lesson.create({
                title: req.body.title,
                lesson: req.body.body,
                user: req.user.id,
                cloudinaryId: imageResult.public_id,
                image: imageResult.secure_url,
                status: req.body.status
            })
            res.redirect('/dashboard')
        }
    catch(err) { 
        console.log(err)
        res.render('error/401')
    }
})


// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let lesson = await Lesson.findById({_id: req.params.id})
        .populate('user')
        .lean()

        if (!lesson) {
            return res.render('error/404')
        }
        res.render('lessons/showOneLesson', {
            lesson,
        })

    } catch (error) {
        console.log(error)
        res.render('error/404')
    }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const lesson = await Lesson.findOne({
            _id: req.params.id
        }).lean()
    
        if(!lesson) {
            return res.render('error/401')
        }
    
        if (lesson.user != req.user.id) {
            res.redirect('/lessons')
        } else {
            res.render('lessons/edit', {
                lesson,
            })
        }
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
    
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id).lean()
    if (!lesson) {
        return res.render('error/404')
    }
    if (lesson.user != req.user.id) {
        res.redirect('/lessons')
    } else {
        lesson = await Lesson.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        })
        res.redirect('/dashboard')
    }
    }catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Lesson.remove({_id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})

// @desc    Get User Stories
// @route   GET /stories/user/:id
router.get('/user/:id', ensureAuth, async (req, res) => {
    try {
        const lessons = await Lesson.find({
            user: req.params.id,
            status: 'public'
        })
        .populate('user')
        .lean()
        
        if (!lessons) {
            return res.render('error/404')
        }
        else {
            res.render('lessons/userLessons', {
            lessons,
        })
    }
    } catch (error) {
        console.log(error)
        res.render('error/404')
    }
})


module.exports = router