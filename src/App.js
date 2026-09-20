import React, { useState } from 'react';
import { 
  Trees, 
  ShoppingBag, 
  Award, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  ChevronDown, 
  CreditCard, 
  Smartphone, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // NAVIGATION STATE
  const [activeTab, setActiveTab] = useState('wreaths');

  // JOIN FORM STATE
  const [joinSuccess, setJoinSuccess] = useState(false);

  // ACCORDION ARCHIVE STATE
  const [openArchiveId, setOpenArchiveId] = useState(null);
  const toggleArchive = (id) => {
    setOpenArchiveId(prev => prev === id ? null : id);
  };

  // --- WREATH STOREFRONT STATE ---
  // Replace with your active Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby...YOUR_DEPLOYED_ID.../exec";

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
    scoutName: 'General Troop 170 Fund / Don\'t Know',
    paymentMethod: 'Venmo',
  });

  const [wreathLoading, setWreathLoading] = useState(false);
  const [wreathSubmittedOrder, setWreathSubmittedOrder] = useState(null);
  const [wreathError, setWreathError] = useState('');
  const [copiedMemo, setCopiedMemo] = useState(false);

  // WREATH PRODUCTS CATALOG
  const wreathProducts = [
    {
      id: 'wreath24Plain',
      name: '24" Classic Balsam Wreath',
      subtitle: 'Natural & Undecorated',
      price: 22,
      image: '/images/wreaths/24Undecorated.jpg',
      description: 'Hand-crafted fresh fragrant Maine balsam fir. Perfect for adding your own personal holiday decorations.'
    },
    {
      id: 'wreath24Dec',
      name: '24" Deluxe Decorated Wreath',
      subtitle: 'Finished Holiday Classic',
      price: 27,
      image: '/images/wreaths/24Decorated.jpg',
      description: 'Lush balsam fir accented with natural pinecones and a hand-tied weatherproof velvet red bow.'
    },
    {
      id: 'wreath30Plain',
      name: '30" Classic Balsam Wreath',
      subtitle: 'Large Natural Wreath',
      price: 32,
      image: '/images/wreaths/30Undecorated.jpg',
      description: 'Substantial 30-inch diameter outdoor wreath crafted from premium Maine evergreen boughs.'
    },
    {
      id: 'wreath30Dec',
      name: '30" Deluxe Decorated Wreath',
      subtitle: 'Large Decorated Statement',
      price: 37,
      image: '/images/wreaths/30Decorated.jpg',
      description: 'Full 30-inch wreath crowned with natural frosted pinecones and a large vibrant red holiday bow.'
    },
    {
      id: 'wreath40Plain',
      name: '40" Estate Balsam Wreath',
      subtitle: 'Grand Undecorated Showcase',
      price: 55,
      image: '/images/wreaths/40Undecorated.jpg',
      description: 'Magnificent architectural centerpiece built on a heavy-gauge wire frame for grand entrances.'
    },
    {
      id: 'wreath40Dec',
      name: '40" Estate Decorated Wreath',
      subtitle: 'Grand Deluxe Showcase',
      price: 70,
      image: '/images/wreaths/40Decorated.jpg',
      description: 'Our premier estate wreath trimmed with clusters of native pinecones and a statement master bow.'
    }
  ];

  const updateWreathQty = (id, delta) => {
    setWreathQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const setWreathDirectQty = (id, value) => {
    const parsed = parseInt(value, 10);
    setWreathQuantities(prev => ({
      ...prev,
      [id]: isNaN(parsed) || parsed < 0 ? 0 : parsed
    }));
  };

  const calculateWreathTotal = () => {
    return wreathProducts.reduce((sum, item) => {
      return sum + (wreathQuantities[item.id] || 0) * item.price;
    }, 0);
  };

  const calculateWreathTotalUnits = () => {
    return Object.values(wreathQuantities).reduce((a, b) => a + b, 0);
  };

  const handleCopyText = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMemo(true);
        setTimeout(() => setCopiedMemo(false), 2500);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedMemo(true);
        setTimeout(() => setCopiedMemo(false), 2500);
      } catch (err) {
        console.error('Copy fallback failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWreathOrderSubmit = async (e) => {
    e.preventDefault();
    setWreathError('');
    const totalDue = calculateWreathTotal();
    const totalUnits = calculateWreathTotalUnits();

    if (totalUnits === 0) {
      setWreathError('Please add at least one wreath to your order before proceeding.');
      return;
    }

    if (!wreathCustomer.firstName.trim() || !wreathCustomer.lastName.trim() || !wreathCustomer.email.trim() || !wreathCustomer.address.trim()) {
      setWreathError('Please fill in all required contact and delivery fields.');
      return;
    }

    setWreathLoading(true);

    const payload = {
      ...wreathCustomer,
      ...wreathQuantities,
      supporterName: `${wreathCustomer.firstName.trim()} ${wreathCustomer.lastName.trim()}`,
      totalCost: totalDue,
      totalUnits: totalUnits
    };

    if (!GOOGLE_SCRIPT_URL) {
      // Mock local fallback if no endpoint provided
      setTimeout(() => {
        const mockReceipt = "TRP-" + Math.floor(1000 + Math.random() * 9000);
        setWreathSubmittedOrder({
          ...payload,
          receiptId: mockReceipt,
        });
        setWreathLoading(false);
      }, 700);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === 'SUCCESS') {
        setWreathSubmittedOrder({
          ...payload,
          receiptId: result.receiptId || "TRP-CONFIRMED",
        });
      } else {
        setWreathError('Order submission encountered an issue: ' + (result.message || 'Please retry.'));
      }
    } catch (err) {
      setWreathError('Unable to connect to order server. Please check your network connection and try again.');
    } finally {
      setWreathLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans antialiased selection:bg-[#BE1E2D] selection:text-white">
      {/* HEADER / NAVIGATION */}
      <header className="bg-[#143D23] text-white border-b-4 border-[#BE1E2D] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-white p-2 rounded-full shadow-inner">
              <Trees className="text-[#143D23]" size={28} />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight block leading-none">Troop 170</span>
              <span className="text-[10px] tracking-widest text-[#a3d9a5] uppercase font-bold">Unionville, Connecticut</span>
            </div>
          </div>

          <nav className="flex space-x-1 sm:space-x-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors ${activeTab === 'home' ? 'bg-[#BE1E2D] text-white' : 'text-gray-200 hover:bg-[#1f5934]'}`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('wreaths')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors ${activeTab === 'wreaths' ? 'bg-[#BE1E2D] text-white shadow-md' : 'text-gray-200 hover:bg-[#1f5934]'}`}
            >
              Wreath Sale
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors ${activeTab === 'join' ? 'bg-[#BE1E2D] text-white' : 'text-gray-200 hover:bg-[#1f5934]'}`}
            >
              Join
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT ROUTING */}
      <main>
        {activeTab === 'wreaths' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* HERO BANNER */}
            <div className="bg-[#143D23] text-white p-8 sm:p-12 mb-10 shadow-lg border-l-8 border-[#BE1E2D]">
              <span className="text-xs uppercase font-black tracking-widest text-[#a3d9a5] block mb-2">Annual Fundraiser • 2026 Season</span>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">Fresh Maine Balsam Wreaths</h1>
              <p className="text-base sm:text-lg text-emerald-100 max-w-3xl leading-relaxed">
                Handcrafted from fragrant, wild-harvested Maine balsam boughs. Every purchase directly funds outdoor leadership, backcountry equipment, and youth summer camp scholarships for Unionville Troop 170.
              </p>
            </div>

            {/* ORDER CONFIRMED VIEW */}
            {wreathSubmittedOrder ? (
              <div className="bg-white p-8 sm:p-12 shadow-2xl border-t-8 border-[#143D23] max-w-3xl mx-auto my-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#143D23]">
                  <CheckCircle2 size={36} />
                </div>
                <span className="text-xs uppercase font-black tracking-widest text-[#BE1E2D]">Order Successfully Placed</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mt-2 mb-2">
                  Thank You For Supporting Troop 170!
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  A complete confirmation receipt has been dispatched to <strong>{wreathSubmittedOrder.email}</strong>.
                </p>

                {/* RECEIPT SUMMARY */}
                <div className="bg-stone-50 border border-stone-200 p-6 text-left mb-8">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block">Unique Receipt / Order Number</span>
                      <span className="text-2xl font-black text-gray-900">{wreathSubmittedOrder.receiptId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block">Total Due</span>
                      <span className="text-2xl font-black text-[#143D23]">${wreathSubmittedOrder.totalCost}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-700">
                    <div>
                      <strong className="block text-gray-900 uppercase">Supporter</strong>
                      {wreathSubmittedOrder.supporterName}
                      <span className="block text-gray-500">{wreathCustomer.phone}</span>
                    </div>
                    <div>
                      <strong className="block text-gray-900 uppercase">Delivering Scout</strong>
                      {wreathSubmittedOrder.scoutName}
                    </div>
                    <div>
                      <strong className="block text-gray-900 uppercase">Delivery Address</strong>
                      {wreathSubmittedOrder.address}
                    </div>
                    <div>
                      <strong className="block text-gray-900 uppercase">Payment Option</strong>
                      {wreathSubmittedOrder.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* CONDITIONAL PAYMENT INSTRUCTIONS */}
                {wreathSubmittedOrder.paymentMethod === 'Venmo' ? (
                  <div className="bg-blue-50 border-2 border-[#008CFF]/30 p-6 sm:p-8 mb-8 text-left text-gray-800 rounded">
                    <div className="flex items-center space-x-3 mb-3">
                      <Smartphone className="text-[#008CFF]" size={28} />
                      <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Action Required: Complete Venmo Payment</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      To guarantee your wreaths are reserved and routed to the wholesale roster, please transfer <strong>${wreathSubmittedOrder.totalCost}</strong> to our troop's official Venmo account: <strong>@Troop170Unionville</strong>.
                    </p>

                    <div className="bg-white p-4 border border-blue-200 mb-6 rounded">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 block mb-1">
                        Required Venmo Memo Note (Used for Back-Office Reconciliation):
                      </span>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded font-mono">
                          Wreath - {wreathSubmittedOrder.receiptId} - {wreathSubmittedOrder.lastName}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`Wreath - ${wreathSubmittedOrder.receiptId} - ${wreathSubmittedOrder.lastName}`)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#008CFF] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded"
                        >
                          {copiedMemo ? <Check size={14}/> : <Copy size={14}/>}
                          <span>{copiedMemo ? 'Copied' : 'Copy Memo'}</span>
                        </button>
                      </div>
                    </div>

                    <a 
                      href="https://venmo.com/u/Troop170Unionville"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-3 w-full py-4 bg-[#008CFF] hover:bg-blue-600 text-white font-black uppercase tracking-widest text-sm transition-colors shadow-lg rounded"
                    >
                      <span>Open @Troop170Unionville on Venmo</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : wreathSubmittedOrder.paymentMethod === 'Check' ? (
                  <div className="bg-slate-50 border-2 border-slate-300 p-6 sm:p-8 mb-8 text-left text-gray-800 rounded">
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="text-[#1D3A6C]" size={28} />
                      <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Check Payment Instructions</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      Please make your check payable to <strong>Troop 170</strong> in the amount of <strong>${wreathSubmittedOrder.totalCost}</strong>.
                    </p>
                    <div className="bg-white p-4 border border-slate-200 mb-4 rounded">
                      <p className="text-xs text-gray-700 m-0">
                        <strong>Required on Memo Line:</strong> <code className="bg-gray-100 px-2 py-0.5 font-bold font-mono">Wreath - {wreathSubmittedOrder.receiptId} - {wreathSubmittedOrder.scoutName}</code>
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Hand the check directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been placed, or mail to:<br/>
                      <strong>First Church of Christ, ATTN: Troop 170 Treasurer, 61 Main St, Unionville, CT 06085</strong>
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-300 p-6 sm:p-8 mb-8 text-left text-gray-800 rounded">
                    <div className="flex items-center space-x-3 mb-3">
                      <CreditCard className="text-amber-700" size={28} />
                      <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Cash Payment Collected With Order</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      Please provide <strong>${wreathSubmittedOrder.totalCost}</strong> in cash directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been entered.
                    </p>
                    <p className="text-xs text-amber-900 bg-amber-100/80 p-3 border border-amber-200 rounded">
                      <strong>Important:</strong> Provide receipt number <strong>{wreathSubmittedOrder.receiptId}</strong> to the Scout so they can write it on their sealed troop cash collection envelope.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setWreathSubmittedOrder(null);
                    setWreathQuantities({
                      wreath24Plain: 0, wreath24Dec: 0,
                      wreath30Plain: 0, wreath30Dec: 0,
                      wreath40Plain: 0, wreath40Dec: 0,
                    });
                  }}
                  className="bg-stone-900 hover:bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded"
                >
                  Place Another Order
                </button>
              </div>
            ) : (
              /* STOREFRONT & ORDER FORM */
              <form onSubmit={handleWreathOrderSubmit} className="space-y-10">
                {/* STEP 1: PRODUCT SELECTION */}
                <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-[#143D23]">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 01</span>
                      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">Select Wreaths</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 uppercase font-bold block">Current Total</span>
                      <span className="text-2xl font-black text-[#143D23]">${calculateWreathTotal()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wreathProducts.map((item) => (
                      <div key={item.id} className="border border-stone-200 rounded overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-64 bg-stone-200 overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback styling if local image file is missing
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-stone-100', 'text-stone-400', 'text-xs', 'font-bold');
                              e.target.parentElement.innerHTML = '<span>Photo Preview: ' + item.name + '</span>';
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-[#143D23] text-white px-3 py-1 text-sm font-black rounded shadow">
                            ${item.price}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#BE1E2D] block">{item.subtitle}</span>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mt-1 mb-2">{item.name}</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-6">{item.description}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                            <span className="text-xs font-bold text-gray-700 uppercase">Quantity</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => updateWreathQty(item.id, -1)}
                                className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-gray-800 flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                min="0" 
                                value={wreathQuantities[item.id] || 0}
                                onChange={(e) => setWreathDirectQty(item.id, e.target.value)}
                                className="w-12 text-center font-bold text-sm border border-stone-300 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#143D23]"
                              />
                              <button
                                type="button"
                                onClick={() => updateWreathQty(item.id, 1)}
                                className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-gray-800 flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STEP 2: CONTACT & DELIVERY INFO */}
                <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-[#143D23]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 02</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 mb-6">Contact & Porch Delivery Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">First Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={wreathCustomer.firstName}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, firstName: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23]" 
                        placeholder="e.g. John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={wreathCustomer.lastName}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, lastName: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23]" 
                        placeholder="e.g. Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">Email Address * (For Confirmation Receipt)</label>
                      <input 
                        type="email" 
                        required 
                        value={wreathCustomer.email}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, email: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23]" 
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={wreathCustomer.phone}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, phone: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23]" 
                        placeholder="(860) 555-0199"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">Home Delivery Address * (Unionville & Surrounding Areas)</label>
                      <input 
                        type="text" 
                        required 
                        value={wreathCustomer.address}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, address: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23]" 
                        placeholder="Street Address, City, State, ZIP"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-gray-700 mb-2">Credited Scout / Seller</label>
                      <select 
                        value={wreathCustomer.scoutName}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, scoutName: e.target.value})}
                        className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#143D23] bg-white"
                      >
                        <option value="General Troop 170 Fund / Don't Know">General Troop 170 Fund / Don't Know</option>
                        <option value="Alexander F.">Alexander F.</option>
                        <option value="Benjamin C.">Benjamin C.</option>
                        <option value="Christian S.">Christian S.</option>
                        <option value="Devlin M.">Devlin M.</option>
                        <option value="Evelyn F.">Evelyn F.</option>
                        <option value="Lucas W.">Lucas W.</option>
                        <option value="Liam B.">Liam B.</option>
                        <option value="Noah H.">Noah H.</option>
                        <option value="Owen D.">Owen D.</option>
                        <option value="Samuel R.">Samuel R.</option>
                        <option value="Zachary K.">Zachary K.</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* STEP 3: PAYMENT METHOD (VENMO, CHECK, CASH) */}
                <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-gray-900">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 03</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {/* OPTION 1: VENMO */}
                    <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 rounded ${wreathCustomer.paymentMethod === 'Venmo' ? 'border-[#008CFF] bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Venmo" 
                        checked={wreathCustomer.paymentMethod === 'Venmo'} 
                        onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                        className="mt-1"
                      />
                      <div>
                        <strong className="block text-gray-900 text-base uppercase font-black">Venmo</strong>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          @Troop170Unionville. Enter your receipt number in the memo line.
                        </p>
                      </div>
                    </label>

                    {/* OPTION 2: CHECK */}
                    <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 rounded ${wreathCustomer.paymentMethod === 'Check' ? 'border-[#1D3A6C] bg-slate-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Check" 
                        checked={wreathCustomer.paymentMethod === 'Check'} 
                        onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                        className="mt-1"
                      />
                      <div>
                        <strong className="block text-gray-900 text-base uppercase font-black">Check</strong>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Payable to "Troop 170" with receipt number on memo line.
                        </p>
                      </div>
                    </label>

                    {/* OPTION 3: CASH */}
                    <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 rounded ${wreathCustomer.paymentMethod === 'Cash' ? 'border-[#143d23] bg-emerald-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Cash" 
                        checked={wreathCustomer.paymentMethod === 'Cash'} 
                        onChange={(e) => setWreathCustomer({...wreathCustomer, paymentMethod: e.target.value})}
                        className="mt-1"
                      />
                      <div>
                        <strong className="block text-gray-900 text-base uppercase font-black">Cash to Scout</strong>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Cash given directly to Scout when placing your order today.
                        </p>
                      </div>
                    </label>
                  </div>

                  {wreathError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm flex items-center space-x-3">
                      <AlertCircle size={20} />
                      <span>{wreathError}</span>
                    </div>
                  )}

                  {/* FINAL SUBMIT BUTTON */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold block">Grand Total Due</span>
                      <span className="text-3xl font-black text-[#143D23]">${calculateWreathTotal()}</span>
                      <span className="text-xs text-gray-500 block">({calculateWreathTotalUnits()} items selected)</span>
                    </div>

                    <button
                      type="submit"
                      disabled={wreathLoading}
                      className={`w-full sm:w-auto px-10 py-5 bg-[#BE1E2D] hover:bg-[#991824] text-white font-black uppercase tracking-widest text-sm transition-all shadow-xl rounded flex items-center justify-center space-x-3 ${wreathLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {wreathLoading ? (
                        <span>Submitting Order...</span>
                      ) : (
                        <>
                          <span>Confirm & Place Order</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ABOUT / HOME TAB */}
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 sm:p-12 shadow-xl border-l-8 border-[#143D23] mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#BE1E2D] block mb-2">Chartered Organization</span>
              <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 mb-4">Troop 170 Unionville, CT</h1>
              <p className="text-base text-gray-700 max-w-3xl leading-relaxed mb-6">
                Proudly chartered by the <strong>First Church of Christ in Unionville</strong> since 1956. For nearly seven decades, Troop 170 has delivered youth-led outdoor adventure, character building, and community service across the Farmington Valley.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs">Meeting Time</h4>
                  <p className="text-sm text-gray-600">Thursdays at 7:00 PM</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs">Location</h4>
                  <p className="text-sm text-gray-600">61 Main St, Unionville, CT</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs">Ages Served</h4>
                  <p className="text-sm text-gray-600">Boys & Girls Ages 11 to 17</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JOIN TAB */}
        {activeTab === 'join' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-[#143D23]">
              <span className="text-xs font-black uppercase tracking-widest text-[#BE1E2D] block mb-2">Get Involved</span>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-4">Join Troop 170</h1>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Whether you are crossing over from Cub Scouts or trying Scouting America for the very first time, we welcome all youth ages 11–17.
              </p>

              {joinSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 p-6 text-center text-emerald-900 rounded">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-[#143D23]" />
                  <h3 className="font-black uppercase text-lg">Inquiry Received</h3>
                  <p className="text-xs mt-1">Our Scoutmaster or Committee Chair will reach out to your family shortly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setJoinSuccess(true); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Parent / Guardian Name</label>
                    <input type="text" required className="w-full p-3 border border-stone-300 rounded text-sm" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email Address</label>
                    <input type="email" required className="w-full p-3 border border-stone-300 rounded text-sm" placeholder="parent@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Youth Name & Age</label>
                    <input type="text" required className="w-full p-3 border border-stone-300 rounded text-sm" placeholder="e.g. Alex, Age 12" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#143D23] hover:bg-[#1f5934] text-white font-bold uppercase tracking-widest text-xs transition-colors rounded shadow">
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-20 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div>
            <span className="font-bold text-white uppercase tracking-wider block">Scouting America Troop 170</span>
            <span>First Church of Christ • 61 Main Street, Unionville, CT 06085</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Official Wreath Sales Contact: </span>
            <a href="mailto:Troop170greenssale@gmail.com" className="text-[#a3d9a5] hover:underline">
              Troop170greenssale@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
