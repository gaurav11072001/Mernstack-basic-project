const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      itemType: {
        type: String,
        required: true,
        enum: ['product', 'food']
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      imageUrl: {
        type: String
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate total price
  this.totalPrice = this.items.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
  
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
