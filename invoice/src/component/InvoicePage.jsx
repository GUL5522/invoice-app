import React, { useEffect, useState } from "react";
import "./main.css";
import signature from "../assets/singnature.png";
import { useParams } from "react-router-dom";

const generateInvoiceNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MP/${year}/${randomNum}`;
};

const numberToWords = (n) => {
  if (isNaN(n) || n < 0) return "Please enter a valid number";
  if (n === 0) return "Zero Rupees Only /-";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
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

// NOTE: Indian invoice editor needs IGST (5%) but layout same as Nepal.
const InvoicePage = ({ readOnly = false, invoiceId = null }) => {
  const params = useParams();
  const resolvedInvoiceId = invoiceId || params.id || null;
  const isViewMode = !!resolvedInvoiceId;

  const vehicleOptions = ["BRO5G-7204", "BR05GB-4421"];
  const productOptions = [
    "HARD COKE",
    "HARD COKE(LOOSE)",
    "SOFT COKE",
    "SOFT COKE(LOOSE)",
    "COAL (LOOSE)",
    "CHINESE",
  ];
  const hsnOptions = ["27040000", "27040030", "27040040", "27011200"];
  const descriptionOptions = ["GRADE-I", "GRADE-II", "GRADE-W-III", "GRADE-II FC", "GRADE-II FC (coke)",];

  const [rows, setRows] = useState([
    {
      product: "",
      descOption: "",
      description: "GCV-5700\nSize (50-200MM)",
      hsn: "",
      qty: "",
      rate: "",
      taxable: 0,
      igst: 0,
      total: 0,
    },
  ]);

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  // const [dateOfSupply, setDateOfSupply] = useState(new Date().toISOString().split("T")[0]);

  const [totalSum, setTotalSum] = useState(0);
  const [totalWords, setTotalWords] = useState("");

  // const [destinations, setDestinations] = useState("Bihar");
  // const [placeOfSupply, setPlaceOfSupply] = useState("Raxaul");
  // const [driverName, setDriverName] = useState("");
  // const [transportMode, setTransportMode] = useState("By Road");
  const [dispatchThrough, setDispatchThrough] = useState("By Truck");
  const [destination, setDestination] = useState("BIRGUNJ(NEPAL)");
  const [transport, setTransport] = useState("R.M.R");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [countryName, setCountryName] = useState("NEPAL");
  const [termsDelivery, setTermsDelivery] = useState("FOB RAXAUL");

  // Buyer (Nepal layout uses left/buyer block)
  const [buyerName, setBuyerName] = useState("Shree Nawal Enterprises");
  const [buyerAddress, setBuyerAddress] = useState("BIRGUNJ,NEPAL");
  const [buyerPhone, setBuyerPhone] = useState("+977 9855023130");
  const [buyerEmail, setBuyerEmail] = useState("s.nawalenterprises@gmail.com");
  const [buyerPAN, setBuyerPAN] = useState("300277319");
  const [buyerEximCode, setBuyerEximCode] = useState("3002773190146NP");
  const [buyerCountry, setBuyerCountry] = useState("NEPAL");
  const GST_RATE = 5 / 100;

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const qty = parseFloat(updatedRows[index].qty) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;

    const taxable = qty * rate;
    const igst = taxable * GST_RATE;
    const total = taxable + igst;

    updatedRows[index].taxable = taxable;
    updatedRows[index].igst = igst;
    updatedRows[index].total = total;

    setRows(updatedRows);
  };

  useEffect(() => {
    const sum = rows.reduce((acc, row) => acc + (row.total || 0), 0);
    setTotalSum(sum);
    setTotalWords(numberToWords(Math.round(sum)));
  }, [rows]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (resolvedInvoiceId) {
      fetchInvoice();
    }
  }, [resolvedInvoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/${resolvedInvoiceId}`
      );

      const data = await response.json();

      if (data.success) {
        const invoice = data.invoice;
        setInvoiceNumber(invoice.invoiceNumber || "");

        setInvoiceDate(
          invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
            : ""
        );

        setBuyerName(invoice.buyerName || "");
        setBuyerAddress(invoice.buyerAddress || "");
        setBuyerPhone(invoice.buyerPhone || "");
        setBuyerEmail(invoice.buyerEmail || "");
        setBuyerPAN(invoice.buyerPAN || "");
        setBuyerEximCode(invoice.buyerEximCode || "");

        setDispatchThrough(invoice.dispatchThrough || "");
        setDestination(invoice.destination || "");
        setTransport(invoice.transport || "");
        setVehicleNumber(invoice.vehicleNumber || "");
        setCountryName(invoice.countryName || "");
        setTermsDelivery(invoice.termsDelivery || "");
        setRows(invoice.products || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveInvoiceToDB = async () => {
    if (!buyerName || !buyerAddress) {
      alert("Please fill in Buyer Name and Buyer Address");
      return;
    }

    if (!transport) {
      alert("Please fill Transport Name");
      return;
    }

    if (!vehicleNumber) {
      alert("Please fill Vehicle Number");
      return;
    }

    const validProducts = rows.filter(
      (row) =>
        row.product &&
        row.hsn &&
        parseFloat(row.qty) > 0 &&
        parseFloat(row.rate) > 0
    );

    if (validProducts.length === 0) {
      alert("Please add at least one product with valid details");
      return;
    }

    const invoiceData = {
      invoiceNumber,
      invoiceDate,

      dispatchThrough,
      vehicleNumber,
      destination,
      transport,
      countryName,
      termsDelivery,

      buyerName,
      buyerAddress,
      buyerEximCode,
      buyerPhone,
      buyerEmail,
      buyerPAN,
      buyerCountry,

      products: validProducts.map((row) => ({
        product: row.product,
        descOption: row.descOption,
        description: row.description,
        hsn: row.hsn,
        qty: parseFloat(row.qty) || 0,
        rate: parseFloat(row.rate) || 0,
        taxable: parseFloat(row.taxable) || 0,
        igst: parseFloat(row.igst) || 0,
        total: parseFloat(row.total) || 0,
      })),

      totalAmount: parseFloat(totalSum) || 0,
      amountInWords: totalWords || "",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      // Try to parse JSON response, but don't crash if server returned non-JSON
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok) {
        alert("Saved Successfully");
      }
      else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Failed to connect to the server");
    }
  };

  return (
    <div className="invoice" style={{
    }}>
      <h2 className="title">Tax Invoice</h2>
      <p className="title2">(SUPPLY MEANT FOR EXPORT / SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS ON PAYMENT OF IGST)</p>
      <div className="top">
        {/* LEFT: Seller/Buyer */}
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

            <input style={{ with: "100%", fontWeight: "bold", textTransform: "none" }}
              value={buyerName}
              onChange={(e) =>
                setBuyerName(
                  e.target.value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                )
              }
              readOnly={isViewMode}
            />
            <br></br>
            <input style={{ width: "100%" }} value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} readOnly={isViewMode} />
            <br></br>
            <label>PAN:-</label>
            <input value={buyerPAN} onChange={(e) => setBuyerPAN(e.target.value)} readOnly={isViewMode} />
            <br></br>
            <label>EXIM CODE:-</label>
            <input value={buyerEximCode} onChange={(e) => setBuyerEximCode(e.target.value)} readOnly={isViewMode} />
            <br></br>
            <label>E-MAIL:-</label>
            <input style={{ width: "80%", textTransform: "lowercase" }} value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} readOnly={isViewMode} />
            <br></br>
            <label>CONTACT:-</label>
            <input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} readOnly={isViewMode} />
          </div>

        </div>

        {/* RIGHT: custom table-like header */}
        <div className="right">
          <table className="right-table">
            <thead>
              <tr>
                <td><label>Invoice No:</label><input value={invoiceNumber} readOnly />
                </td>
                <td>
                  <label>Date:</label>

                  {isViewMode ? (
                    <input value={formatDate(invoiceDate)} readOnly />
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
                <td><label>Dispatch Through:</label><input value={dispatchThrough} onChange={(e) => setDispatchThrough(e.target.value)} readOnly={isViewMode} />
                </td>
                <td><label>Destination:</label><input value={destination} onChange={(e) => setDestination(e.target.value)} readOnly={isViewMode} />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Transport:</label><input value={transport} onChange={(e) => setTransport(e.target.value)} readOnly={isViewMode} />
                </td>
                <td>
                  <label>Motor Vehicle No.</label>
                  <input
                    type="text"
                    style={{ width: "100%" }}
                    value={vehicleNumber || ""}
                    list="vehicles"
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    readOnly={isViewMode}
                  />
                  <datalist id="vehicles">
                    {vehicleOptions.map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                  <datalist id="products">
                    {productOptions.map((p, idx) => (
                      <option key={idx} value={p} />
                    ))}
                  </datalist>
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <label>Country:</label><input style={{ textTransform: "uppercase" }}
                    value={countryName} onChange={(e) => setCountryName(e.target.value)} readOnly={isViewMode} />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <label>Terms of Delivery:</label><input value={termsDelivery} onChange={(e) => setTermsDelivery(e.target.value)} readOnly={isViewMode} />
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {/* Product table */}
      <table className="table-product-india">
        <thead>
          <tr>
            <th>Description of Goods</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Rate(MTS)</th>
            <th>Amount</th>
            <th>IGST (5%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    fontWeight: "bold"
                  }}
                  value={row.product || ""}
                  list="products"
                  onChange={(e) => handleInputChange(i, "product", e.target.value)}
                  readOnly={isViewMode}
                  placeholder="Product"
                />
                <datalist id="products">
                  {productOptions.map((p, idx) => (
                    <option key={idx} value={p} />
                  ))}
                </datalist>

                <input
                  type="text"
                  style={{ width: "100%", marginTop: 4 }}
                  value={row.descOption || ""}
                  list="descriptions"
                  onChange={(e) => handleInputChange(i, "descOption", e.target.value)}
                  placeholder="Grade"
                  readOnly={isViewMode}
                />
                <datalist id="descriptions">
                  {descriptionOptions.map((d, idx) => (
                    <option key={idx} value={d} />
                  ))}
                </datalist>

                <textarea
                  className="myTextarea"
                  value={row.description || " "}
                  onChange={(e) => handleInputChange(i, "description", e.target.value)}
                  rows={2}
                  readOnly={isViewMode}
                />
              </td>

              <td>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={row.hsn || ""}
                  list="hsns"
                  onChange={(e) => handleInputChange(i, "hsn", e.target.value)}
                  readOnly={isViewMode}
                />
                <datalist id="hsns">
                  {hsnOptions.map((hsn, idx) => (
                    <option key={idx} value={hsn} />
                  ))}
                </datalist>
              </td>

              <td>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={row.qty || ""}
                  onChange={(e) => handleInputChange(i, "qty", e.target.value)}
                  readOnly={isViewMode}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={row.rate || ""}
                  onChange={(e) => handleInputChange(i, "rate", e.target.value)}
                  readOnly={isViewMode}
                />
              </td>

              <td>{(row.taxable || 0).toFixed(2)}</td>
              <td>{(row.igst || 0).toFixed(2)}</td>
              <td>{(row.total || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="om">
        <tbody>
          <tr>
            <td>HSN/SAC</td>
            <td className="right-header">Taxable Value</td>
          </tr>

          <tr>
            <td>{rows[0]?.hsn || ""}</td>
            <td></td>
          </tr>

          <tr>
            <th className="total-label">Total</th>
            <th>{rows[0]?.total?.toFixed(2) || "0.00"}</th>
          </tr>
        </tbody>
      </table>

      <div className="bottom-section">

        <div className="word" >
          <div className="word-header">
            <p className="total-in-word">Amount Chargeable (in Words)</p>
            <p className="eoe">E.&O.E</p>
          </div>
          <p className="total-in-words">{numberToWords(totalSum)}</p>
        </div>

        <div className="bottom-grid">

          {/* LEFT */}
          <div className="declaration-box">

            <p className="tax-words">
              <b>Tax Amount (in words): </b>
              {rows.reduce((sum, row) => sum + (row.igst || 0), 0) > 0
                ? numberToWords(
                  Math.round(
                    rows.reduce((sum, row) => sum + (row.igst || 0), 0)
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

            <p><b><u>Company's Bank Details</u></b></p>

            <div className="bank-row">
              <span>Bank Name</span>
              <b>:State Bank of India</b>
            </div>

            <div className="bank-row">
              <span>A/c No.</span>
              <b>:10973176188</b>
            </div>

            <div className="bank-row">
              <span>Branch</span>
              <b>:Raxaul</b>
            </div>

            <div className="bank-row">
              <span>IFS Code</span>
              <b>:SBIN0002998</b>
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
          if (isViewMode) {
            window.print();
          } else {
            saveInvoiceToDB();
          }
        }}
        disabled={rows.length === 0}
      >
        {isViewMode ? "Print" : "Save Invoice"}
      </button>
    </div>
  );
};

export default InvoicePage;

