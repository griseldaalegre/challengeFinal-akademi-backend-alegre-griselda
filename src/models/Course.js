const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['web', 'cyber'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: true
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Course', courseSchema);
