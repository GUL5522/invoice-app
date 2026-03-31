const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: { type: String, required: true, uppercase: true, trim: true },
  hsn: { type: String, required: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxable: { type: Number, required: true },
  gst: { type: Number, required: true }, // Changed from igst for Nepal 5% GST
  total: { type: Number, required: true },
  description: { type: String, uppercase: true, trim: true },
  descOption: { type: String, uppercase: true, trim: true }
});

const nepalInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  invoiceDate: { type: Date, required: true },
  
  buyerName: { type: String, required: true, uppercase: true, trim: true },
  buyerAddress: { type: String, required: true, uppercase: true, trim: true },
  buyerEximCode: { type: String, required: true, uppercase: true, trim: true },
  buyerPhone: { type: String, uppercase: true, trim: true },
  buyerPAN: { type: String, required: true, uppercase: true, trim: true },
  buyerEmail: { type: String, lowercase: true, trim: true },

  driverName: { type: String, uppercase: true, trim: true },
  vehicleNumber: { type: String, uppercase: true, trim: true },
  indianCustomPoint: { type: String, uppercase: true, trim: true },
  modeTermsOfPayment: { type: String, uppercase: true, trim: true },
  countryOfOrigin: { type: String, uppercase: true, trim: true },
  customEntryPoint: { type: String, uppercase: true, trim: true },
  dispatchThrough: { type: String, uppercase: true, trim: true },
  destination: { type: String, uppercase: true, trim: true },
  termsDelivery: { type: String, uppercase: true, trim: true, default: "FOB RAXAUL" },

  products: [productSchema],

  totalAmount: { type: Number, required: true },
  amountInWords: { type: String, required: true, uppercase: true, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('NepalInvoice', nepalInvoiceSchema);
