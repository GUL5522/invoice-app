const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: { type: String, required: true, uppercase: true, trim: true },
  hsn: { type: String, required: true, uppercase: true, trim: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxable: { type: Number, required: true },
  igst: { type: Number, required: true },
  total: { type: Number, required: true },
  description: { type: String, uppercase: true, trim: true },
  descOption: { type: String, uppercase: true, trim: true }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  invoiceDate: { type: Date, required: true },
  state: { type: String, required: true, uppercase: true, trim: true },
  dateOfSupply: { type: Date, required: true },

  placeOfSupply: { type: String, required: true, uppercase: true, trim: true },

  driverName: { type: String, uppercase: true, trim: true },
  vehicleNumber: { type: String, uppercase: true, trim: true },
  transportMode: { type: String, default: "By Road", uppercase: true },

  buyerName: { type: String, required: true, uppercase: true, trim: true },
  buyerAddress: { type: String, required: true, uppercase: true, trim: true },
  buyerEximCode: { type: String, required: true, uppercase: true, trim: true },
  buyerPhone: { type: String },
  buyerEmail: { type: String, lowercase: true, trim: true },
  buyerPAN: { type: String, required: true, uppercase: true, trim: true },
  buyerCountry: { type: String, default: "NEPAL", uppercase: true },

  products: [productSchema],

  totalAmount: { type: Number, required: true },
  amountInWords: { type: String, required: true, uppercase: true, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);