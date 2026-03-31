import React from "react";
import { useParams, Link } from 'react-router-dom';
import NepalForm from './NepalForm';
import './Nepal.css';

const NepalEdit = () => {
  const { id } = useParams();
  
  return (
    <div>
      <Link to="/nepal-invoices">← Back to Nepal Invoices</Link>
      <NepalForm initialEditId={id} />
    </div>
  );
};

export default NepalEdit;
