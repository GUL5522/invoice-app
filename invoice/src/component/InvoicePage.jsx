import React, { useEffect, useState } from 'react';
import mp from '../assets/mp.jpg';
import './main.css';

const generateInvoiceNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MP/${year}/${randomNum}`;
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



const InvoicePage = () => {
  const [rows, setRows] = useState([{
    product: '', hsn: '', qty: 0, rate: 0, taxable: 0, igst: 0, total: 0
  }]);
  const [invoiceNumber] = useState(generateInvoiceNumber());
  const [totalSum, setTotalSum] = useState(0);
  const [totalWords, setTotalWords] = useState('');
  
  const addRow = () => {
    if (rows.length < 3) {
      setRows([...rows, {
        product: '', hsn: '', qty: '', rate: '', taxable: 0, igst: 0, total: 0
      }]);
    }
  };

  const removeRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const qty = parseFloat(updatedRows[index].qty) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;
    const taxable = qty * rate;
    const igst = taxable * 0.05;
    const total = taxable + igst;

    updatedRows[index].taxable = taxable;
    updatedRows[index].igst = igst;
    updatedRows[index].total = total;
    
    setRows(updatedRows);
  };
  
  useEffect(() => {
    const sum = rows.reduce((acc, row) => acc + row.total, 0);
    setTotalSum(sum);
    setTotalWords(numberToWords(Math.round(sum)));
  }, [rows]);

  const printInvoice = () => {
    window.print();
  };
  
  // inset data 
  const saveInvoiceToDB = async () => {
    window.print();
    const invoiceData = {
      invoiceNumber,
      invoiceDate: document.querySelectorAll('input[type="date"]')[0].value,
      state: document.querySelector('input[placeholder="Bihar"]').value,
      dateOfSupply: document.querySelectorAll('input[type="date"]')[1].value,
      placeOfSupply: document.querySelector('input[placeholder="Abc"]').value,
      driverName: document.querySelector('input[placeholder="Xyz"]').value,
      vehicleNumber: document.querySelector('input[placeholder="BR05GB4421"]').value,
      // transportMode: document.querySelector('input[defaultValue="By Road"]').value, // optional if you uncomment it in schema
    
      // flattened buyer fields:
      buyerName: document.querySelector('input[placeholder="Nawal Enterprises"]').value,
      buyerAddress: document.querySelector('input[placeholder="e.g. Lake Street-23"]').value,
      buyerPhone: document.querySelector('input[placeholder="e.g. +91977680798"]').value,
      buyerEmail: document.querySelector('input[type="email"]').value,
      buyerGSTIN: document.querySelectorAll('input[class="form-control summary"]')[0].value,
      buyerCountry: document.querySelectorAll('input[class="form-control summary"]')[1].value,
    
      products: rows.map(row => ({
        product: row.product,
        hsn: row.hsn,
        qty: row.qty,
        rate: row.rate,
        taxable: row.taxable,
        igst: row.igst,
        total: row.total,
      })),
    
      totalAmount: totalSum,
      amountInWords: totalWords
    };
    
    try {
      const res = await fetch('http://localhost:5500/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        // Optional: window.print();
        alert('Invoice saved successfully!');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Failed to connect to the server');
    }
    
  };

  return (
    <div className="invoice-container" style={{ marginTop: '0px' }}>
      <header className="invoice-header">
        <img className="img" src={mp} alt="image" />
        <div className="invoice-info">
          <h1 style={{ fontSize: 50 }}>M.P. ENTERPRISES</h1>
          <p>MAIN ROAD RAXAUL, Purbi Champaran, Bihar - 845305</p>
          <p>GSTIN: 10AINPP0877F1ZA | PAN: AINP0877F</p>
          <p>State Code: 10</p>
        </div>
      </header>

      <form id="invoice-form">
        <h3 className="tax">TAX INVOICE</h3>

        <div className="cols-3">
          <div className="form-elem">
            <label className="form-label">Invoice Number</label>
            <input type="text" className="form-control invoice-number" value={invoiceNumber} readOnly />
          </div>

          <div className="form-elem">
            <label className="form-label">Invoice Date</label>
            <input type="date" className="form-control" />
          </div>

          <div className="form-elem">
            <label className="form-label">State</label>
            <input type="text" className="form-control" placeholder="Bihar" />
          </div>

          <div className="form-elem">
            <label className="form-label">Date of Supply</label>
            <input type="date" className="form-control firstname" placeholder="DD/MM/YYYY" />
          </div>

          <div className="form-elem">
            <label className="form-label">Place Of Supply</label>
            <input type="text" className="form-control middlename" placeholder="Abc" />
          </div>

          <div className="form-elem">
            <label className="form-label">Driver's Name</label>
            <input type="text" className="form-control lastname" placeholder="Xyz" />
          </div>

          <div className="form-elem">
            <label className="form-label">Vehicle Number</label>
            <input type="text" className="form-control firstname" placeholder="BR05GB4421" />
          </div>

          <div className="form-elem">
            <label className="form-label">Transport Mode</label>
            <input type="text" className="form-control middlename" defaultValue="By Road" />
          </div>
        </div>

        <h3 className="buyer">Buyer's Name & Address</h3>
        <div className="cols-2">
          <div className="form-elem">
            <label className="form-label">Name</label>
            <input type="text" className="form-control designation" placeholder="Nawal Enterprises" />
          </div>
          <div className="form-elem">
            <label className="form-label">Address</label>
            <input type="text" className="form-control address" placeholder="e.g. Lake Street-23" />
          </div>
        </div>

        <div className="cols-3">
          <div className="form-elem">
            <label className="form-label">Phone No:</label>
            <input type="text" className="form-control phoneno" placeholder="e.g. +91977680798" />
          </div>
          <div className="form-elem">
            <label className="form-label">Email</label>
            <input type="email" className="form-control email" placeholder="e.g. johndoe@gmail.com" />
          </div>
          <div className="form-elem">
            <label className="form-label">GSTIN</label>
            <input type="text" className="form-control summary" placeholder="e.g. Doe" />
          </div>
          <div className="form-elem">
            <label className="form-label">Country</label>
            <input type="text" className="form-control summary" placeholder="Nepal" />
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="text" value={row.product} onChange={(e) => handleInputChange(index, 'product', e.target.value)} /></td>
                <td><input type="text" value={row.hsn} onChange={(e) => handleInputChange(index, 'hsn', e.target.value)} /></td>
                <td><input type="number" value={row.qty} onChange={(e) => handleInputChange(index, 'qty', e.target.value)} /></td>
                <td><input type="number" value={row.rate} onChange={(e) => handleInputChange(index, 'rate', e.target.value)} /></td>
                <td><input type="number" value={row.taxable.toFixed(2)} readOnly /></td>
                <td><input type="number" value={row.igst.toFixed(2)} readOnly /></td>
                <td><input type="number" value={row.total.toFixed(2)} readOnly /></td>
                <td><button type="button" className="delete-btn" onClick={() => removeRow(index)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" id="addRowBtn" className="btn btn-primary" onClick={addRow}>Add Row</button>

        <div className="bill">
          <div className="bank-info">
            <p style={{ color: 'blue' }}>Bank & Payment Details</p>
            <p><b>A/C Holder:</b> M.P Enterprises</p>
            <p><b>A/C No:</b> 10973176188</p>
            <p><b>IFSC Code:</b> SBIN0002998</p>
            <p><b>Bank:</b> State Bank of India, Raxaul</p>
          </div>
          <div className="word">
            <input type="number" className="total" readOnly value={totalSum.toFixed(2)} style={{ textAlign: 'right',  }} />
            <p className="total-in-word">Total Invoice Amount in Words</p>
            <p className="total-in-words">{totalWords}</p>
          </div>
        </div>

        <section className="print-btn-sc">
          <button type="button" className="print-btn btn btn-primary" onClick={saveInvoiceToDB}>Print</button>
        </section>
        <footer className="print-footer">M.P ENTERPRISES</footer>
      </form>
    </div>
  );
};

export default InvoicePage;