import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Nepal.css'; // Reuse styles

const NepalList = () => {
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

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nepal-invoices`);
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setError(data.message || 'Failed to fetch Nepal invoices');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching Nepal invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  useEffect(() => {
    const filtered = invoices.filter(invoice => {
      const buyerMatch = searchBuyer === '' || (invoice.buyerName || '').toLowerCase().includes(searchBuyer.toLowerCase());
      const invoiceMatch = searchInvoice === '' || (invoice.invoiceNumber || '').toLowerCase().includes(searchInvoice.toLowerCase());
      const formattedInvoiceDate = formatDate(invoice.invoiceDate);
      const formattedSearchDate = searchDate ? new Date(searchDate).toLocaleDateString('en-IN') : '';
      const dateMatch = searchDate === '' || formattedInvoiceDate === formattedSearchDate;
      return buyerMatch && invoiceMatch && dateMatch;
    });
    setFilteredInvoices(filtered);
  }, [invoices, searchBuyer, searchInvoice, searchDate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Search already handled by useEffect
    }
  };

  const clearSearch = () => {
    setSearchBuyer('');
    setSearchInvoice('');
    setSearchDate('');
  };

  if (loading) {
    return <div>Loading Nepal invoices...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
        <button onClick={fetchInvoices}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Nepal Invoices</h2>
      <Link to="/nepal-bill" className="create-invoice-btn">Create New Nepal Invoice</Link>

      <div>
        <input
          type="text"
          placeholder="Search buyer"
          value={searchBuyer}
          onChange={(e) => setSearchBuyer(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="Search invoice #"
          value={searchInvoice}
          onChange={(e) => setSearchInvoice(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={clearSearch}>Clear</button>
      </div>

      <p>{filteredInvoices.length} Nepal invoices</p>

      {filteredInvoices.length === 0 ? (
        <p>No Nepal invoices found.</p>
      ) : (
<table className="table responsive-table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Buyer</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{formatDate(invoice.invoiceDate)}</td>
                <td>{invoice.buyerName}</td>
                <td>{invoice.totalAmount.toFixed(2)}</td>
                <td><Link to={`/nepal-invoice/${invoice._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NepalList;
