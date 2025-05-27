const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Modelo Course: representa un curso creado por un profesor.


const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  level: String,
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
