import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InvoiceList.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBuyer, setSearchBuyer] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    setFilteredInvoices(invoices);
  }, [invoices]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const performSearch = () => {
    const filtered = invoices.filter((invoice) => {
      const buyerMatch =
        searchBuyer === '' ||
        (invoice.buyerName || '')
          .toLowerCase()
          .includes(searchBuyer.toLowerCase());

      const invoiceMatch =
        searchInvoice === '' ||
        (invoice.invoiceNumber || '')
          .toLowerCase()
          .includes(searchInvoice.toLowerCase());

      // Reliable date comparison: normalize both sides to YYYY-MM-DD
      const invoiceDateValue = invoice.invoiceDate
        ? new Date(invoice.invoiceDate).toISOString().split('T')[0]
        : '';

      const searchDateValue = searchDate
        ? new Date(searchDate).toISOString().split('T')[0]
        : '';

      const dateMatch = searchDate === '' || invoiceDateValue === searchDateValue;

      return buyerMatch && invoiceMatch && dateMatch;
    });

    setFilteredInvoices(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const clearSearch = () => {
    setSearchBuyer('');
    setSearchInvoice('');
    setSearchDate('');
    setFilteredInvoices(invoices);
  };

  useEffect(() => {
    performSearch();
  }, [searchBuyer, searchInvoice, searchDate]);

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
      <h2>Indian Invoices</h2>
      <Link to="/bill" className="create-invoice-btn">+ Create New Indian Invoice</Link>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search Buyer"
          value={searchBuyer}
          onChange={(e) => setSearchBuyer(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="text"
          placeholder="📄 Search Invoice #"
          value={searchInvoice}
          onChange={(e) => setSearchInvoice(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        <button className="clear-btn" onClick={clearSearch}>
          Clear
        </button>
      </div>

      <p>Showing {filteredInvoices.length} of {invoices.length} invoices</p>

      {filteredInvoices.length === 0 ? (
        <p>No invoices match the search criteria. <Link to="/bill">Create a new invoice</Link></p>
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{invoice.buyerName}</td>
                  <td>₹{invoice.totalAmount.toFixed(2)}</td>
                  <td>
                    <Link to={`/bill/${invoice._id}`}
                      className="view-btn" state={{ invoiceId: invoice._id }}>
                      View
                    </Link>
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
