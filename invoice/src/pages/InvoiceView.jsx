import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import mp from '../assets/mp.jpg';
import './InvoiceView.css';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`);
      const data = await response.json();

      if (data.success) {
        setInvoice(data.invoice);
      } else {
        setError(data.message || 'Failed to fetch invoice');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const numberToWords = (n) => {
    if (isNaN(n) || n < 0) return "Please enter a valid number";
    if (n === 0) return "Zero Rupees Only";

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const places = ["", "Thousand", "Lakh", "Crore"];

    const convertBelowThousand = (num) => {
      let word = "";
      if (num >= 100) {
        word += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }
      if (num >= 11 && num <= 19) {
        word += teens[num - 11] + " ";
      } else {
        word += tens[Math.floor(num / 10)] + " ";
        word += ones[num % 10] + " ";
      }
      return word.trim();
    };

    let integerPart = Math.floor(n);
    let word = "";
    let numParts = [];

    numParts.push(integerPart % 1000);
    integerPart = Math.floor(integerPart / 1000);
    numParts.push(integerPart % 100);
    integerPart = Math.floor(integerPart / 100);
    numParts.push(integerPart % 100);
    integerPart = Math.floor(integerPart / 100);
    numParts.push(integerPart);

    for (let j = numParts.length - 1; j >= 0; j--) {
      if (numParts[j] !== 0) {
        word += convertBelowThousand(numParts[j]) + " " + places[j] + " ";
      }
    }

    return word.trim() + " Rupees Only /-";
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="invoice-view-container">
        <h2>Loading invoice...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-view-container">
        <h2>Error: {error}</h2>
        <Link to="/invoices" className="back-btn">Back to Invoices</Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-view-container">
        <h2>Invoice not found</h2>
        <Link to="/invoices" className="back-btn">Back to Invoices</Link>
      </div>
    );
  }

  return (
    <div className="invoice-view-container">
      <div className="invoice-actions">
        <Link to="/invoices" className="back-btn">← Back to Invoices</Link>
        <button onClick={handlePrint} className="print-btn">Print Invoice</button>
      </div>

      <div className="invoice-container" style={{ marginTop: '0px' }}>
        <header className="invoice-header">
          <img className="img" src={mp} alt="image" />
          <div className="invoice-info">
            <h1 style={{ fontSize: 50 }}>M.P. ENTERPRISES</h1>
            <p>MAIN ROAD RAXAUL, EAST CHAMPARAN, BIHAR 845305</p>
            <p>CONTACT: +91 8235826679  |  madan.prasad92814@gmail.com</p>
            <p>AD CODE-0000138-0620007  |  IEC CODE-2192001355</p>
            <p>GSTIN/UIN: 10AINPP0877F1ZA | PAN: AINP0877F</p>
            <p>State Code: 10</p>
          </div>
        </header>

        <div className="invoice-form">
          <h3 className="tax">TAX INVOICE</h3>

          <div className="cols-3">
            <div className="form-elem">
              <label className="form-label">Invoice Number</label>
              <input type="text" className="form-control invoice-number" value={invoice.invoiceNumber} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Invoice Date</label>
              <input type="text" className="form-control" value={formatDate(invoice.invoiceDate)} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">State</label>
              <input type="text" className="form-control" value={invoice.state} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Date of Supply</label>
              <input type="text" className="form-control firstname" value={formatDate(invoice.dateOfSupply)} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Place Of Supply</label>
              <input type="text" className="form-control middlename" value={invoice.placeOfSupply} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Driver's Name</label>
              <input type="text" className="form-control lastname" value={invoice.driverName || ''} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Vehicle Number</label>
              <input type="text" className="form-control firstname" value={invoice.vehicleNumber || ''} readOnly />
            </div>

            <div className="form-elem">
              <label className="form-label">Transport Mode</label>
              <input type="text" className="form-control middlename" value="By Road" readOnly />
            </div>
          </div>

          <h3 className="buyer">Buyer's Name & Address</h3>
          <div className="cols-3">
            <div className="form-elem">
              <label className="form-label">Name</label>
              <input type="text" className="form-control designation" value={invoice.buyerName} readOnly />
            </div>
            <div className="form-elem">
              <label className="form-label">Address</label>
              <input type="text" className="form-control address" value={invoice.buyerAddress} readOnly />
            </div>
            <div className="form-elem">
              <label className="form-label">EXIM CODE</label>
              <input type="text" className="form-control" value={invoice.buyerEximCode || ''} readOnly />
            </div>
          </div>

          <div className="cols-3">
            <div className="form-elem">
              <label className="form-label">Phone No:</label>
              <input type="text" className="form-control phoneno" value={invoice.buyerPhone || ''} readOnly />
            </div>
            <div className="form-elem">
              <label className="form-label">Email</label>
              <input type="email" className="form-control email" value={invoice.buyerEmail || ''} readOnly />
            </div>
            <div className="form-elem">
              <label className="form-label">PAN</label>
              <input type="text" className="form-control summary" value={invoice.buyerPAN || ''} readOnly />
            </div>
            <div className="form-elem">
              <label className="form-label">Country</label>
              <input type="text" className="form-control summary" value={invoice.buyerCountry} readOnly />
            </div>
          </div>

          <table id="dynamicTable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>HSN</th>
                <th>QTY</th>
                <th>Rate</th>
                <th>Value</th>
                <th>IGST (5%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((product, index) => (
                <tr key={index}>
                  <td><input type="text" value={product.product} readOnly /></td>
                  <td><input type="text" value={product.hsn} readOnly /></td>
                  <td><input type="number" value={product.qty} readOnly /></td>
                  <td><input type="number" value={product.rate} readOnly /></td>
                  <td><input type="number" value={product.taxable.toFixed(2)} readOnly /></td>
                  <td><input type="number" value={product.igst.toFixed(2)} readOnly /></td>
                  <td><input type="number" value={product.total.toFixed(2)} readOnly /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bill">
            <div className="bank-info">
              <p style={{ color: 'blue' }}>Bank & Payment Details</p>
              <p><b>A/C Holder:</b> M.P. Enterprises</p>
              <p><b>A/C No:</b> 10973176188</p>
              <p><b>IFSC Code:</b> SBIN0002998</p>
              <p><b>Bank:</b> State Bank of India, Raxaul</p>
            </div>
            <div className="word">
              <input type="number" className="total" readOnly value={invoice.totalAmount.toFixed(2)} style={{ textAlign: 'right' }} />
              <p className="total-in-word">Total Invoice Amount in Words</p>
              <p className="total-in-words">{invoice.amountInWords}</p>
            </div>
          </div>

          <footer className="print-footer">M.P. ENTERPRISES</footer>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
