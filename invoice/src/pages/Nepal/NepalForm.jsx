import React, { useEffect, useState } from "react";
import signature from "../../assets/singnature.png";

const NepalForm = ({ initialEditId }) => {
  const [nepalInvoices, setNepalInvoices] = useState([]);
  const [nepalLoading, setNepalLoading] = useState(false);
  const [nepalError, setNepalError] = useState(null);
  const [indianLoading, setIndianLoading] = useState(false);
  const [indianError, setIndianError] = useState(null);

  const [indianInvoices, setIndianInvoices] = useState([]);
  const [selectedIndianId, setSelectedIndianId] = useState("");
  const [selectedIndianInvoice, setSelectedIndianInvoice] = useState(null);

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPAN, setBuyerPAN] = useState("");
  const [buyerEximCode, setBuyerEximCode] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [rows, setRows] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [totalSum, setTotalSum] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedNepalId, setSelectedNepalId] = useState("");
  const [internalEditId, setInternalEditId] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const isViewMode = !!initialEditId;

  // Right table editable fields
  const [indianCustomPoint, setIndianCustomPoint] = useState("LCS RAXAUL,INDIA");
  const [modeTermsOfPayment, setModeTermsOfPayment] = useState("CREDIT OF 90DAYS");
  const [countryOfOrigin, setCountryOfOrigin] = useState("INDIA");
  const [customEntryPoint, setCustomEntryPoint] = useState("BIRGUNJ CUSTOM OFFICE, BIRAGUNJ, NEPAL");
  const [dispatchThrough, setDispatchThrough] = useState("BY TRUCK");
  const [destination, setDestination] = useState("BIRGUNJ, (NEPAL)");
  const [transport, setTransport] = useState("");
  const [countryName, setCountryName] = useState("NEPAL");
  const [termsDelivery, setTermsDelivery] = useState("FOB RAXAUL");
  const GST_RATE = 0;



  const numberToWords = (n) => {
    if (isNaN(n) || n < 0) return "Please enter a valid number";
    if (n === 0) return "Zero Rupees Only /-";

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchNepalInvoices();
  }, []);

  useEffect(() => {
    if (initialEditId) {
      setSelectedNepalId(initialEditId);
    }
  }, [initialEditId]);

  useEffect(() => {
    if (selectedNepalId) {
      loadNepalInvoice();
    }
  }, [selectedNepalId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        // alert("Please use the Print button on the website.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const beforePrintHandler = (e) => {
      if (!window.isCustomPrint) {
        e.preventDefault();
        // alert("Use website print button only!");
      }
    };

    window.addEventListener("beforeprint", beforePrintHandler);

    return () => {
      window.removeEventListener("beforeprint", beforePrintHandler);
    };
  }, []);

  const fetchNepalInvoices = async () => {
    setNepalLoading(true);
    setNepalError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nepal-invoices`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (data.success) {
        setNepalInvoices(data.invoices);
      } else {
        setNepalError(data.message || 'Failed to fetch Nepal invoices');
      }
    } catch (err) {
      setNepalError('Backend error. Refresh page.');
      console.error('Failed to fetch Nepal invoices:', err);
    } finally {
      setNepalLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIndianLoading(true);
    setIndianError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) setIndianInvoices(data.invoices);
      else setIndianError(data.message || 'Failed to fetch Indian invoices');
    } catch (err) {
      setIndianError('Failed to fetch Indian invoices.');
      console.error(err);
    } finally {
      setIndianLoading(false);
    }
  };

  const loadInvoice = async () => {
    if (!selectedIndianId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/${selectedIndianId}`
      );
      const data = await res.json();

      if (data.success) {

        const inv = data.invoice;
        setSelectedIndianInvoice(inv);

        setInvoiceNumber(inv.invoiceNumber);
        setBuyerName(inv.buyerName || "");
        setBuyerAddress(inv.buyerAddress || "");
        setBuyerPAN(inv.buyerPAN || "");
        setBuyerEximCode(inv.buyerEximCode || "");
        setBuyerEmail(inv.buyerEmail || "");
        setBuyerPhone(inv.buyerPhone || "");

        // Right table fields from selected Indian invoice
        setTransport(inv.transport || inv.Transport || "");
        setIndianCustomPoint(inv.indianCustomPoint || "LCS RAXAUL,INDIA");
        setModeTermsOfPayment(inv.modeTermsOfPayment || "CREDIT OF 90DAYS");
        setCountryOfOrigin(inv.countryOfOrigin || "INDIA");
        setCustomEntryPoint(inv.customEntryPoint || "BIRGUNJ CUSTOM OFFICE, BIRAGUNJ, NEPAL");
        setDispatchThrough(inv.dispatchThrough || "BY TRUCK");
        setDestination(inv.destination || "BIRGUNJ, (NEPAL)");
        setCountryName(inv.countryName || "NEPAL");
        setTermsDelivery(inv.termsDelivery || "FOB RAXAUL");


        const mapped = inv.products.map((p) => ({
          ...p,
          rate: '', // Manual input
          // qty auto from Indian
          taxable: 0,
          gst: 0,
          total: 0
        }));

        setRows(mapped);
        calculateTotal(mapped);

      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    const sum = data.reduce((acc, r) => acc + r.total, 0);
    setTotalSum(sum);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    const qty = parseFloat(updatedRows[index].qty) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;
    const taxable = qty * rate;
    const gst = taxable * (GST_RATE / 100);
    const total = taxable + gst;

    updatedRows[index].taxable = taxable;
    updatedRows[index].gst = gst;
    updatedRows[index].total = total;

    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  const saveNepalInvoice = async () => {
    if (rows.length === 0) {
      alert("No products to save");
      return;
    }

    const payload = {
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      indianCustomPoint,
      modeTermsOfPayment,
      countryOfOrigin,
      customEntryPoint,
      dispatchThrough,
      destination,
      transport,
      vehicleNumber: selectedIndianInvoice?.vehicleNumber,
      countryName,
      termsDelivery,
      buyerName,
      buyerAddress,
      buyerPAN,
      buyerEximCode,
      buyerEmail,
      buyerPhone,
      products: rows,
      totalAmount: totalSum,
      amountInWords: `${numberToWords(totalSum)}`,
    };


    const url = internalEditId
      ? `${import.meta.env.VITE_API_URL}/api/nepal-invoices/${internalEditId}`
      : `${import.meta.env.VITE_API_URL}/api/nepal-invoices`;
    const method = internalEditId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(internalEditId ? "Updated Successfully" : "Saved Successfully");

        if (internalEditId) {
          setInternalEditId(null);
          setIsEditMode(false);
          setSelectedNepalId("");
        }

        fetchNepalInvoices();
        fetchInvoices();
      } else {
        alert("Error: " + (data.message || "Save failed"));
      }
    } catch (err) {
      alert("Failed to save. Check backend.");
      console.error(err);
    }
  };

  const loadNepalInvoice = async () => {
    if (!selectedNepalId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/nepal-invoices/${selectedNepalId}`
      );
      const data = await res.json();

      if (data.success) {

        const inv = data.invoice;
        setInternalEditId(inv._id);
        setIsEditMode(true);
        setInvoiceNumber(inv.invoiceNumber);
        setInvoiceDate(new Date(inv.invoiceDate).toISOString().split('T')[0]);
        setBuyerName(inv.buyerName || "");
        setBuyerAddress(inv.buyerAddress || "");
        setBuyerPAN(inv.buyerPAN || "");
        setBuyerEximCode(inv.buyerEximCode || "");
        setBuyerEmail(inv.buyerEmail || "");
        setBuyerPhone(inv.buyerPhone || "");

        // Right table fields from saved invoice
        setIndianCustomPoint(inv.indianCustomPoint || "LCS RAXAUL,INDIA");
        setModeTermsOfPayment(inv.modeTermsOfPayment || "CREDIT OF 90DAYS");
        setCountryOfOrigin(inv.countryOfOrigin || "INDIA");
        setCustomEntryPoint(inv.customEntryPoint || "BIRGUNJ CUSTOM OFFICE,BIRAGUNJ, NEPAL");
        setDispatchThrough(inv.dispatchThrough || "BY TRUCK");
        setDestination(inv.destination || "BIRGUNJ, (NEPAL)");
        setTransport(inv.transport || inv.Transport || "");
        setSelectedIndianInvoice({
          vehicleNumber: inv.vehicleNumber
        });
        setTermsDelivery(inv.termsDelivery || "FOB RAXAUL");

        const mappedRows = inv.products.map((p) => ({
          ...p,
          taxable: p.taxable || 0,
          gst: p.gst || 0,
          total: p.total || 0
        }));

        setRows(mappedRows);
        calculateTotal(mappedRows);
        setTotalSum(inv.totalAmount);

      } else {
        alert("Failed to load Nepal invoice: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Load error:", err);
      alert("Failed to load Nepal invoice. Check console.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="invoice nepal-invoice">
      {/* Indian Invoices Select */}
      {!initialEditId && (
        <div className="select-box">
          {indianError && (
            <div style={{ color: 'orange', padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '10px' }}>
              {indianError}
            </div>
          )}
          {indianLoading && <div style={{ color: 'blue', padding: '8px' }}>Loading Indian invoices...</div>}
          <select
            value={selectedIndianId}
            onChange={(e) => setSelectedIndianId(e.target.value)}
          >
            <option value="">--Select Indian Invoice--</option>
            {indianInvoices.map((inv) => (
              <option key={inv._id} value={inv._id}>
                {inv.invoiceNumber}
              </option>
            ))}
          </select>

          <button className="Load-data" onClick={loadInvoice} disabled={!selectedIndianId || loading}>
            {loading ? "Loading..." : "Load Data"}
          </button>
        </div>
      )}

      <h2 className="title">Tax Invoice</h2>
      <p className="title2">(SUPPLYMEANTFOREXPORT/SUPPLYTOSEZUNITORSEZDEVELOPERFORAUTHORISEDOPERATIONS ON PAYMENT OF IGST)</p>

      {/* Nepal Edit Select */}
      {/* <div className="select-box">
        {nepalLoading && <div style={{ color: 'blue', padding: '8px' }}>Loading Nepal invoices...</div>}
        <select
          value={selectedNepalId}
          onChange={(e) => setSelectedNepalId(e.target.value)}
        >
          <option value="">--Select Nepal Invoice to Edit--</option>
          {nepalInvoices.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.invoiceNumber}
            </option>
          ))}
        </select>
        <button 
          className="Load-data" 
          onClick={loadNepalInvoice} 
          disabled={!selectedNepalId || loading}
        >
          {loading ? "Loading..." : "Load Nepal Data"}
        </button> 
      </div> */}

      {/* TOP */}
      <div className="top">


        {/* LEFT */}
        <div className="left">
          <div className="box">
            <p><b>M.P. ENTERPRISES</b></p>
            <p>MAIN ROAD RAXAUL, EAST CHAMPARAN, BIHAR 845305</p>
            <p>CONTACT:- +91 8235826679</p>
            <p>E-Mail:- madan.prasad92814@gmail.com</p>
            <p>AD CODE:-0000138-0620007</p>
            <p>IEC CODE:-2192001355</p>
            <p>GSTIN/UIN:- 10AINPP0877F1ZA</p>
            <p>PAN:- AINP0877F | State Code:- 10</p>
          </div>

          <div className="box">
            <p>Buyer (Bill to)</p>
            <p><b>{buyerName}</b></p>
            <p>{buyerAddress}</p>
            <p>PAN:-{buyerPAN}</p>
            <p>EXIM CODE:-{buyerEximCode}</p>
            <p>E-MAIL:-{buyerEmail}</p>
            <p>CONTACT:-{buyerPhone}</p>
          </div>

        </div>

        {/* RIGHT Table*/}
        <div className="right">
          <table className="right-table">
            <thead>
              <tr>
                <td><label>Invoice No:</label><input value={invoiceNumber} readOnly /></td>
                <td>
                  <label>Date:</label>

                  {initialEditId ? (
                    <input
                      type="text"
                      value={formatDate(invoiceDate)}
                      readOnly
                    />
                  ) : (
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td><label>Indian Custom Point:</label><input value={indianCustomPoint} onChange={(e) => setIndianCustomPoint(e.target.value)} readOnly={!!initialEditId} />
                </td>
                <td><label>Mode Terms of Payment:</label><input value={modeTermsOfPayment} onChange={(e) => setModeTermsOfPayment(e.target.value)} readOnly={!!initialEditId} />
                </td>
              </tr>

              <tr>
                <td><label>Country of Origin:</label><input value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} readOnly={!!initialEditId} />
                </td>
                <td>
                  <label>Custom Entery Point:</label>
                  <textarea
                    value={customEntryPoint}
                    onChange={(e) => setCustomEntryPoint(e.target.value)}
                    rows={2}
                    readOnly={!!initialEditId}
                    style={{
                      width: "100%",
                      border: "none",
                      resize: "none",
                      overflow: "hidden",
                      fontSize: "16px",
                      background: "transparent"
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td><label>Dispatch Through:</label><input
                  value={dispatchThrough}
                  onChange={(e) => setDispatchThrough(e.target.value)}
                  readOnly={!!initialEditId} />
                </td>
                <td><label>Destination:</label><input value={destination} onChange={(e) => setDestination(e.target.value)} readOnly={!!initialEditId} />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Transport:</label>
                  <input
                    type="text"
                    value={transport || ""}
                    onChange={(e) => setTransport(e.target.value)}
                    readOnly
                  />
                </td>
                <td>
                  <label>Motor Vehicle No.</label><input type="text" value={selectedIndianInvoice?.vehicleNumber || ""} readOnly />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <label>Country:</label><input value={countryName} onChange={(e) => setCountryName(e.target.value)} readOnly={!!initialEditId} />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <label>Terms of Delivery:</label><input value={termsDelivery} onChange={(e) => setTermsDelivery(e.target.value)} readOnly={!!initialEditId} />
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {/* TABLE product*/}
      <table className="table-product-nepal">
        <thead>
          <tr>
            <th>Description of Goods</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Rate(MTS)</th>
            <th>Amount</th>
            {/* <th>GST (0%)</th> */}
            {/* <th>Total</th> */}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <div>{row.product}</div>
                <div>{row.descOption}</div>
                <textarea
                  className="myTextarea"
                  value={row.description || ""}
                  readOnly
                />
              </td>

              <td>{row.hsn}</td>
              <td>
                <input
                  type="text"
                  // style={{ width: '100%' }}
                  value={row.qty || ''}
                  onChange={(e) => handleInputChange(i, 'qty', e.target.value)}
                  readOnly={isViewMode}
                />
              </td>
              <td>
                <input
                  type="text"
                  // style={{ width: '100%' }}  
                  value={row.rate || ''}
                  onChange={(e) => handleInputChange(i, 'rate', e.target.value)}
                  readOnly={isViewMode}
                  required
                />
              </td>
              <td>{row.taxable?.toFixed(2)}</td>
              {/* <td>{row.gst?.toFixed(2)}</td> */}
              {/* <td>{row.total?.toFixed(2)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <h3>Total: {numberToWords(totalSum)}</h3> */}
      <div className="bottom-section">

        <div className="word">
          <p className="total-in-word">Amount Chargeable (in Words)</p>
          <p className="total-in-words">{numberToWords(totalSum)}</p>
        </div>

        <div className="bottom-grid">

          {/* LEFT */}
          <div className="declaration-box">

            <p className="tax-words">
              <b>Tax Amount (in words): </b>

              {rows.reduce((sum, row) => sum + (row.gst || 0), 0) > 0
                ? numberToWords(
                  Math.round(
                    rows.reduce((sum, row) => sum + (row.gst || 0), 0)
                  )
                )
                : "NIL"}
            </p>

            <div className="declaration-content">
              <p className="underline">Declaration</p>

              <p>
                We declare that this invoice shows the actual
                price of the goods described and that all
                particulars are true and correct.
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="bank-box">

            <p>Company's Bank Details</p>

            <div className="bank-row">
              <span>Bank Name</span>
              <b>:State Bank of India</b>
            </div>

            <div className="bank-row">
              <span>A/c No.</span>
              <b>:10973176188</b>
            </div>

            <div className="bank-row">
              <span>Branch & IFS Code</span>
              <b>:Raxaul & SBIN0002998</b>
            </div>

            <div className="signature-box">
              <img
                src={signature}
                className="footer-image"
                alt="Digital Signature"
              />
            </div>

          </div>

        </div>
      </div>
      <div className="footer-text">
        This is a Computer Generated Invoice
      </div>



      <button
        className="print-btn"
        onClick={() => {
          if (initialEditId) {
            window.print();
          } else {
            saveNepalInvoice();
          }
        }}
        disabled={rows.length === 0}
      >
        {initialEditId ? "Print" : "Save Invoice"}
      </button>
    </div>
  );
};

export default NepalForm;
