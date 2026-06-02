const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: { type: String, required: true, uppercase: true, trim: true },
  hsn: { type: String, required: true, uppercase: true, trim: true },
  qty: { type: Number, required: true, default: 0 },
  rate: { type: Number, required: true, default: 0 },
  taxable: { type: Number, required: true, default: 0 },
  igst: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  description: { type: String, uppercase: true, trim: true },
  descOption: { type: String, uppercase: true, trim: true }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  invoiceDate: { type: Date, required: true },
  dispatchThrough: { type: String, uppercase: true, trim: true },
  destination: { type: String, uppercase: true, trim: true },
  transport: { type: String, uppercase: true, trim: true },
  countryName: { type: String, uppercase: true, trim: true },
  termsDelivery: { type: String, uppercase: true, trim: true },
  driverName: { type: String, uppercase: true, trim: true },
  vehicleNumber: { type: String, uppercase: true, trim: true },
  transportMode: { type: String, default: "By Road", uppercase: true },

  buyerName: {
  type: String,
  required: true,
  trim: true,
  set: (value) =>
    value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
},
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