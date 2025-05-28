const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  feedback: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);
