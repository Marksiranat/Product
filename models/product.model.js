const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchma = new Schema({
    nameproduct: { type: String },
    unit: { type: Number },
    price: { type: Number },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    orderIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'orders'
      }
    ]
  }, {
    timestamps: true
  })


module.exports = mongoose.model('products',productSchma)
