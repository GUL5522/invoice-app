@media screen and (max-width: 768px) {

    .invoice {
        width: 100% !important;
        margin: 0 auto !important;
        padding: 8px !important;
        border: 1px solid black;
        overflow-x: hidden;
    }

    .title {
        font-size: 24px !important;
    }

    .title2 {
        font-size: 10px !important;
        line-height: 1.4;
        word-break: break-word;
    }

    /* TOP SECTION */
    .top {
        flex-direction: column;
    }

    .left,
    .right {
        width: 100% !important;
        border-right: none !important;
    }

    .left .box p,
    .left .box input,
    .left .box label {
        font-size: 15px !important;
        line-height: 1.6;
    }

    .box {
        padding: 8px;
    }

    h3 {
        font-size: 16px;
    }

    p,
    input,
    textarea,
    label,
    td,
    th {
        font-size: 13px !important;
    }

    input,
    textarea {
        width: 100% !important;
    }

    /* SAME VIEW FOR INDIA + NEPAL */

    .right-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }



    /* KEEP DESKTOP STYLE IN MOBILE */

.right-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.right-table tr {
    display: table-row;
}

.right-table td {
    width: 50%;
    border: 1px solid black;
    padding: 6px;
    vertical-align: top;
    background: white;
}

.right-table label {
    display: block;
    font-size: 14px !important;
    font-weight: bold;
    margin-bottom: 4px;
}

.right-table input,
.right-table textarea {
    width: 100% !important;
    font-size: 14px !important;
    background: transparent;
}

/* LEFT SIDE */

.left,
.right {
    width: 100% !important;
}

.top {
    flex-direction: column;
}

    /* LEFT SIDE */

    .left .box p,
    .left .box input,
    .left .box textarea,
    .left .box label {
        font-size: 15px !important;
        line-height: 1.5;
    }


    /* PRODUCT TABLE -> CARD */
    .table-product-wala,
    .table-product-wala thead,
    .table-product-wala tbody,
    .table-product-wala th,
    .table-product-wala td,
    .table-product-wala tr {
        display: block;
        width: 100%;
    }

    .table-product-wala thead {
        display: none;
    }

    .table-product-wala tr {
        border: 1px solid black;
        margin-bottom: 15px;
        border-radius: 10px;
        overflow: hidden;
        padding: 10px;
        background: #fff;
    }

    .table-product-wala td {
        border: none;
        border-bottom: 1px solid #ddd;
        position: relative;
        padding: 10px 10px 10px 45%;
        min-height: 45px;
    }

    .table-product-wala td:last-child {
        border-bottom: none;
    }

    /* LABELS FOR MOBILE CARDS */

    .table-product-wala td:nth-child(1)::before {
        content: "Product";
    }

    .table-product-wala td:nth-child(2)::before {
        content: "HSN";
    }

    .table-product-wala td:nth-child(3)::before {
        content: "Quantity";
    }

    .table-product-wala td:nth-child(4)::before {
        content: "Rate";
    }

    .table-product-wala td:nth-child(5)::before {
        content: "Amount";
    }

    .table-product-wala td:nth-child(6)::before {
        content: "IGST";
    }

    .table-product-wala td:nth-child(7)::before {
        content: "Total";
    }

    .table-product-wala td::before {
        position: absolute;
        left: 10px;
        top: 10px;
        font-weight: bold;
        width: 40%;
    }

    /* WORD SECTION */
    .word {
        text-align: left !important;
        padding: 10px !important;
    }

    .total-in-word,
    .total-in-words {
        text-align: left !important;
        font-size: 14px !important;
    }

    /* BOTTOM GRID */
    .bottom-grid {
        flex-direction: column;
    }

    .declaration-box,
    .bank-box {
        width: 100% !important;
        border-right: none !important;
        border-bottom: 1px solid black;
    }

    .bank-box {
        border-bottom: none;
    }

    /* SIGNATURE */
    .footer-image {
        max-width: 120px;
        margin: 20px auto;
        float: none;
        display: block;
    }

    /* FOOTER */
    .footer-text {
        position: static !important;
        margin-top: 20px;
        font-size: 13px !important;
        padding-top: 8px;
    }

    /* BUTTON */
    .print-btn {
        width: 100%;
        margin-top: 20px;
        font-size: 15px;
        padding: 12px;
        border-radius: 8px;
    }

    /* SELECT AREA */
    .select-box {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .select-box select,
    .Load-data {
        width: 100%;
    }
}