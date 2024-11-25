const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String },
  brand: { type: String },
  mileage: { type: Number },
  color: { type: String },
  oil: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  rating: { type: Number, required: true },
  numReview: { type: Number, required: true },
  yearOfMake: { type: String },
  image: { type: [String], required: true },
});

module.exports = mongoose.model("Product", productSchema);
