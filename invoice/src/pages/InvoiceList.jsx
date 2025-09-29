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
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const performSearch = () => {
    const filtered = invoices.filter(invoice => {
      const buyerMatch = searchBuyer === '' || (invoice.buyerName || '').toLowerCase().includes(searchBuyer.toLowerCase());
      const invoiceMatch = searchInvoice === '' || (invoice.invoiceNumber || '').toLowerCase().includes(searchInvoice.toLowerCase());
      const formattedInvoiceDate = formatDate(invoice.invoiceDate);
      const formattedSearchDate = searchDate ? new Date(searchDate).toLocaleDateString('en-IN') : '';
      const dateMatch = searchDate === '' || formattedInvoiceDate === formattedSearchDate;
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
      <h2>Saved Invoices</h2>
      <Link to="/bill" className="create-invoice-btn">Create New Invoice</Link>

      <div className="search-container">
        <div>
          <label>Search by Buyer Name:</label>
          <input
            type="text"
            value={searchBuyer}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchBuyer(e.target.value)}
            placeholder="Enter buyer name"
          />
        </div>
        <div>
          <label>Search by Invoice Number:</label>
          <input
            type="text"
            value={searchInvoice}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInvoice(e.target.value)}
            placeholder="Enter invoice number"
          />
        </div>
        <div>
          <label>Search by Date:</label>
          <input
            type="date"
            value={searchDate}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <button onClick={performSearch}>Search</button>
        <button onClick={clearSearch}>Clear Search</button>
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
                    <Link to={`/invoice/${invoice._id}`} className="view-btn">
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
