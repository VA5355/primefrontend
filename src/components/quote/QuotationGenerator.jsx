import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import PropTypes from "prop-types";

import {
    AnimatePresence,
    motion
} from "framer-motion";

import {
    Plus,
    Trash2,
    Download,
    FileText,
    Send,
    Calendar,
    User,
    Briefcase,
    X,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    WifiOff
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ============================================================
   JSDOC TYPES (Replaces TS Interfaces for IDE Support)
   ============================================================ */

/**
 * @typedef {Object} QuotationItem
 * @property {string} id
 * @property {string} description
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} CompanyDetails
 * @property {string} name
 * @property {string} email
 * @property {string} address
 */

/**
 * @typedef {Object} ClientDetails
 * @property {string} name
 * @property {string} email
 * @property {string} address
 * @property {string} date
 * @property {string} validUntil
 */

/**
 * @typedef {Object} Quotation
 * @property {string} quotationNumber
 * @property {CompanyDetails} company
 * @property {ClientDetails} client
 * @property {QuotationItem[]} items
 * @property {number} taxRate
 * @property {number} subtotal
 * @property {number} taxAmount
 * @property {number} grandTotal
 * @property {string} currency
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/* ============================================================
   CONSTANTS
   ============================================================ */

const LOCAL_STORAGE_KEY = "shop-hub-pending-quotations";
const DEFAULT_API_ENDPOINT = "/api/quotations";
const DEFAULT_CURRENCY = "INR";

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Generates a unique string ID.
 * @returns {string}
 */
function generateId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Formats a given amount into standard localized currency string format.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
function formatCurrency(amount, currency) {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * @returns {string}
 */
function getToday() {
    return new Date().toISOString().split("T")[0];
}

/**
 * Generates a standard quotation reference string.
 * @returns {string}
 */
function generateQuotationNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(100000 + Math.random() * 900000);

    return `QT-${year}${month}${day}-${random}`;
}

/* ============================================================
   LOCAL FALLBACK
   ============================================================ */

/**
 * Persists quotation object locally in localStorage.
 * @param {Quotation} quotation
 */
function saveQuotationLocally(quotation) {
    try {
        const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
        const quotations = existing ? JSON.parse(existing) : [];

        quotations.push(quotation);

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(quotations)
        );
    } catch (error) {
        console.error("Unable to save quotation locally:", error);
    }
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function QuotationGenerator({
    isOpen = false,
    onClose,
    onSaved,
    apiEndpoint = DEFAULT_API_ENDPOINT,
    currency = DEFAULT_CURRENCY
}) {
    /* --------------------------------------------------------
       PDF TARGET
       -------------------------------------------------------- */
    const quotationRef = useRef(null);

    /* --------------------------------------------------------
       CLIENT
       -------------------------------------------------------- */
    const [client, setClient] = useState({
        name: "",
        email: "",
        address: "",
        date: getToday(),
        validUntil: ""
    });

    /* --------------------------------------------------------
       COMPANY
       -------------------------------------------------------- */
    const [company, setCompany] = useState({
        name: "Acme Corp",
        email: "billing@acme.com",
        address: "123 Business Rd, Suite 100"
    });

    /* --------------------------------------------------------
       ITEMS
       -------------------------------------------------------- */
    const [items, setItems] = useState([
        {
            id: generateId(),
            description: "Web Application Development",
            quantity: 1,
            price: 1500
        }
    ]);

    /* --------------------------------------------------------
       TAX
       -------------------------------------------------------- */
    const [taxRate, setTaxRate] = useState(10);

    /* --------------------------------------------------------
       QUOTATION NUMBER
       -------------------------------------------------------- */
    const [quotationNumber, setQuotationNumber] = useState(
        generateQuotationNumber()
    );

    /* --------------------------------------------------------
       STATUS
       -------------------------------------------------------- */
    const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "failed"
    const [pdfStatus, setPdfStatus] = useState("idle");   // "idle" | "generating" | "generated" | "failed"
    const [errorMessage, setErrorMessage] = useState("");

    /* --------------------------------------------------------
       RESET WHEN MODAL OPENS
       -------------------------------------------------------- */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setQuotationNumber(generateQuotationNumber());
        setSaveStatus("idle");
        setPdfStatus("idle");
        setErrorMessage("");
    }, [isOpen]);

    /* --------------------------------------------------------
       ADD ITEM
       -------------------------------------------------------- */
    const addItem = useCallback(() => {
        setItems(previousItems => [
            ...previousItems,
            {
                id: generateId(),
                description: "",
                quantity: 1,
                price: 0
            }
        ]);
    }, []);

    /* --------------------------------------------------------
       REMOVE ITEM
       -------------------------------------------------------- */
    const removeItem = useCallback((id) => {
        setItems(previousItems => {
            if (previousItems.length <= 1) {
                return previousItems;
            }
            return previousItems.filter(item => item.id !== id);
        });
    }, []);

    /* --------------------------------------------------------
       UPDATE ITEM
       -------------------------------------------------------- */
    const updateItem = useCallback((id, field, value) => {
        setItems(previousItems =>
            previousItems.map(item => {
                if (item.id !== id) {
                    return item;
                }
                return {
                    ...item,
                    [field]: value
                };
            })
        );
    }, []);

    /* --------------------------------------------------------
       CALCULATIONS
       -------------------------------------------------------- */
    const subtotal = useMemo(() => {
        return items.reduce((total, item) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return total + quantity * price;
        }, 0);
    }, [items]);

    const taxAmount = useMemo(() => {
        return (subtotal * (Number(taxRate) || 0)) / 100;
    }, [subtotal, taxRate]);

    const grandTotal = useMemo(() => {
        return subtotal + taxAmount;
    }, [subtotal, taxAmount]);

    /* --------------------------------------------------------
       CREATE QUOTATION OBJECT
       -------------------------------------------------------- */
    const buildQuotation = useCallback(() => {
        const now = new Date().toISOString();

        return {
            quotationNumber,
            company: { ...company },
            client: { ...client },
            items: items.map(item => ({
                ...item,
                quantity: Number(item.quantity) || 0,
                price: Number(item.price) || 0
            })),
            taxRate: Number(taxRate) || 0,
            subtotal,
            taxAmount,
            grandTotal,
            currency,
            createdAt: now,
            updatedAt: now
        };
    }, [
        quotationNumber,
        company,
        client,
        items,
        taxRate,
        subtotal,
        taxAmount,
        grandTotal,
        currency
    ]);

    /* --------------------------------------------------------
       VALIDATION
       -------------------------------------------------------- */
    const validateQuotation = useCallback(() => {
        if (!company.name.trim()) {
            return "Company name is required.";
        }

        if (!company.email.trim()) {
            return "Company email is required.";
        }

        if (!client.name.trim()) {
            return "Client name is required.";
        }

        if (
            client.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)
        ) {
            return "Please enter a valid client email.";
        }

        if (!client.date) {
            return "Quotation date is required.";
        }

        if (items.length === 0) {
            return "At least one quotation item is required.";
        }

        const invalidItem = items.find(
            item =>
                !item.description.trim() ||
                Number(item.quantity) <= 0 ||
                Number(item.price) < 0
        );

        if (invalidItem) {
            return (
                "Please provide a valid description, " +
                "quantity and price for every item."
            );
        }

        if (Number(taxRate) < 0 || Number(taxRate) > 100) {
            return "Tax rate must be between 0 and 100.";
        }

        return null;
    }, [company, client, items, taxRate]);

    /* --------------------------------------------------------
       BACKEND SAVE
       -------------------------------------------------------- */
    const saveToBackend = useCallback(
        async (quotation) => {
            setSaveStatus("saving");

            try {
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(quotation)
                });

                if (!response.ok) {
                    let message = `Server returned ${response.status}`;

                    try {
                        const body = await response.json();
                        if (body && typeof body.message === "string") {
                            message = body.message;
                        }
                    } catch {
                        // Response wasn't JSON.
                    }

                    throw new Error(message);
                }

                setSaveStatus("saved");

                if (onSaved) {
                    onSaved(quotation);
                }

                return true;
            } catch (error) {
                console.error("Quotation API failed:", error);

                saveQuotationLocally(quotation);

                setSaveStatus("failed");

                setErrorMessage(
                    "The quotation could not be saved " +
                    "to the server. A local copy has been " +
                    "saved on this device."
                );

                return false;
            }
        },
        [apiEndpoint, onSaved]
    );

    /* --------------------------------------------------------
       GENERATE PDF
       -------------------------------------------------------- */
    const generatePDF = useCallback(async (quotation) => {
        if (!quotationRef.current) {
            setPdfStatus("failed");
            setErrorMessage("Quotation preview is not available.");
            return false;
        }

        setPdfStatus("generating");

        try {
            const element = quotationRef.current;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false
            });

            const imageData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const usableWidth = pageWidth - margin * 2;
            const imageHeight = (canvas.height / canvas.width) * usableWidth;

            let remainingHeight = imageHeight;
            let position = margin;

            pdf.addImage(
                imageData,
                "PNG",
                margin,
                position,
                usableWidth,
                imageHeight
            );

            remainingHeight -= pageHeight - margin * 2;

            while (remainingHeight > 0) {
                position = margin - (imageHeight - remainingHeight);
                pdf.addPage();
                pdf.addImage(
                    imageData,
                    "PNG",
                    margin,
                    position,
                    usableWidth,
                    imageHeight
                );
                remainingHeight -= pageHeight - margin * 2;
            }

            pdf.save(`${quotation.quotationNumber}.pdf`);
            setPdfStatus("generated");
            return true;
        } catch (error) {
            console.error("PDF generation failed:", error);
            setPdfStatus("failed");
            setErrorMessage(
                "The quotation was saved, but PDF " +
                "generation failed."
            );
            return false;
        }
    }, []);

    /* --------------------------------------------------------
       SAVE QUOTATION
       -------------------------------------------------------- */
    const handleSave = useCallback(
        async (event) => {
            event?.preventDefault();
            setErrorMessage("");

            const validationError = validateQuotation();
            if (validationError) {
                setErrorMessage(validationError);
                return;
            }

            const quotation = buildQuotation();
            await saveToBackend(quotation);
        },
        [validateQuotation, buildQuotation, saveToBackend]
    );

    /* --------------------------------------------------------
       SAVE + DOWNLOAD PDF
       -------------------------------------------------------- */
    const handleSaveAndPDF = useCallback(
        async (event) => {
            event?.preventDefault();
            setErrorMessage("");

            const validationError = validateQuotation();
            if (validationError) {
                setErrorMessage(validationError);
                return;
            }

            const quotation = buildQuotation();

            const pdfPromise = generatePDF(quotation);
            const savePromise = saveToBackend(quotation);

            await Promise.all([pdfPromise, savePromise]);
        },
        [validateQuotation, buildQuotation, generatePDF, saveToBackend]
    );

    /* --------------------------------------------------------
       DOWNLOAD PDF ONLY
       -------------------------------------------------------- */
    const handleDownloadPDF = useCallback(async () => {
        setErrorMessage("");

        const validationError = validateQuotation();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const quotation = buildQuotation();
        await generatePDF(quotation);
    }, [validateQuotation, buildQuotation, generatePDF]);

    /* --------------------------------------------------------
       SEND QUOTE
       -------------------------------------------------------- */
    const handleSendQuote = useCallback(async () => {
        setErrorMessage("");

        const validationError = validateQuotation();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const quotation = buildQuotation();
        const saved = await saveToBackend(quotation);

        if (!saved) {
            return;
        }

        console.log("Quotation ready to send:", quotation);
    }, [validateQuotation, buildQuotation, saveToBackend]);

    /* --------------------------------------------------------
       ESCAPE KEY
       -------------------------------------------------------- */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (onClose) onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    /* --------------------------------------------------------
       BODY SCROLL LOCK
       -------------------------------------------------------- */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    /* --------------------------------------------------------
       MODAL RENDER
       -------------------------------------------------------- */
    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget && onClose) {
                        onClose();
                    }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-5xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    {/* MODAL HEADER */}
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-slate-900 text-white shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-lg font-bold truncate">
                                    New Quotation
                                </h1>
                                <p className="hidden sm:block text-xs text-slate-400">
                                    Create a professional quotation
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close quotation"
                            className="p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* STATUS MESSAGE */}
                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 sm:px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-sm flex items-start gap-2 shrink-0"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SCROLLABLE CONTENT */}
                    <form
                        onSubmit={handleSaveAndPDF}
                        className="flex-1 min-h-0 overflow-y-auto"
                    >
                        {/* PDF TARGET */}
                        <div
                            ref={quotationRef}
                            className="bg-white p-4 sm:p-6 md:p-10"
                        >
                            {/* QUOTATION TITLE */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                                        Quotation
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        {quotationNumber}
                                    </h2>
                                </div>

                                <div className="text-left sm:text-right text-sm text-slate-500">
                                    <div>Date: {client.date || "-"}</div>
                                    <div>Valid Until: {client.validUntil || "-"}</div>
                                </div>
                            </div>

                            {/* COMPANY + CLIENT */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                                {/* COMPANY */}
                                <div className="space-y-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5" /> From
                                    </span>

                                    <input
                                        type="text"
                                        value={company.name}
                                        onChange={(event) =>
                                            setCompany(previous => ({
                                                ...previous,
                                                name: event.target.value
                                            }))
                                        }
                                        placeholder="Company Name"
                                        className="font-bold text-lg w-full border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1"
                                    />

                                    <input
                                        type="email"
                                        value={company.email}
                                        onChange={(event) =>
                                            setCompany(previous => ({
                                                ...previous,
                                                email: event.target.value
                                            }))
                                        }
                                        placeholder="Company Email"
                                        className="text-sm text-slate-500 w-full border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1"
                                    />

                                    <textarea
                                        value={company.address}
                                        onChange={(event) =>
                                            setCompany(previous => ({
                                                ...previous,
                                                address: event.target.value
                                            }))
                                        }
                                        placeholder="Company Address"
                                        rows={3}
                                        className="text-sm text-slate-500 w-full resize-none border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1"
                                    />
                                </div>

                                {/* CLIENT */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" /> Bill To
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Client Name"
                                        value={client.name}
                                        onChange={(event) =>
                                            setClient(previous => ({
                                                ...previous,
                                                name: event.target.value
                                            }))
                                        }
                                        className="font-medium text-slate-800 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Client Email"
                                        value={client.email}
                                        onChange={(event) =>
                                            setClient(previous => ({
                                                ...previous,
                                                email: event.target.value
                                            }))
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                    />

                                    <textarea
                                        placeholder="Client Address"
                                        value={client.address}
                                        onChange={(event) =>
                                            setClient(previous => ({
                                                ...previous,
                                                address: event.target.value
                                            }))
                                        }
                                        rows={2}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:border-indigo-500 focus:outline-none"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <input
                                                type="date"
                                                value={client.date}
                                                onChange={(event) =>
                                                    setClient(previous => ({
                                                        ...previous,
                                                        date: event.target.value
                                                    }))
                                                }
                                                className="text-xs bg-transparent focus:outline-none w-full"
                                            />
                                        </div>

                                        <input
                                            type="date"
                                            value={client.validUntil}
                                            onChange={(event) =>
                                                setClient(previous => ({
                                                    ...previous,
                                                    validUntil: event.target.value
                                                }))
                                            }
                                            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center gap-3">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                        Estimate Items
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Item
                                    </button>
                                </div>

                                {/* DESKTOP TABLE */}
                                <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                                <th className="p-3">Description</th>
                                                <th className="p-3 w-24 text-center">Qty</th>
                                                <th className="p-3 w-32 text-right">Price</th>
                                                <th className="p-3 w-32 text-right">Total</th>
                                                <th className="p-3 w-12" />
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            <AnimatePresence>
                                                {items.map(item => (
                                                    <motion.tr
                                                        key={item.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="hover:bg-slate-50"
                                                    >
                                                        <td className="p-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Item description or service..."
                                                                value={item.description}
                                                                onChange={event =>
                                                                    updateItem(
                                                                        item.id,
                                                                        "description",
                                                                        event.target.value
                                                                    )
                                                                }
                                                                className="w-full text-sm bg-transparent focus:outline-none placeholder:text-slate-300"
                                                            />
                                                        </td>

                                                        <td className="p-3 text-center">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={item.quantity}
                                                                onChange={event =>
                                                                    updateItem(
                                                                        item.id,
                                                                        "quantity",
                                                                        Number(event.target.value)
                                                                    )
                                                                }
                                                                className="w-16 text-center text-sm bg-slate-50 border border-slate-200 rounded py-1 focus:border-indigo-500 focus:outline-none"
                                                            />
                                                        </td>

                                                        <td className="p-3 text-right">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.price}
                                                                onChange={event =>
                                                                    updateItem(
                                                                        item.id,
                                                                        "price",
                                                                        Number(event.target.value)
                                                                    )
                                                                }
                                                                className="w-24 text-right text-sm bg-slate-50 border border-slate-200 rounded py-1 px-2 focus:border-indigo-500 focus:outline-none"
                                                            />
                                                        </td>

                                                        <td className="p-3 text-right text-sm font-medium">
                                                            {formatCurrency(
                                                                Number(item.quantity) * Number(item.price),
                                                                currency
                                                            )}
                                                        </td>

                                                        <td className="p-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                disabled={items.length <= 1}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                aria-label="Remove item"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {/* MOBILE ITEM CARDS */}
                                <div className="md:hidden space-y-3">
                                    <AnimatePresence>
                                        {items.map(item => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="border border-slate-200 rounded-xl p-4 bg-white"
                                            >
                                                <div className="flex items-center justify-between gap-3 mb-3">
                                                    <span className="text-xs font-semibold uppercase text-slate-400">
                                                        Item
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={items.length <= 1}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Item description or service..."
                                                    value={item.description}
                                                    onChange={event =>
                                                        updateItem(
                                                            item.id,
                                                            "description",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 mb-3 focus:border-indigo-500 focus:outline-none"
                                                />

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-slate-500 mb-1">
                                                            Quantity
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={item.quantity}
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.id,
                                                                    "quantity",
                                                                    Number(event.target.value)
                                                                )
                                                            }
                                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-slate-500 mb-1">
                                                            Price
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.price}
                                                            onChange={event =>
                                                                updateItem(
                                                                    item.id,
                                                                    "price",
                                                                    Number(event.target.value)
                                                                )
                                                            }
                                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-right focus:border-indigo-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                                                    <span className="text-xs text-slate-500">
                                                        Item Total
                                                    </span>

                                                    <span className="font-bold text-slate-900">
                                                        {formatCurrency(
                                                            Number(item.quantity) * Number(item.price),
                                                            currency
                                                        )}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* TOTALS */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-96 space-y-3">
                                    <div className="flex justify-between items-center gap-4 text-sm">
                                        <span className="text-slate-500">Tax Rate</span>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={taxRate}
                                                onChange={event =>
                                                    setTaxRate(Number(event.target.value))
                                                }
                                                className="w-20 text-right text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-500 focus:outline-none"
                                            />
                                            <span className="text-slate-500">%</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium">
                                            {formatCurrency(subtotal, currency)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Tax ({taxRate}%)</span>
                                        <span className="font-medium">
                                            {formatCurrency(taxAmount, currency)}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">
                                            Total Amount
                                        </span>

                                        <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                                            {formatCurrency(grandTotal, currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* PDF FOOTER */}
                            <div className="mt-10 pt-5 border-t border-slate-100 text-xs text-slate-400">
                                <p>
                                    Thank you for considering {company.name || "our company"}.
                                </p>
                                <p className="mt-1">
                                    This quotation is subject to the terms and conditions
                                    applicable at the time of acceptance.
                                </p>
                            </div>
                        </div>

                        {/* STATUS BAR */}
                        <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-3 text-xs">
                            {saveStatus === "saved" && (
                                <div className="flex items-center gap-1.5 text-green-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Saved to server
                                </div>
                            )}

                            {saveStatus === "failed" && (
                                <div className="flex items-center gap-1.5 text-amber-600">
                                    <WifiOff className="w-4 h-4" />
                                    Saved locally
                                </div>
                            )}

                            {pdfStatus === "generated" && (
                                <div className="flex items-center gap-1.5 text-green-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    PDF generated
                                </div>
                            )}
                        </div>

                        {/* ACTION BAR */}
                        <div className="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>

                                <div className="grid grid-cols-1 sm:flex gap-2">
                                    {/* DOWNLOAD */}
                                    <button
                                        type="button"
                                        onClick={handleDownloadPDF}
                                        disabled={pdfStatus === "generating"}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        {pdfStatus === "generating" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Download PDF
                                    </button>

                                    {/* SAVE */}
                                    <button
                                        type="button"
                                        onClick={() => handleSave()}
                                        disabled={saveStatus === "saving"}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                                    >
                                        {saveStatus === "saving" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Quotation
                                    </button>

                                    {/* SAVE + PDF */}
                                    <button
                                        type="submit"
                                        disabled={
                                            saveStatus === "saving" ||
                                            pdfStatus === "generating"
                                        }
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                    >
                                        {saveStatus === "saving" ||
                                        pdfStatus === "generating" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <FileText className="w-4 h-4" />
                                        )}
                                        Save &amp; PDF
                                    </button>

                                    {/* SEND */}
                                    <button
                                        type="button"
                                        onClick={handleSendQuote}
                                        disabled={saveStatus === "saving"}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ============================================================
   RUNTIME PROP TYPE CHECKING
   ============================================================ */

QuotationGenerator.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaved: PropTypes.func,
    apiEndpoint: PropTypes.string,
    currency: PropTypes.string
};