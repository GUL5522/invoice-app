import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5500/api/invoices');
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setError(data.message || 'Failed to fetch invoices');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="invoice-list-container">
        <h2>Loading invoices...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-list-container">
        <h2>Error: {error}</h2>
        <button onClick={fetchInvoices}>Retry</button>
      </div>
    );
  }

  return (
    <div className="invoice-list-container">
      <h2>Saved Invoices</h2>
      <Link to="/bill" className="create-invoice-btn">Create New Invoice</Link>

      {invoices.length === 0 ? (
        <p>No invoices found. <Link to="/bill">Create your first invoice</Link></p>
      ) : (
        <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Buyer Name</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{invoice.buyerName}</td>
                  <td>₹{invoice.totalAmount.toFixed(2)}</td>
                  <td>
                    <Link to={`/invoice/${invoice._id}`} className="view-btn">
                      View
                    </Link>
                    <button
                      className="print-btn"
                      onClick={() => window.print()}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
