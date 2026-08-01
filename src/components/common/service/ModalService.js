import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ModalService.jsx
// A self-contained React + Tailwind Modal Dialog Service wired to Redux (RTK)
// - modalSlice: show/hide modal (generic + error helpers)
// - modalMiddleware: automatically shows a modal for rejected async thunks
// - ModalRoot: a Tailwind-styled modal component that reads from Redux
// - examples: how to wire into store and dispatch
/*
  Install (if not already):
    npm install @reduxjs/toolkit react-redux

  Usage summary:
  1) Add `modalSlice.reducer` to your root reducer / configureStore.
  2) Add `modalMiddleware` to your middleware chain (optional but recommended).
  3) Render <ModalRoot /> near the top of your App (so modals overlay everything).
  4) Dispatch `showModal(...)` or `showError(...)` from anywhere using redux dispatch.
     You can also rely on automatic display for rejected thunks if you enable middleware.
*/
import React from "react";
import { useState } from "react";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { Clock, Zap, Shield, Info, Receipt, IndianRupee } from 'lucide-react';
//import { RazorOrderSliceProps } from './ModalServiceProps';
// --------------------
// modalSlice (RTK)
// --------------------
// usually shoould not include service propogation from Modals as they stall session and can cause breaks 
import { changeTab } from '../../../redux/slices/miscSlice';
const initialState = {
    visible: false,
    type: "info",
    title: "",
    message: "",
    payload: null,
    onConfirm: null, // callback id or serialized info (if you want parent to handle)
};
let globalposition = {};
let exitpositondata = {
    showSymbolModal: "",
    setShowSymbolModal: () => { },
    setIsVisible: () => { },
    setIsScheduled: () => { },
    setSelectedSymbol: () => { },
    positionSymbol: "",
    productMode: "",
    orderType: "",
    positionQuantity: "",
    positionQty: "",
    positionPrice: "",
    lotSize: "",
    boughtQty: "",
    isVisible: false,
    isScheduled: false,
    selectedSymbol: "",
    setPositionPrice: (p) => { globalposition.positionPrice = p; },
    setPositionQty: (p) => { globalposition.positionQty = p; },
    setProductMode: (p) => { globalposition.productMode = p; },
    setOrderType: (p) => { globalposition.orderType = p; },
    dispatchSellSelected: () => { }
};
let razorpayorder = {
    orderType: "",
    amt: "",
    cur: "",
    recpt: "",
    n1: "en-IN",
    n2: "Life time subscription virtual tradning @onedinaar.com  ",
    show: true,
    amount: '',
    amount_due: '',
    amount_paid: '',
    created_at: '',
    currency: '',
    id: '',
    notes: {
        key1: "",
        key2: "",
    },
    offer_id: '',
    receipt: '',
    status: '',
};
/*  razorpayorder payload
  {"modalType":"razorpayorder","amount":100,"amount_due":100,"amount_paid":0,"attempts":0,"created_at":1777050156,
  "currency":"INR","entity":"order","id":"order_ShPBlTnKBJzY5h","notes":{"key1":"en-IN","key2":"Life time subscription virtual tradning @onedinaar.com  "},
  "offer_id":null,"receipt":"razor_receipt_2026-03-05 22:27:28  ","status":"created"}


  */
