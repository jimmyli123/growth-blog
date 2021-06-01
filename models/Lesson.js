const mongoose = require('mongoose')

const LessonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        require: true
    },
    lesson: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cloudinaryId: {
        type: String,
        require: false
    },
    image: {
        type: String,
        require: true,
      },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },

})

module.exports = mongoose.model('Lesson', LessonSchema)