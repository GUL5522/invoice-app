import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import signature from '../../assets/singnature.png';
import './Nepal.css';

const NepalInvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/nepal-invoices/${id}`
      );
      const data = await response.json();

      if (data.success) {
        setInvoice(data.invoice);
      } else {
        setError(data.message || 'Failed to fetch invoice');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
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

    return word.trim() + " Only";
  };

  if (loading) return <h2>Loading...</h2>;
  if (error || !invoice) return <h2>{error || 'Invoice not found'}</h2>;

  return (
    <>
      <style>
        {`@media print {
          .invoice-actions {
            display: none !important;
          }
          .print-btn {
            display: none !important;
          }
        }`}
      </style>
      <div className="invoice-actions"style={{marginLeft: '20px', marginRight: '40px'}}>
          <Link to="/nepal-invoices" style={{backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', marginRight: '10px' }}><b>← Back</b></Link>

          <button className="print-btn" onClick={handlePrint}>Print</button>
      </div>
      <div className="invoice">
        <div className="invoice-actions" style={{ marginBottom: '10px' }}>
        </div>
        <h2 className="title">Tax Invoice</h2>


        <div className="top">
          <div className="left">
            <div className="box">
              <h3>Seller Details</h3>
              <p style={{ fontSize: 35 }}>M.P. ENTERPRISES</p>
              <p>MAIN ROAD RAXAUL, EAST CHAMPARAN, BIHAR 845305</p>
              <p>CONTACT: +91 8235826679  |  madan.prasad92814@gmail.com</p>
              <p>AD CODE-0000138-0620007  |  IEC CODE-2192001355</p>
              <p>GSTIN/UIN: 10AINPP0877F1ZA | PAN: AINP0877F</p>
              <p>State Code: 10</p>
            </div>

            <div className="box">
              <h3>Buyer Details</h3>
              <p><b>{invoice.buyerName}</b></p>
              <p><b>{invoice.buyerAddress}</b></p>
              <p><b>PAN:</b> {invoice.buyerPAN}</p>
              <p><b>Exim Code:</b> {invoice.buyerEximCode}</p>
              <p><b>Email:</b> {invoice.buyerEmail}</p>
              <p><b>Phone:</b> {invoice.buyerPhone}</p>
            </div>
          </div>

          <div className="right">
            <table className="right-table">
              <thead>
                <tr>
                  <td><p><b>Invoice No:</b><br /> {invoice.invoiceNumber}</p></td>
                  <td><p><b>Date:</b><br /> {formatDate(invoice.invoiceDate)}</p></td>
                </tr>
                <tr>
                  <td><p><b>Indian Custom Point:</b><br /> {invoice.indianCustomPoint || "LCS RAXAUL,INDIA"}</p></td>
                  <td><p><b>Mode/Terms of Payment:</b><br /> {invoice.modeTermsOfPayment || "CREDIT OF 90DAYS"}</p></td>
                </tr>
                <tr>
                  <td><p><b>Country of Origin:</b><br /> {invoice.countryOfOrigin || "INDIA"}</p></td>
                  <td><p><b>Custom Entry Point:</b><br /> {invoice.customEntryPoint || "BIRGUNJ CUSTOM OFFICE, BIRAGUNJ, NEPAL"}</p></td>
                </tr>
                <tr>
                  <td><p><b>Dispatch Through:</b><br /> {invoice.dispatchThrough || "BY TRUCK"}</p></td>
                  <td><p><b>Destination:</b><br /> {invoice.destination || "BIRGUNJ, (NEPAL)"}</p></td>
                </tr>
                <tr>
                  <td><p><b>Country:</b><br /> NEPAL</p></td>
                
                </tr>
                <tr>
                  <td><p><b>Terms of Delivery:</b><br /> {invoice.termsDelivery || "FOB RAXAUL"}</p></td>
                
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate(MTS)</th>
              <th>Amount</th>
              {/* <th>Total</th> */}
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((p, i) => (
              <tr key={i}>
                <td>
                  <b>{p.product}</b>
                  <div>{p.descOption}</div>
                  <pre style={{ 
                    width: '100%', 
                    height: '90px', 
                    margin: '4px', 
                    fontSize: '20px', 
                    border: 'none', 
                    outline: 'none', 
                    background: 'transparent', 
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    padding: 0
                  }}>
                    {p.description}
                  </pre>
                </td>
                <td data-label="HSN">{p.hsn}</td>
                <td data-label="Qty">{p.qty}</td>
                <td data-label="Rate">{p.rate}</td>
                <td data-label="Amount">{p.total?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <h3>Total: {numberToWords(invoice.totalAmount)}</h3> */}

        <div className="bill">
          <div className="bank-info">
            <p style={{ color: 'blue' }}>Bank & Payment Details</p>
            <p><b>A/C Holder:</b> M.P. Enterprises</p>
            <p><b>A/C No:</b> 10973176188</p>
            <p><b>IFSC Code:</b> SBIN0002998</p>
            <p><b>Bank:</b> State Bank of India, Raxaul</p>
          </div>
          <div className="word">
            <p className="total-in-word">Amount in Words</p>
            <p className="total-in-words">{numberToWords(invoice.totalAmount)}</p>
          </div>
        </div>

        <img src={signature} className="footer-image" alt="Digital Signature" />

        {/* <button className="print-btn" onClick={handlePrint}>
          Print
        </button> */}
      </div>
    </>
  );
};

export default NepalInvoiceView;

