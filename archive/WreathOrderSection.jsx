/**
 * ARCHIVE: Holiday Wreath Storefront & Scout Canvassing Kit
 * Troop 170 Unionville, CT
 * 
 * Preserved for future holiday seasons. This file contains the complete
 * 2026 pricing catalog, Google Apps Script submission pipeline, order state,
 * order confirmation view, and QR code badge lanyard generator modal.
 */

import React, { useState } from 'react';
import { 
  Flame, QrCode, CheckCircle, Check, Copy, CreditCard, Utensils, 
  MinusCircle, PlusCircle, Printer, X 
} from 'lucide-react';

export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCynuJmNFE8m19REtdu1J5YM5m3C5RPtr5fOf9qBSSzak9lsISXJq5HK2KWQMCw1u2/exec";

export const WREATH_PRODUCTS = [
  {
    id: 'wreath24Plain',
    size: '24"',
    title: '24" Classic Undecorated',
    desc: 'Fresh fragrant balsam fir. Standard front door size to display natural greenery or decorate yourself.',
    price: 22,
    img: '/images/wreaths/24Undecorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wreath24Dec',
    size: '24"',
    title: '24" Deluxe Decorated',
    desc: 'Fresh balsam fir adorned with natural Maine pinecones and a hand-tied weatherproof red velvet bow.',
    price: 27,
    img: '/images/wreaths/24Decorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wreath30Plain',
    size: '30"',
    title: '30" Classic Undecorated',
    desc: 'Full, lush fragrant greenery crafted for larger entry doors, double doors, and broad wall displays.',
    price: 32,
    img: '/images/wreaths/30Undecorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wreath30Dec',
    size: '30"',
    title: '30" Deluxe Decorated',
    desc: 'Grand 30-inch wreath trimmed with natural pinecones and an accented handcrafted festive red bow.',
    price: 37,
    img: '/images/wreaths/30Decorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wreath40Plain',
    size: '40"',
    title: '40" Estate Undecorated',
    desc: 'Substantial estate-scale balsam wreath tailored for chimneys, large exterior gables, and commercial facades.',
    price: 55,
    img: '/images/wreaths/40Undecorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wreath40Dec',
    size: '40"',
    title: '40" Estate Decorated',
    desc: 'Show-stopping estate centerpiece trimmed with clusters of natural pinecones and an oversized red structural bow.',
    price: 70,
    img: '/images/wreaths/40Decorated.jpg',
    fallback: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80'
  }
];

export const SCOUT_ROSTER = [
  "General Troop 170 Fund / Don't Know",
  "Aadhav C.", "Aarnav S.", "Adam S.", "Alexander F.", "Andrew H.", "Andrew S.", "Andrew T.",
  "Ayan S.", "Bennett L.", "Carter O.", "Chiru M.", "Christopher H.", "Claire B." , "Connor N.",
  "Devin N.", "Devlin M.", "Devyaan B.", "Divij A.", "Doug P.", "Evelyn F." , "Gabriel C.",
  "Gabriel M.", "Jack H." , "Jack M.", "Jackson K.", "Jack P.", "Jacob S.", "James D.", "James M.", "John H.",
  "Ketann S.", "Kiernan W.", "Lucas Gu.", "Liam M.", "Lucas Gl.", "Luke W.", "Mason T.", "Nathan C.",
  "Nathaniel D.", "Nicholas B.", "Oliver M.", "Parker F." , "Pranav Tej M.",
  "Reyansh B.", "Ricky G." , "Rithvik G.", "Riyan P.", "Ronan B.", "Ryan D.", "Sebastian C.", "Seth K.",
  "Shaurya K.", "Sheldon H.", "Theo A.", "Toshan N.", "Wesley F.", "Yveson H."
];

