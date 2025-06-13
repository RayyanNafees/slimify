import mongoose from 'mongoose'

const weightSchema =new mongoose.Schema({
  amount: Number,
  unit: {type: String, default: 'kg'},
}, {timestamps: true})

export const Weights = mongoose.model('weights', weightSchema)