const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchma = new Schema({
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
      
      }
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  }, {
    timestamps: true
  })

module.exports = mongoose.model('orders',orderSchma)