export default function WreathOrderSection() {
  const [wreathQuantities, setWreathQuantities] = useState({
    wreath24Plain: 0,
    wreath24Dec: 0,
    wreath30Plain: 0,
    wreath30Dec: 0,
    wreath40Plain: 0,
    wreath40Dec: 0,
  });

  const [wreathCustomer, setWreathCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    scoutName: "General Troop 170 Fund / Don't Know",
    paymentMethod: 'Venmo',
  });

  const [wreathLoading, setWreathLoading] = useState(false);
  const [wreathSubmittedOrder, setWreathSubmittedOrder] = useState(null);
  const [wreathError, setWreathError] = useState('');
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [showLanyardModal, setShowLanyardModal] = useState(false);

  const updateWreathQty = (id, delta) => {
    setWreathQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (parseInt(prev[id], 10) || 0) + delta)
    }));
  };

  const setWreathDirectQty = (id, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const val = parseInt(sanitized, 10);
    setWreathQuantities(prev => ({
      ...prev,
      [id]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  const calculateWreathTotal = () => {
    return WREATH_PRODUCTS.reduce((sum, item) => sum + ((parseInt(wreathQuantities[item.id], 10) || 0) * item.price), 0);
  };

  const calculateWreathTotalUnits = () => {
    return Object.values(wreathQuantities).reduce((sum, qty) => sum + (parseInt(qty, 10) || 0), 0);
  };

  const handleCopyText = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMemo(true);
        setTimeout(() => setCopiedMemo(false), 2000);
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleWreathOrderSubmit = async (e) => {
    e.preventDefault();
    const totalDue = calculateWreathTotal();
    const totalUnits = calculateWreathTotalUnits();

    if (totalUnits === 0) {
      setWreathError("Please select at least one wreath before submitting your order.");
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setWreathLoading(true);
    setWreathError('');

    const clientReceiptId = "TRP-" + Math.floor(1000 + Math.random() * 9000);

    const payload = {
      ...wreathCustomer,
      ...wreathQuantities,
      supporterName: `${wreathCustomer.firstName.trim()} ${wreathCustomer.lastName.trim()}`,
      totalCost: totalDue,
      totalUnits: totalUnits,
      receiptId: clientReceiptId
    };

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          cache: "no-cache",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      }

      setWreathSubmittedOrder({
        ...payload,
        receiptId: clientReceiptId
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error("Submission error:", err);
      setWreathError("Error submitting your order. Please check your connection or contact the troop.");
    } finally {
      setWreathLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-24 sm:pb-32 min-h-screen">
      {/* Header Hero */}
      <div className="relative pt-20 pb-24 sm:pt-24 sm:pb-28 px-4 sm:px-8 lg:px-12 text-center text-white overflow-hidden" style={{ backgroundColor: "#0e2b19" }}>
        <div className="absolute inset-0 z-0 opacity-25">
          <img src="/images/wreaths/24Decorated.jpg" alt="Evergreen Wreaths" className="w-full h-full object-cover blur-sm" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e2b19]/90 via-[#0e2b19]/85 to-gray-50"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-6 border border-white/15">
            <Flame size={14} className="text-amber-400" />
            <span className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase text-emerald-100">Troop 170&apos;s Primary Annual Fundraiser</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6">
            Annual Holiday Wreath Sale
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Fragrant, fresh-cut Maine balsam fir wreaths hand-delivered directly to your porch by our Scouts. Every wreath sold directly funds summer camp, high adventure treks (Philmont, Sea Base), and essential outdoor troop equipment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowLanyardModal(true)} 
              className="inline-flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/20 transition-colors"
            >
              <QrCode size={16} />
              <span>Scout QR Lanyard Kit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ORDER PROCESSOR OR CONFIRMATION SCREEN */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 -mt-6 sm:-mt-10 relative z-20">
        
        {wreathSubmittedOrder ? (
          /* --- ORDER CONFIRMED RECEIPT VIEW --- */
          <div className="bg-white rounded-none border-t-8 border-[#143d23] p-6 sm:p-12 shadow-2xl">
            <div className="text-center pb-6 sm:pb-8 border-b border-gray-100 mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#143d23]">Order Successfully Placed</span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mt-1 mb-2">Thank You for Supporting Troop 170!</h2>
              <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">A confirmation receipt has been dispatched to <strong>{wreathSubmittedOrder.email}</strong>.</p>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-gray-50 p-6 sm:p-8 border border-gray-200 mb-8 sm:mb-10">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Order Identifier</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#143d23] tracking-tight">{wreathSubmittedOrder.receiptId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Amount Due</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#BE1E2D]">${wreathSubmittedOrder.totalCost}</span>
                </div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Supporter</span>
                  <strong className="text-gray-900">{wreathSubmittedOrder.supporterName}</strong>
                  <p className="text-gray-500 text-xs mt-0.5">{wreathSubmittedOrder.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Credited Scout</span>
                  <strong className="text-gray-900">{wreathSubmittedOrder.scoutName}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Delivery Address</span>
                  <strong className="text-gray-900">{wreathSubmittedOrder.address}</strong>
                </div>
              </div>
            </div>

            {/* Payment Routing Notice */}
            <div className="border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-10">
              {wreathSubmittedOrder.paymentMethod === 'Venmo' ? (
                <div>
                  <div className="flex items-center space-x-3 text-[#008CFF] font-black text-sm uppercase tracking-wider mb-3">
                    <span>Final Step: Complete Venmo Transfer</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                    To guarantee your wreaths are reserved and routed to the wholesale roster, please transfer <strong>${wreathSubmittedOrder.totalCost}</strong> to our troop&apos;s official Venmo account: <strong>@Troop170Unionville</strong>.
                  </p>
                  
                  <div className="bg-blue-50/60 border border-blue-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block mb-1">Required Venmo Memo Note:</span>
                      <code className="text-xs sm:text-sm font-mono font-bold text-blue-900 select-all">
                        Wreath - {wreathSubmittedOrder.receiptId} - {wreathCustomer.lastName.trim()}
                      </code>
                    </div>
                    <button 
                      onClick={() => handleCopyText(`Wreath - ${wreathSubmittedOrder.receiptId} - ${wreathCustomer.lastName.trim()}`)}
                      className="px-4 py-2 bg-[#008CFF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-colors shrink-0"
                    >
                      {copiedMemo ? <Check size={14}/> : <Copy size={14}/>}
                      <span>{copiedMemo ? 'Copied' : 'Copy Memo'}</span>
                    </button>
                  </div>

                  <a 
                    href="https://venmo.com/Troop170Unionville" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-[#008CFF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md"
                  >
                    <span>Launch Venmo to Pay ${wreathSubmittedOrder.totalCost}</span>
                  </a>
                </div>
              ) : wreathSubmittedOrder.paymentMethod === 'Check' ? (
                <div>
                  <div className="flex items-center space-x-3 text-[#1D3A6C] font-black text-sm uppercase tracking-wider mb-3">
                    <CreditCard size={18} />
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900">Check Payment Instructions</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                    Please make checks payable to: <strong>BSA Troop 170</strong> for <strong>${wreathSubmittedOrder.totalCost}</strong>.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <strong>Required on Memo Line:</strong> <code className="bg-gray-100 px-2 py-0.5 font-bold">Wreath - {wreathSubmittedOrder.receiptId} - {wreathSubmittedOrder.scoutName}</code>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
                    Hand check directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been placed, or mail to:<br/>
                    <em>Troop 170 Treasurer • First Church of Christ • 61 Main St, Unionville, CT 06085</em>
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 text-[#143d23] font-black text-sm uppercase tracking-wider mb-3">
                    <Utensils size={18} />
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900">Cash Payment Instructions</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Please provide <strong>${wreathSubmittedOrder.totalCost}</strong> in cash directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been entered.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    <strong>Important:</strong> Provide receipt number <strong>{wreathSubmittedOrder.receiptId}</strong> to the Scout so they can write it on their sealed troop cash collection envelope.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  setWreathSubmittedOrder(null);
                  setWreathQuantities({
                    wreath24Plain: 0,
                    wreath24Dec: 0,
                    wreath30Plain: 0,
                    wreath30Dec: 0,
                    wreath40Plain: 0,
                    wreath40Dec: 0,
                  });
                  setWreathCustomer({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    address: '',
                    scoutName: SCOUT_ROSTER[0],
                    paymentMethod: 'Venmo',
                  });
                }} 
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black uppercase text-xs tracking-widest transition-colors text-center"
              >
                Place Another Wreath Order
              </button>
            </div>
          </div>
        ) : (
          /* --- ORDER ENTRY FORM --- */
          <form onSubmit={handleWreathOrderSubmit} className="space-y-8 sm:space-y-12 pb-16">
            
            {wreathError && (
              <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-900 text-sm font-bold shadow-md">
                {wreathError}
              </div>
            )}

            {/* 1. PRODUCT SELECTION GRID */}
            <div className="bg-white p-6 sm:p-10 shadow-xl border-t-4 border-[#143d23]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 mb-8 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#143d23] block mb-1">Step 1</span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900">Select Wreath Sizes & Styles</h2>
                </div>
                <div className="text-xs uppercase font-bold text-gray-500">
                  Selected: <span className="font-black text-base text-[#143d23]">{calculateWreathTotalUnits()}</span> Items
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {WREATH_PRODUCTS.map(product => {
                  const qty = wreathQuantities[product.id];
                  return (
                    <div 
                      key={product.id} 
                      className={`border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white ${qty > 0 ? 'border-[#143d23] shadow-lg scale-[1.01]' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div>
                        <div className="relative h-56 sm:h-64 bg-gray-100 overflow-hidden group">
                          <img 
                            src={product.img} 
                            alt={product.title} 
                            onError={(e) => { e.target.src = product.fallback; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-3 left-3 bg-[#143d23] text-white px-3 py-1 font-black text-xs uppercase tracking-widest shadow-md">
                            {product.size} Ring
                          </div>
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#BE1E2D] px-3.5 py-1 font-black text-base uppercase tracking-tight shadow-md">
                            ${product.price}
                          </div>
                        </div>

                        <div className="p-5 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
                            {product.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light mb-4">
                            {product.desc}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 bg-gray-50/60 mt-auto">
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-xs font-black uppercase tracking-wider text-gray-700">Quantity</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateWreathQty(product.id, -1)}
                              className="p-1.5 text-gray-400 hover:text-red-700 transition-colors disabled:opacity-30"
                              disabled={qty === 0}
                            >
                              <MinusCircle size={22} />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={qty}
                              onChange={(e) => setWreathDirectQty(product.id, e.target.value)}
                              className="w-12 h-9 text-center font-black text-base text-gray-900 border border-gray-300 rounded bg-white focus:outline-none focus:border-[#143d23]"
                            />
                            <button
                              type="button"
                              onClick={() => updateWreathQty(product.id, 1)}
                              className="p-1.5 text-gray-400 hover:text-[#143d23] transition-colors"
                            >
                              <PlusCircle size={22} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. RECIPIENT & DELIVERY DETAILS */}
            <div className="bg-white p-6 sm:p-10 shadow-xl border-t-4 border-[#143d23]">
              <div className="pb-6 border-b border-gray-100 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#143d23] block mb-1">Step 2</span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900">Your Contact & Delivery Location</h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Our Scouts hand-deliver directly to porches in Unionville, Farmington, and adjacent towns.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">First Name *</label>
                  <input
                    required
                    type="text"
                    value={wreathCustomer.firstName}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, firstName: e.target.value})}
                    placeholder="Jane"
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={wreathCustomer.lastName}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, lastName: e.target.value})}
                    placeholder="Doe"
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Email (Receipt Destination) *</label>
                  <input
                    required
                    type="email"
                    value={wreathCustomer.email}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, email: e.target.value})}
                    placeholder="janedoe@example.com"
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Phone Number (Delivery Notifications) *</label>
                  <input
                    required
                    type="tel"
                    value={wreathCustomer.phone}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, phone: e.target.value})}
                    placeholder="860-555-0199"
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Full Porch Delivery Address (Street, Town, State, Zip) *</label>
                  <textarea
                    required
                    rows="2"
                    value={wreathCustomer.address}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, address: e.target.value})}
                    placeholder="123 River Road, Unionville, CT 06085"
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Credit A Specific Scout (Funds their summer camp dues)</label>
                  <select
                    value={wreathCustomer.scoutName}
                    onChange={(e) => setWreathCustomer({...wreathCustomer, scoutName: e.target.value})}
                    className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#143d23] outline-none"
                  >
                    {SCOUT_ROSTER.map((name, i) => (
                      <option key={i} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. PAYMENT SELECTION & SUBMIT BUTTON */}
            <div className="bg-white p-6 sm:p-10 shadow-xl border-t-4 border-[#143d23]">
              <div className="pb-6 border-b border-gray-100 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#143d23] block mb-1">Step 3</span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-gray-900">Select Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Venmo */}
                <label className={`p-4 sm:p-6 border-2 cursor-pointer transition-all flex items-start space-x-3 sm:space-x-4 ${wreathCustomer.paymentMethod === 'Venmo' ? 'border-[#008CFF] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Venmo" 
                    checked={wreathCustomer.paymentMethod === 'Venmo'} 
                    onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                    className="mt-1" 
                  />
                  <div>
                    <strong className="block text-gray-900 text-sm sm:text-base uppercase font-black">Venmo Transfer</strong>
                    <span className="text-xs text-[#008CFF] font-bold block mt-0.5">@Troop170Unionville</span>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">Instant mobile payment. Direct instructions & memo code provided upon checkout.</p>
                  </div>
                </label>

                {/* Check */}
                <label className={`p-4 sm:p-6 border-2 cursor-pointer transition-all flex items-start space-x-3 sm:space-x-4 ${wreathCustomer.paymentMethod === 'Check' ? 'border-[#1D3A6C] bg-slate-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Check" 
                    checked={wreathCustomer.paymentMethod === 'Check'} 
                    onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                    className="mt-1" 
                  />
                  <div>
                    <strong className="block text-gray-900 text-sm sm:text-base uppercase font-black">Check</strong>
                    <span className="text-xs text-gray-700 font-bold block mt-0.5">Payable to: BSA Troop 170</span>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">Hand directly to your credited Scout or mail to the church address on your receipt.</p>
                  </div>
                </label>

                {/* Cash */}
                <label className={`p-4 sm:p-6 border-2 cursor-pointer transition-all flex items-start space-x-3 sm:space-x-4 ${wreathCustomer.paymentMethod === 'Cash' ? 'border-[#143d23] bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash" 
                    checked={wreathCustomer.paymentMethod === 'Cash'} 
                    onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                    className="mt-1" 
                  />
                  <div>
                    <strong className="block text-gray-900 text-sm sm:text-base uppercase font-black">Cash</strong>
                    <span className="text-xs text-emerald-800 font-bold block mt-0.5">Exact Amount Preferred</span>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">Hand sealed cash envelope directly to your credited Scout with receipt #.</p>
                  </div>
                </label>
              </div>

              {/* Order Footer & Submit Bar */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Total Amount Due</span>
                  <div className="text-3xl sm:text-5xl font-black text-[#BE1E2D] tracking-tight">
                    ${calculateWreathTotal()}
                    <span className="text-xs text-gray-500 font-bold ml-2">({calculateWreathTotalUnits()} Wreaths)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={wreathLoading}
                  className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-[#143d23] hover:bg-[#0e2b19] text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50 text-center"
                >
                  {wreathLoading ? 'Processing...' : `Confirm & Place Order`}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>

      {/* --- SCOUT LANYARD QR CARD MODAL --- */}
      {showLanyardModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" onClick={() => setShowLanyardModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl p-5 sm:p-10 shadow-2xl rounded-none border-t-8 border-[#143d23] my-8">
            <button onClick={() => setShowLanyardModal(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-900 transition-colors">
              <X size={24}/>
            </button>
            
            <div className="text-center mb-6 sm:mb-8 pr-6 pl-2">
              <span className="text-[#BE1E2D] font-black uppercase tracking-[0.25em] text-[10px] block mb-1">Scout Canvassing Kit</span>
              <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">QR Code Lanyard Generator</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Print these QR codes for the double-sided scout badge lanyards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
              {/* QR 1: Website */}
              <div className="bg-gray-50 p-4 sm:p-6 border border-gray-200 text-center flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#143d23] mb-2 sm:mb-3">Front: Wreath Store</span>
                <div className="w-36 h-36 sm:w-48 sm:h-48 bg-white p-2 border border-gray-200 shadow-sm flex items-center justify-center mb-2 sm:mb-3">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Ftroop170.org" 
                    alt="Storefront QR" 
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold">Points to troop170.org</p>
              </div>

              {/* QR 2: Venmo */}
              <div className="bg-blue-50/50 p-4 sm:p-6 border border-blue-200 text-center flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#008CFF] mb-2 sm:mb-3">Back: Direct Venmo</span>
                <div className="w-36 h-36 sm:w-48 sm:h-48 bg-white p-2 border border-blue-200 shadow-sm flex items-center justify-center mb-2 sm:mb-3">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fvenmo.com%2FTroop170Unionville" 
                    alt="Venmo QR" 
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-blue-900 font-bold">@Troop170Unionville</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button" 
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (!printWin) {
                    alert("Please allow pop-ups to print the lanyard cards.");
                    return;
                  }
                  printWin.document.write(`
                    <html>
                      <head>
                        <title>Troop 170 - Lanyard QR Codes</title>
                        <style>
                          body { font-family: sans-serif; text-align: center; padding: 40px; }
                          .qr-container { display: flex; justify-content: center; gap: 40px; margin-top: 30px; }
                          .card { border: 2px dashed #333; padding: 20px; width: 220px; }
                          h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; }
                          p { font-size: 11px; margin-bottom: 0; }
                        </style>
                      </head>
                      <body>
                        <h2>TROOP 170 WREATH SALE LANYARD CARDS</h2>
                        <div class="qr-container">
                          <div class="card">
                            <h3>Front: Order Store</h3>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Ftroop170.org" width="180" height="180" />
                            <p>Scan to place online order</p>
                          </div>
                          <div class="card">
                            <h3>Back: Troop Venmo</h3>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fvenmo.com%2FTroop170Unionville" width="180" height="180" />
                            <p>@Troop170Unionville</p>
                          </div>
                        </div>
                        <script>window.onload = () => { window.print(); }</script>
                      </body>
                    </html>
                  `);
                  printWin.document.close();
                }}
                className="flex-1 py-3.5 bg-[#143d23] hover:bg-[#0e2b19] text-white font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Printer size={16}/> <span>Print Lanyard Cards</span>
              </button>
              <button 
                type="button" 
                onClick={() => setShowLanyardModal(false)} 
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black uppercase tracking-widest text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
