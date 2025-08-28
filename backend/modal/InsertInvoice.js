const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: { type: String, required: true },
  hsn: { type: String, required: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxable: { type: Number, required: true },
  igst: { type: Number, required: true },
  total: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  state: { type: String, required: true },
  dateOfSupply: { type: Date, required: true },
  placeOfSupply: { type: String, required: true },
  driverName: { type: String },
  vehicleNumber: { type: String },
  // transportMode: { type: String, default: "By Road" },

  buyerName: { type: String, required: true },
  buyerAddress: { type: String, required: true },
  buyerPhone: { type: String },
  buyerEmail: { type: String },
  buyerGSTIN: { type: String },
  buyerCountry: { type: String, default: "India" },

  products: [productSchema],

  totalAmount: { type: Number, required: true },
  amountInWords: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