export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal(state, action) {
            const { title = "", message = "", type = "info", payload = null, onConfirm = null } = action.payload || {};
            state.visible = true;
            state.title = title;
            state.message = message;
            state.type = type;
            state.payload = payload;
            state.onConfirm = onConfirm;
            console.log(`ModalService showModal :: payload  ${JSON.stringify(payload)}`);
            if (payload !== undefined && payload !== null) {
                //check type is  = existposition 
                let modalType = (payload["modalType"] !== null && payload["modalType"] !== undefined) ? payload["modalType"] : null;
                if (modalType !== null && modalType !== undefined && modalType === "existposition") {
                    let showSymbolModal = payload["showSymbolModal"];
                    let setShowSymbolModal = payload["setShowSymbolModal"];
                    if (typeof setShowSymbolModal === "function") {
                        console.log("Set Show Symbol Modal Function provided ");
                    }
                    let setIsVisible = payload["setIsVisible"];
                    if (typeof setIsVisible === "function") {
                        console.log("Set setIsVisible Function provided ");
                    }
                    let setIsScheduled = payload["setIsScheduled"];
                    if (typeof setIsScheduled === "function") {
                        console.log("Set setIsScheduled Function provided ");
                    }
                    let setSelectedSymbol = payload["setSelectedSymbol"];
                    if (typeof setSelectedSymbol === "function") {
                        console.log("Set setSelectedSymbol Function provided ");
                    }
                    let positionSymbol = payload["positionSymbol"];
                    let productMode = payload["productMode"];
                    let orderType = payload["orderType"];
                    let positionQuantity = payload["position"];
                    exitpositondata.boughtQty = payload["boughtQty"];
                    exitpositondata.showSymbolModal = showSymbolModal;
                    exitpositondata.setShowSymbolModal = setShowSymbolModal;
                    exitpositondata.setIsVisible = setIsVisible;
                    exitpositondata.setIsScheduled = setIsScheduled;
                    exitpositondata.setSelectedSymbol = setSelectedSymbol;
                    exitpositondata.positionSymbol = positionSymbol;
                    exitpositondata.productMode = productMode;
                    exitpositondata.orderType = orderType;
                    exitpositondata.positionQuantity = positionQuantity;
                    exitpositondata.lotSize = payload["lotSize"];
                    exitpositondata.isVisible = payload["isVisible"];
                    exitpositondata.isScheduled = payload["isScheduled"];
                    exitpositondata.selectedSymbol = payload["selectedSymbol"];
                    exitpositondata.dispatchSellSelected = payload["dispatchSellSelected"];
                    globalposition = exitpositondata;
                }
                console.log(`ModalService showModal :: modalType  ${JSON.stringify(modalType)}`);
                // Model Type is RazorPay Order 
                if (modalType !== null && modalType !== undefined && modalType === "razorpayorder") {
                    razorpayorder.amount = payload["amount"];
                    razorpayorder.amount_due = payload["amount_due"];
                    razorpayorder.amount_paid = payload["amount_paid"];
                    razorpayorder.created_at = payload["created_at"];
                    razorpayorder.currency = payload["currency"];
                    razorpayorder.id = payload["id"];
                    razorpayorder.notes = payload["notes"];
                    razorpayorder.offer_id = payload["offer_id"];
                    razorpayorder.receipt = payload["receipt"];
                    razorpayorder.status = payload["status"];
                    razorpayorder.show = true;
                }
            }
            else {
                // hideModal() ;
                showError(({ title: 'Some Error ', message: 'Payment Success, Please reach out support team sales-man@storenotify.in' }));
            }
        },
        showError(state, action) {
            const { title = "Error", message = "An error occurred.", payload = null } = action.payload || {};
            state.visible = true;
            state.title = title;
            state.message = message;
            state.type = "error";
            state.payload = payload;
            state.onConfirm = null;
        },
        hideModal(state) {
            Object.assign(state, initialState);
        },
    },
});
export const { showModal, showError, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
// --------------------
// modalMiddleware (optional helpful piece)
// Automatically shows errors for rejected thunks (RTK createAsyncThunk)
// You can customize this to inspect action.error.message or action.payload
// --------------------
export function createModalMiddleware(options = {}) {
    const { mapRejectedToModal = (action) => ({ title: "Error", message: action.error?.message || "Something went wrong" }) } = options;
    return (storeAPI) => (next) => (action) => {
        // If an action is rejected (common shape from createAsyncThunk), show modal
        if (action?.type?.endsWith("/rejected")) {
            try {
                const modalPayload = mapRejectedToModal(action) || {};
                storeAPI.dispatch(showError(modalPayload));
            }
            catch (err) {
                // swallow middleware errors
                console.error("modalMiddleware error", err);
            }
        }
        return next(action);
    };
}
// --------------------
// ModalRoot component
// Reads modal state from redux and renders a Tailwind modal
// --------------------
export function ModalRoot() {
    const dispatch = useDispatch();
    const modal = useSelector((s) => s.modal || {});
    const modalpayload = useSelector((s) => s.modalpayload || {});
    const modalPayload = useSelector((state) => state.modal?.payload || state.modalpayload?.payload);
    const [razorpayorder, setRazorpayorder] = useState(modal.payload ?? modalpayload.payload);
    const [razorReceipt, showRazorReceipt] = useState(true);
    const dialogRazor = (ise) => {
        const isRazorpayType = modalPayload?.modalType === 'razorpayorder';
        if (isRazorpayType) {
            // forward to PaymentStatusDashboard  or RazorPayReceiptView
            dispatch(changeTab(PROCESSVIRTUALACCOUNT));
        }
        showRazorReceipt(false);
    };
    if (!modal.visible)
        return null;
    const isError = modal.type === "error";
    const isExitPosition = modal.type === "exitposition";
    const isQuitOrder = modal.type === "quitorder";
    const MENUVIRTUALACCOUNT = 'Virtual Account';
    const PROCESSVIRTUALACCOUNT = 'Process Account';
    const close = () => dispatch(hideModal());
    const backdrop = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };
    const sheet = {
        hidden: { y: "100%" },
        visible: {
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        exit: { y: "100%" },
    };
    const confirm = () => {
        // If parent provided onConfirm (string or function id), you can handle it here
        // For simple apps, you might pass a callback via a ref registry. We'll just hide for now.
        if (typeof modal.onConfirm === "function") {
            try {
                modal.onConfirm(modal.payload);
            }
            catch (e) {
                console.error(e);
            }
        }
        dispatch(hideModal());
    };
    const sellPositionDialog = (exitpositondata) => {
        return (_jsx(AnimatePresence, { children: exitpositondata.showSymbolModal && (_jsx(motion.div, { variants: backdrop, initial: "hidden", animate: "visible", exit: "hidden", className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center", onClick: exitpositondata.setShowSymbolModal(false), children: _jsxs(motion.div, { variants: sheet, initial: "hidden", animate: "visible", exit: "exit", onClick: (e) => { e.stopPropagation(); exitpositondata.setSelectedSymbol(exitpositondata.positionSymbol); }, className: "bg-white w-full md:w-[400px] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Exit Position" }), _jsx("p", { className: "text-[11px] text-gray-500 uppercase tracking-wider font-semibold", children: "Sell Order Ticket" })] }), _jsx("button", { onClick: () => { exitpositondata.setShowSymbolModal(false); exitpositondata.setIsVisible(false); }, className: "p-2 hover:bg-gray-200 rounded-full transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-400" }) })] }), _jsxs("div", { className: "p-5 space-y-5 max-h-[85vh] overflow-y-auto", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-tight", children: "Order Type" }), _jsx("div", { className: "flex bg-gray-100 p-1 rounded-lg", children: ['Market', 'Limit'].map((t) => (_jsx("button", { onClick: () => exitpositondata.setOrderType(t), className: `flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${exitpositondata.orderType === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`, children: t }, t))) })] }), _jsx("div", { className: "space-y-2", children: _jsxs("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-tight", children: ["   ", exitpositondata.positionSymbol] }) }), "  ", _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-gray-400 uppercase tracking-tight", children: "Product" }), _jsx("div", { className: "flex bg-gray-100 p-1 rounded-lg", children: ['MARGIN', 'CNC'].map((p) => (_jsx("button", { onClick: () => exitpositondata.setProductMode(p), className: `flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${exitpositondata.productMode === p ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`, children: p }, p))) })] })] }), _jsxs("div", { className: "space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("label", { className: "text-xs font-bold text-gray-600 flex items-center gap-1", children: [_jsx(Zap, { size: 14, className: "text-orange-400" }), " Quantity"] }), _jsx("span", { className: "text-sm font-mono  font-bold text-gray-800", children: exitpositondata.positionQty })] }), _jsx("input", { type: "range", min: "0", step: exitpositondata.lotSize, max: exitpositondata.boughtQty, value: exitpositondata.positionQty, onChange: (e) => exitpositondata.setPositionQty(Number(e.target.value)), className: "w-full h-1.5 bg-gray-200 rounded-lg mobile-margin-qty appearance-none cursor-pointer accent-red-500" }), _jsxs("div", { className: "flex justify-between text-[10px] text-gray-400 font-medium", children: [_jsx("span", { children: "0" }), _jsxs("span", { children: ["Max: ", exitpositondata.boughtQty] })] })] }), _jsxs("div", { className: `space-y-3 p-4 rounded-xl border transition-all ${exitpositondata.orderType === 'Market' ? 'opacity-40 bg-gray-100' : 'bg-gray-50 border-gray-100'}`, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("label", { className: "text-xs font-bold text-gray-600 flex items-center gap-1", children: [_jsx(Shield, { size: 14, className: "text-blue-400" }), " Price"] }), _jsxs("span", { className: "text-sm font-mono  font-bold text-gray-800", children: ["\u20B9 ", exitpositondata.orderType === 'Market' ? '---' : exitpositondata.positionPrice] })] }), _jsx("input", { type: "range", disabled: exitpositondata.orderType === 'Market', min: "0", step: "0.05", max: 1000, value: exitpositondata.positionPrice, onChange: (e) => exitpositondata.setPositionPrice(Number(e.target.value)), className: "w-full h-1.5 bg-gray-200 mobile-margin-price rounded-lg appearance-none cursor-pointer accent-red-500" })] }), _jsxs("div", { onClick: () => exitpositondata.setIsScheduled(!exitpositondata.isScheduled), className: "flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer transition-colors hover:bg-blue-50", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${exitpositondata.isScheduled ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`, children: _jsx(Clock, { size: 18 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-blue-900", children: "Schedule Order" }), _jsx("p", { className: "text-[10px] text-blue-600 font-medium", children: "Execute at market open" })] })] }), _jsx("div", { className: `w-10 h-5 rounded-full relative transition-colors ${exitpositondata.isScheduled ? 'bg-blue-500' : 'bg-gray-300'}`, children: _jsx("div", { className: `absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${exitpositondata.isScheduled ? 'left-6' : 'left-1'}` }) })] }), _jsxs("div", { className: "flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg", children: [_jsx(Info, { size: 14, className: "mt-0.5 shrink-0" }), _jsxs("p", { children: ["Approx. transaction value will be ", _jsxs("span", { className: "font-bold text-gray-700", children: ["\u20B9 ", (exitpositondata.positionQty * exitpositondata.positionPrice).toLocaleString()] }), ". Charges are applicable as per your plan."] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: () => { exitpositondata.setShowSymbolModal(false); exitpositondata.setIsVisible(false); }, className: "flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors", children: "Cancel" }), _jsxs("button", { onClick: exitpositondata.dispatchSellSelected, disabled: exitpositondata.positionQty <= 0, className: `flex-[2] py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95
                      ${exitpositondata.positionQty > 0 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`, children: [_jsx(CheckCircle, { size: 18 }), "Confirm Sell"] })] })] })] }) })) }));
    };
    // { razorpayorder, setShowModal } : { razorpayorder:any , setShowModal:any }
    const razorPayDialog = (razorpayorder, setShowModal) => {
        //  if (!razorpayorder) return null;
        console.log(` `);
        console.log(` `);
        console.log(` razorPayDialog   ${JSON.stringify(razorpayorder)}`);
        const isSuccess = razorpayorder.status === "paid" || razorpayorder.status === "created" ||
            razorpayorder.status === "captured";
        return (_jsx(AnimatePresence, { children: razorpayorder?.show && razorReceipt && (_jsx(motion.div, { variants: backdrop, initial: "hidden", animate: "visible", exit: "hidden", className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center", onClick: () => setShowModal(false), children: _jsxs(motion.div, { variants: sheet, initial: "hidden", animate: "visible", exit: "exit", onClick: (e) => { e.stopPropagation(); /*razorpayorder.show = false;*/ }, className: "bg-white w-full md:w-[380px] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between bg-slate-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Receipt, { size: 18, className: "text-indigo-500" }), _jsx("h2", { className: "text-sm font-bold text-gray-800", children: "Payment Receipt" })] }), _jsx("button", { onClick: () => {
                                        setShowModal(false);
                                        /*razorpayorder.show = false;*/ 
                                    }, className: "p-1 hover:bg-gray-200 rounded-full", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-4 space-y-4 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Status" }), _jsxs("span", { className: `flex items-center gap-1 font-semibold ${isSuccess ? "text-green-600" : "text-orange-500"}`, children: [isSuccess ? _jsx(CheckCircle, { size: 16 }) : _jsx(Clock, { size: 16 }), razorpayorder.status || "Pending"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Amount" }), _jsxs("span", { className: "font-bold text-lg flex items-center gap-1", children: [_jsx(IndianRupee, { size: 16 }), (razorpayorder.amount / 100).toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Receipt" }), _jsx("span", { className: "font-mono text-xs text-gray-700", children: razorpayorder.receipt })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Order ID" }), _jsx("span", { className: "font-mono text-xs text-gray-700 truncate max-w-[180px] text-right", children: razorpayorder.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Description" }), _jsx("span", { className: "text-xs text-gray-700 text-right max-w-[180px]", children: razorpayorder.notes?.key2 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Created" }), _jsx("span", { className: "text-xs text-gray-700", children: new Date(razorpayorder.created_at * 1000).toLocaleString() })] }), _jsxs("div", { className: "border-t pt-3 flex justify-between font-semibold", children: [_jsx("span", { children: "Total Paid" }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(IndianRupee, { size: 14 }), "   ", (razorpayorder.amount / 100).toFixed(2)] })] }), _jsx("button", { onClick: () => {
                                        // this shall change the menu tab before this dialog is close 
                                        dispatch(changeTab(MENUVIRTUALACCOUNT));
                                        setShowModal(false);
                                        /*razorpayorder.show = false;*/ 
                                    }, className: "w-full mt-2 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition", children: "Proceed Virtual Account" })] })] }) })) }));
    };
    return (_jsx(_Fragment, { children: (modal.payload !== undefined && modal.payload !== null) && modal.payload?.modalType === 'exitposition' ? (sellPositionDialog(modal.payload)) : ((modal.payload !== undefined && modal.payload !== null) && modal.payload?.modalType === 'razorpayorder' ? (razorPayDialog(modal.payload ?? modalpayload.payload, dialogRazor)) : (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50", onClick: close }), _jsxs("div", { className: "relative w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-xl overflow-hidden", children: [_jsx("div", { className: `px-4 py-2 sm:px-6 sm:py-3 border-b ${isError ? "bg-red-50" : "bg-gray-50"}`, children: _jsx("h3", { className: "text-base sm:text-lg font-semibold text-gray-800", children: modal.title }) }), _jsx("div", { className: "px-4 py-3 sm:p-6", children: _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", children: modal.message }) }), _jsxs("div", { className: "flex items-center justify-end gap-2 px-4 py-2 sm:px-6 sm:py-3 border-t", children: [_jsx("button", { onClick: close, className: "px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200", children: "Close" }), _jsx("button", { onClick: confirm, className: `px-3 py-1.5 rounded-md text-sm font-semibold ${isError
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "bg-blue-600 text-white hover:bg-blue-700"}`, children: isError ? "Dismiss" : "OK" })] })] })] }))) }));
}
