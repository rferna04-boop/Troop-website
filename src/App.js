import React, { useState } from 'react';
import { 
  Tent, Lock, ArrowUpRight, MapPin, Mail, Calendar, Phone, 
  Users, Compass, CheckCircle, Clock, 
  MessageCircle, ExternalLink, Medal, Flame, Heart, Key, 
  FileText, Smartphone, CreditCard, ShieldCheck, Download, 
  LogOut, BookOpen, X, Search, Printer, Snowflake, Mountain, 
  Facebook, Sun, Quote, Image as ImageIcon,
  Utensils, ShoppingBag, QrCode, Copy, Check, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProgram, setActiveProgram] = useState(0);
  
  // PORTAL AUTHENTICATION STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // REGISTRATION MODAL STATE
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // SCOUT DOLLAR SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // JOIN FORM STATE
  const [joinSuccess, setJoinSuccess] = useState(false);

  // ACCORDION ARCHIVE STATE
  const [openArchiveId, setOpenArchiveId] = useState(null);
  const toggleArchive = (id) => {
    setOpenArchiveId(prev => prev === id ? null : id);
  };

  // --- WREATH STOREFRONT STATE ---
  // PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE:
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby...YOUR_ACTUAL_ID.../exec"; 

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

  const darkBg = "#0B0F19";

  // 2026 Official Pricing & SKU Catalog
  const WREATH_PRODUCTS = [
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

  const SCOUT_ROSTER = [
    "General Troop 170 Fund / Don't Know",
    "Aadhav C.", "Aarnav S.", "Adam S.", "Alexander F.", "Andrew H.", "Andrew S.", "Andrew T.",
    "Ayan S.", "Bennett L.", "Carter O.", "Chiru Abhinav M.", "Christopher H.", "Connor N.",
    "Daniel G.", "Devin N.", "Devlin M.", "Devyaan B.", "Divij A.", "Doug P.", "Gabriel C.",
    "Gabriel M.", "Jack M.", "Jackson K.", "Jacob S.", "James D.", "James M.", "John H.",
    "Ketann S.", "Kiernan W.", "Liam M.", "Lucas G.", "Luke W.", "Mason T.", "Nathan C.",
    "Nathaniel D.", "Nicholas B.", "Oliver M.", "Parker F.", "Phillip V.", "Pranav Tej M.",
    "Reyansh B.", "Rithvik G.", "Riyan P.", "Ronan B.", "Ryan D.", "Sebastian C.", "Seth K.",
    "Shaurya K.", "Sheldon H.", "Theo A.", "Toshan N.", "Wesley F.", "Yveson H."
  ];

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
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setWreathLoading(true);
    setWreathError('');

    const payload = {
      ...wreathCustomer,
      ...wreathQuantities,
      supporterName: `${wreathCustomer.firstName.trim()} ${wreathCustomer.lastName.trim()}`,
      totalCost: totalDue,
      totalUnits: totalUnits
    };

    if (!GOOGLE_SCRIPT_URL) {
      setTimeout(() => {
        const mockReceiptId = "TRP-" + Math.floor(1000 + Math.random() * 9000);
        setWreathSubmittedOrder({
          ...payload,
          receiptId: mockReceiptId
        });
        setWreathLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const resText = await response.text();
      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch {
        resJson = { status: "SUCCESS", receiptId: "TRP-" + Math.floor(1000 + Math.random() * 9000) };
      }

      if (resJson.status === "SUCCESS") {
        setWreathSubmittedOrder({
          ...payload,
          receiptId: resJson.receiptId
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(resJson.message || "Failed to submit order");
      }
    } catch (err) {
      console.error(err);
      setWreathError("Error submitting your order. Please check your connection or contact the troop.");
    } finally {
      setWreathLoading(false);
    }
  };

  // --- HISTORIAN CMS DATA ---
  const scoutTrailData = [
    {
      id: '2026-08',
      month: 'August',
      year: '2026',
      milestones: ['Sea Base', 'Community Service', 'Unionville Tag Sale', '7 Eagle Projects'],
      heroImg: '/images/scout-corner/2026-08-eagle-workday.jpg',
      heroFallback: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      summary: "August was a month of adventure, service, and exciting opportunities for the troop. Scouts took part in the long-awaited Sea Base high-adventure experience, continued giving back through service projects, and spent time camping and working together at the Unionville Museum tag sale. At the same time, an impressive seven Scouts continued their work toward the rank of Eagle Scout, making August another busy and meaningful month for the troop.",
      quote: "Sea Base was an incredible experience because we got to do so many things together that we normally wouldn't get to do.",
      scoutName: "Troop 170 Scout",
      scoutRank: "Sea Base Crew",
      scoutImg: '/images/scout-corner/sheldon.jpg',
      scoutFallback: 'https://images.unsplash.com/photo-1512641406448-6524e5e10bf1?auto=format&fit=crop&w=400&q=80',
      gallery: [
        '/images/scout-corner/2026-08-eagle-workday.jpg',
        '/images/scout-corner/2026-08-eagle-bench.jpg'
      ],
      galleryFallbacks: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80'
      ]
    }
  ];

  const featuredEntry = scoutTrailData[0];

  const programsList = [
    { id: 0, title: "Scout Rank Advancement", desc: "Progress through the scouting ranks at your own pace with the guidance of experienced mentors and youth leaders.", img: "/images/rank.jpg" },
    { id: 1, title: "Merit Badge Program", desc: "Explore over 140 different subjects from Robotics to First Aid in our active, year-round educational program.", img: "/images/merit.jpg" },
    { id: 2, title: "Monthly Campouts", desc: "Develop outdoor survival skills, patrol camaraderie, and self-reliance during our regular weekend camping trips.", img: "/images/campout.jpg" },
    { id: 3, title: "Community Service", desc: "Giving back to Farmington and Unionville through local conservation, food drives, and extensive Eagle Scout projects.", img: "/images/service.jpg" },
    { id: 4, title: "Summer Camp", desc: "A week of intensive advancement, unparalleled fun, and outdoor bonding at our annual summer camp.", img: "/images/camp.jpg" },
    { id: 5, title: "High Adventure Trekking", desc: "Epic outdoor trips including backpacking, wilderness survival, and annual high-adventure treks across the country.", img: "/images/philmont.jpg" }
  ];

  const upcomingBadges = [
    { id: 101, name: "First Aid", date: "Saturday, Oct 14", time: "9:00 AM - 1:00 PM", counselor: "Dr. Smith", status: "Open", img: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=800&q=80" },
    { id: 102, name: "Citizenship in the Nation", date: "Monday, Oct 23", time: "6:00 PM - 7:00 PM", counselor: "Mr. Johnson", status: "Open", img: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80" },
    { id: 103, name: "Personal Management", date: "Monday, Nov 6", time: "6:00 PM - 7:00 PM", counselor: "Mrs. Davis", status: "Waitlist", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
    { id: 104, name: "Environmental Science", date: "Saturday, Nov 11", time: "10:00 AM - 3:00 PM", counselor: "Mr. Thompson", status: "Full", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" }
  ];

  const scoutAccounts = [
    { id: 1, name: "Alexander T.", balance: 145.50, lastTransaction: "Holiday Wreath Sales (+ $120.00)", date: "Dec 15, 2025" },
    { id: 2, name: "Benjamin C.", balance: 85.00, lastTransaction: "Spring Can Drive (+ $85.00)", date: "Mar 02, 2026" },
    { id: 3, name: "Carter H.", balance: 320.25, lastTransaction: "Summer Camp Deposit (- $150.00)", date: "Feb 20, 2026" },
    { id: 4, name: "Daniel W.", balance: 12.00, lastTransaction: "Weekend Campout Fee (- $25.00)", date: "Jan 10, 2026" },
  ];

  const gearListsData = [
    { 
      id: 1, title: "The 10 Essentials", desc: "The absolute required items for every Scout's daypack, regardless of trip duration.", icon: <Compass size={28} />,
      type: "document",
      content: "<ul style='line-height:1.8;'><li><strong>Pocketknife</strong></li><li><strong>First-Aid Kit</strong></li><li><strong>Extra Clothing</strong></li><li><strong>Rain Gear</strong></li><li><strong>Water Bottle</strong></li><li><strong>Flashlight</strong></li><li><strong>Trail Food</strong></li><li><strong>Fire Starter</strong></li><li><strong>Sun Protection</strong></li><li><strong>Map & Compass</strong></li></ul>",
      plainText: "- Pocketknife\n- First-Aid Kit\n- Extra Clothing\n- Rain Gear\n- Water Bottle\n- Flashlight\n- Trail Food\n- Fire Starter\n- Sun Protection\n- Map and Compass"
    }
  ];

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'wreaths', label: 'Wreath Sale' },
    { id: 'about', label: 'About' },
    { id: 'scoutCorner', label: 'Scout Corner' },
    { id: 'join', label: 'Join' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-[#BE1E2D] selection:text-white">
      {/* HEADER / NAVIGATION */}
      <nav className="text-white relative z-50 border-b border-white/10" style={{ backgroundColor: darkBg }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-24 items-center">
            
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
              <div className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img src="/images/logo.png" className="w-full h-full object-contain" alt="Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Troop 170</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Unionville, CT</p>
              </div>
            </div>

            <div className="hidden md:flex space-x-8 items-center text-base font-bold uppercase tracking-wider text-gray-300">
              {navLinks.map(page => (
                <button 
                  key={page.id} 
                  onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }} 
                  className={`hover:text-white transition-colors relative ${currentPage === page.id ? 'text-white border-b-2 border-[#BE1E2D] pb-1' : ''}`}
                >
                  {page.label}
                  {page.id === 'wreaths' && (
                    <span className="absolute -top-3 -right-6 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black animate-pulse">
                      Sale
                    </span>
                  )}
                </button>
              ))}
              <a href="https://venmo.com/u/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="text-[#008CFF] hover:text-blue-400 transition-colors flex items-center space-x-1.5">
                <Heart size={16}/><span>Donate</span>
              </a>
              <button onClick={() => { setCurrentPage('portal'); window.scrollTo(0,0); }} className="flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-[#BE1E2D] hover:text-white transition-all duration-300 shadow-md rounded-none font-black text-sm tracking-widest">
                <Lock size={16}/><span>Member Login</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* --- HOME PAGE --- */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-700">
            <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: darkBg }}>
              <div className="absolute inset-0 z-0">
                <img src="/images/hero.jpg" alt="Scouts" className="w-full h-full object-cover object-[100%_70%] -scale-x-100 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start">
                <div 
                  onClick={() => { setCurrentPage('wreaths'); window.scrollTo(0,0); }}
                  className="cursor-pointer mb-6 inline-flex items-center space-x-3 bg-emerald-900/80 border border-emerald-400/40 hover:bg-emerald-800/90 text-white px-5 py-2.5 rounded-full transition-all group shadow-lg"
                >
                  <ShoppingBag size={16} className="text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Annual Holiday Wreath Sale Is Live!</span>
                  <ArrowUpRight size={14} className="text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none mb-8 shadow-inner border border-white/5">
                  <Compass size={14} className="text-[#BE1E2D]" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Established 1956</span>
                </div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase max-w-4xl">
                  Transform Youth <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Into Leaders</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl leading-relaxed mb-12">
                  Drive character development, boost outdoor skills, and maximize personal growth. We craft engaging, year-round scouting programs that deliver measurable results.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => { setCurrentPage('wreaths'); window.scrollTo(0,0); }} className="px-10 py-5 bg-[#BE1E2D] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(190,30,45,0.4)] group flex items-center space-x-4 rounded-none">
                    <span>Order Holiday Wreaths</span>
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button onClick={() => { setCurrentPage('join'); window.scrollTo(0,0); }} className="px-8 py-5 bg-white/10 text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white/20 transition-all border border-white/20 rounded-none">
                    <span>Schedule Visit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- HOLIDAY WREATH STOREFRONT PAGE --- */}
        {currentPage === 'wreaths' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in duration-500 min-h-screen">
            {/* Header Hero */}
            <div className="relative pt-24 pb-28 px-6 sm:px-8 lg:px-12 text-center text-white overflow-hidden" style={{ backgroundColor: "#0e2b19" }}>
              <div className="absolute inset-0 z-0 opacity-25">
                <img src="/images/wreaths/24Decorated.jpg" alt="Evergreen Wreaths" className="w-full h-full object-cover blur-sm" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#0e2b19]/90 via-[#0e2b19]/85 to-gray-50"></div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/15">
                  <Flame size={14} className="text-amber-400" />
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-100">Troop 170's Primary Annual Fundraiser</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6">
                  Annual Holiday Wreath Sale
                </h1>
                <p className="text-lg sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed mb-8">
                  Fragrant, fresh-cut Maine balsam fir wreaths hand-delivered directly to your porch by our Scouts. Every wreath sold directly funds summer camp, high adventure treks, and troop equipment.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setShowLanyardModal(true)} 
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/20 transition-colors"
                  >
                    <QrCode size={16} />
                    <span>Scout QR Lanyard Kit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ORDER PROCESSOR OR CONFIRMATION SCREEN */}
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 -mt-10 relative z-20">
              
              {wreathSubmittedOrder ? (
                /* --- ORDER CONFIRMED RECEIPT VIEW --- */
                <div className="bg-white rounded-none border-t-8 border-[#143d23] p-8 sm:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="text-center pb-8 border-b border-gray-100 mb-8">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={36} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#143d23]">Order Successfully Placed</span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mt-1 mb-2">Thank You for Supporting Troop 170!</h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">A confirmation receipt has been dispatched to <strong>{wreathSubmittedOrder.email}</strong>.</p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gray-50 p-6 sm:p-8 border border-gray-200 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block">Unique Receipt / Order Number</span>
                        <span className="text-3xl font-black text-[#143d23] tracking-tight">{wreathSubmittedOrder.receiptId}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block">Total Due</span>
                        <span className="text-3xl font-black text-[#BE1E2D]">${wreathSubmittedOrder.totalCost}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-sm">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Supporter</span>
                        <strong className="text-gray-900">{wreathSubmittedOrder.supporterName}</strong>
                        <p className="text-gray-500 text-xs mt-0.5">{wreathSubmittedOrder.phone}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Delivering Scout</span>
                        <strong className="text-gray-900">{wreathSubmittedOrder.scoutName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Delivery Address</span>
                        <strong className="text-gray-900">{wreathSubmittedOrder.address}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Payment Option</span>
                        <strong className="text-gray-900">{wreathSubmittedOrder.paymentMethod}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC THREE-WAY PAYMENT RECONCILE BOX */}
                  {wreathSubmittedOrder.paymentMethod === 'Venmo' ? (
                    <div className="bg-blue-50 border-2 border-[#008CFF]/30 p-8 mb-8 text-gray-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Smartphone className="text-[#008CFF]" size={28} />
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Action Required: Complete Venmo Payment</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        To guarantee your wreaths are reserved and routed to the wholesale roster, please transfer <strong>${wreathSubmittedOrder.totalCost}</strong> to our troop's official Venmo account: <strong>@Troop170Unionville</strong>.
                      </p>

                      <div className="bg-white p-4 border border-blue-200 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 block mb-1">
                          Required Venmo Memo Note (Used for Back-Office Reconciliation):
                        </span>
                        <div className="flex items-center justify-between gap-4">
                          <code className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded">
                            Wreath - {wreathSubmittedOrder.receiptId} - {wreathCustomer.lastName.trim()}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyText(`Wreath - ${wreathSubmittedOrder.receiptId} - ${wreathCustomer.lastName.trim()}`)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#008CFF] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
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
                        className="inline-flex items-center justify-center space-x-3 w-full py-4 bg-[#008CFF] hover:bg-blue-600 text-white font-black uppercase tracking-widest text-sm transition-colors shadow-lg"
                      >
                        <span>Open @Troop170Unionville on Venmo</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ) : wreathSubmittedOrder.paymentMethod === 'Check' ? (
                    <div className="bg-slate-50 border-2 border-slate-300 p-8 mb-8 text-gray-800">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="text-[#1D3A6C]" size={28} />
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Check Payment Instructions</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Please make your check payable to <strong>Troop 170</strong> in the amount of <strong>${wreathSubmittedOrder.totalCost}</strong>.
                      </p>
                      <div className="bg-white p-4 border border-slate-200 mb-4">
                        <p className="text-xs text-gray-700 m-0">
                          <strong>Required on Memo Line:</strong> <code className="bg-gray-100 px-2 py-0.5 font-bold">Wreath - {wreathSubmittedOrder.receiptId} - {wreathSubmittedOrder.scoutName}</code>
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Hand the check directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been placed, or mail to:<br/>
                        <strong>First Church of Christ, ATTN: Troop 170 Treasurer, 61 Main St, Unionville, CT 06085</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border-2 border-amber-300 p-8 mb-8 text-gray-800">
                      <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="text-amber-700" size={28} />
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Cash Payment Collected With Order</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Please provide <strong>${wreathSubmittedOrder.totalCost}</strong> in cash directly to Scout <strong>{wreathSubmittedOrder.scoutName}</strong> now that your order has been entered.
                      </p>
                      <p className="text-xs text-amber-900 bg-amber-100/80 p-3 border border-amber-200">
                        <strong>Important:</strong> Provide receipt number <strong>{wreathSubmittedOrder.receiptId}</strong> to the Scout so they can record it on their official troop cash collection envelope[cite: 1].
                      </p>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        setWreathSubmittedOrder(null);
                        setWreathQuantities({
                          wreath24Plain: 0, wreath24Dec: 0,
                          wreath30Plain: 0, wreath30Dec: 0,
                          wreath40Plain: 0, wreath40Dec: 0,
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
                      className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs transition-colors"
                    >
                      Place Another Order
                    </button>
                  </div>
                </div>
              ) : (
                /* --- ORDER FORM & STOREFRONT CATALOG --- */
                <form onSubmit={handleWreathOrderSubmit} className="space-y-12 pb-16">
                  
                  {wreathError && (
                    <div className="bg-red-50 border-l-4 border-[#BE1E2D] p-4 text-red-700 text-sm font-bold shadow-md">
                      {wreathError}
                    </div>
                  )}

                  {/* Section 1: Catalog */}
                  <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-[#143d23]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-4 border-b border-gray-100 gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 01</span>
                        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900">Select Wreath Sizes & Styles</h2>
                      </div>
                      <div className="bg-emerald-50 px-4 py-2 text-emerald-900 font-bold text-xs uppercase tracking-wider border border-emerald-100">
                        Selected: <span className="font-black text-base text-[#143d23]">{calculateWreathTotalUnits()}</span> Items
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {WREATH_PRODUCTS.map(product => {
                        const qty = wreathQuantities[product.id];
                        return (
                          <div 
                            key={product.id}
                            className={`border transition-all duration-300 flex flex-col justify-between ${
                              qty > 0 ? 'border-[#143d23] shadow-lg ring-2 ring-[#143d23]/20' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="relative h-64 bg-gray-50 overflow-hidden">
                              <img 
                                src={product.img} 
                                alt={product.title}
                                onError={(e) => { e.target.onerror = null; e.target.src = product.fallback; }}
                                className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 bg-[#143d23] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                                {product.size} Ring
                              </div>
                            </div>

                            <div className="p-6 flex flex-col justify-between flex-grow">
                              <div>
                                <div className="flex justify-between items-baseline mb-2">
                                  <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">{product.title}</h3>
                                  <span className="text-2xl font-black text-[#143d23]">${product.price}</span>
                                </div>
                                <p className="text-gray-500 text-xs leading-relaxed mb-6 font-light">
                                  {product.desc}
                                </p>
                              </div>

                              <div className="flex items-center justify-between bg-gray-50 p-2 border border-gray-200">
                                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 pl-2">Quantity:</span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => updateWreathQty(product.id, -1)}
                                    className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-black text-gray-700 text-base"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="text"
                                    pattern="[0-9]*"
                                    value={qty}
                                    onChange={(e) => setWreathDirectQty(product.id, e.target.value)}
                                    className="w-12 h-8 text-center font-black text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#143d23]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateWreathQty(product.id, 1)}
                                    className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-black text-gray-700 text-base"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Customer & Delivery Information */}
                  <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-[#1D3A6C]">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 02</span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-8">Porch Delivery & Supporter Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">First Name *</label>
                        <input 
                          required 
                          type="text" 
                          value={wreathCustomer.firstName}
                          onChange={(e) => setWreathCustomer({...wreathCustomer, firstName: e.target.value})}
                          placeholder="Jane"
                          className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Last Name *</label>
                        <input 
                          required 
                          type="text" 
                          value={wreathCustomer.lastName}
                          onChange={(e) => setWreathCustomer({...wreathCustomer, lastName: e.target.value})}
                          placeholder="Smith"
                          className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Email Address (For Order Receipt) *</label>
                        <input 
                          required 
                          type="email" 
                          value={wreathCustomer.email}
                          onChange={(e) => setWreathCustomer({...wreathCustomer, email: e.target.value})}
                          placeholder="jane@example.com"
                          className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Phone Number *</label>
                        <input 
                          required 
                          type="tel" 
                          value={wreathCustomer.phone}
                          onChange={(e) => setWreathCustomer({...wreathCustomer, phone: e.target.value})}
                          placeholder="(860) 555-0199"
                          className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Porch Hand-Delivery Address (Street, Town, Zip) *</label>
                      <input 
                        required 
                        type="text" 
                        value={wreathCustomer.address}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, address: e.target.value})}
                        placeholder="e.g. 42 Main St, Unionville, CT 06085"
                        className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Which Scout Should Receive Credit for This Sale? *</label>
                      <select 
                        value={wreathCustomer.scoutName}
                        onChange={(e) => setWreathCustomer({...wreathCustomer, scoutName: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none font-bold text-sm"
                      >
                        {SCOUT_ROSTER.map((name, i) => (
                          <option key={i} value={name}>{name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-2 font-light">
                        The selected Scout will receive Scout Dollar credits toward summer camp and high adventure treks.
                      </p>
                    </div>
                  </div>

                  {/* Section 3: Payment Choice (VENMO, CHECK, CASH) */}
                  <div className="bg-white p-8 sm:p-12 shadow-xl border-t-8 border-gray-900">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BE1E2D]">Step 03</span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-gray-900 mb-6">Payment Method</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                      {/* VENMO */}
                      <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 ${wreathCustomer.paymentMethod === 'Venmo' ? 'border-[#008CFF] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
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
                            @Troop170Unionville. Enter your receipt number into the Venmo note line.
                          </p>
                        </div>
                      </label>

                      {/* CHECK */}
                      <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 ${wreathCustomer.paymentMethod === 'Check' ? 'border-[#1D3A6C] bg-slate-50' : 'border-gray-200 hover:border-gray-300'}`}>
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
                            Payable to "Troop 170" with receipt number and scout name on the memo line.
                          </p>
                        </div>
                      </label>

                      {/* CASH */}
                      <label className={`p-6 border-2 cursor-pointer transition-all flex items-start space-x-4 ${wreathCustomer.paymentMethod === 'Cash' ? 'border-[#143d23] bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
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
                            Cash collected directly by Scout when placing your order today.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Submit Bar */}
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Total Due</span>
                        <span className="text-4xl font-black text-[#143d23]">
                          ${calculateWreathTotal()}
                        </span>
                        <span className="text-xs text-gray-500 font-bold ml-2">({calculateWreathTotalUnits()} Wreaths)</span>
                      </div>

                      <button
                        type="submit"
                        disabled={wreathLoading}
                        className="w-full sm:w-auto px-12 py-5 bg-[#143d23] hover:bg-[#0e2b19] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50"
                      >
                        {wreathLoading ? 'Processing...' : `Confirm & Place Order`}
                      </button>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

        {/* --- ABOUT PAGE --- */}
        {currentPage === 'about' && (
          <div className="bg-white animate-in fade-in duration-700">
            <div className="relative py-40 lg:py-56 px-6 text-center overflow-hidden" style={{ backgroundColor: darkBg }}>
               <div className="absolute inset-0 z-0">
                 <img src="/images/about.jpg" alt="Scouts in action" className="w-full h-full object-cover opacity-70" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]"></div>
               </div>
               <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-1.5 mb-8 shadow-inner border border-white/10 rounded-none">
                    <Compass size={14} className="text-[#BE1E2D]" />
                    <span className="font-black tracking-[0.3em] uppercase text-[10px] text-white">Our Mission</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-light italic font-serif leading-[1.3] text-white drop-shadow-xl">
                    "To enhance character, promote self-discovery, and challenge Scouts to grow in leadership, fitness, and service through exceptional outdoor experiences."
                  </h2>
               </div>
            </div>
          </div>
        )}

        {/* --- JOIN PAGE --- */}
        {currentPage === 'join' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in duration-700">
            <div className="bg-[#0B0F19] text-white py-32 lg:py-60 px-6 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-30"><img src="/images/join.jpg" className="w-full h-full object-cover" alt="Campfire" /></div>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F19]"></div>
               <h2 className="relative z-10 text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">Start The Trail</h2>
               <p className="relative z-10 text-lg font-light text-gray-300 max-w-2xl mx-auto">Boys and girls ages 11-17 are welcome to join year-round.</p>
            </div>
          </div>
        )}

        {/* --- MEMBER PORTAL --- */}
        {currentPage === 'portal' && (
          <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
            {!isLoggedIn ? (
              <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden" style={{ backgroundColor: darkBg }}>
                <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-12 lg:p-16 shadow-2xl max-w-md w-full border border-white/10 rounded-none">
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase text-center">Member Login</h2>
                    <form onSubmit={(e) => { e.preventDefault(); if (password.toUpperCase() === 'TROOP170') setIsLoggedIn(true); else setLoginError(true); }}>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => {setPassword(e.target.value); setLoginError(false);}} 
                        className="w-full p-4 mb-4 bg-black/40 text-white text-lg border-0 outline-none rounded-none" 
                        placeholder="Gate Code" 
                      />
                      <button type="submit" className="w-full py-4 bg-white text-[#1D3A6C] font-black text-sm uppercase tracking-[0.2em]">
                        Unlock
                      </button>
                    </form>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <h2 className="text-3xl font-black mb-4">Troop 170 Member Dashboard</h2>
                <button onClick={() => setIsLoggedIn(false)} className="px-6 py-2 bg-stone-900 text-white font-bold text-xs uppercase">Log Out</button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-1">
             <div className="flex items-center space-x-4 mb-6 cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
                <div className="w-20 h-20 rounded-none flex items-center justify-center p-0.5">
                   <img src="/images/logo.png" className="w-full h-full object-contain" alt="Logo" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Troop 170</h2>
             </div>
             <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 pr-4">Building leaders through outdoor adventure since 1956.</p>
          </div>

          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Navigation</h4>
             <ul className="space-y-4">
               {navLinks.map(page => (
                 <li key={page.id} className="hover:text-white text-gray-400 cursor-pointer transition-colors uppercase font-bold tracking-wider text-xs" onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }}>{page.label}</li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Contact</h4>
             <ul className="space-y-5 text-sm text-gray-400">
               <li className="flex items-start space-x-3">
                 <MapPin className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="leading-tight">First Church of Christ<br/>61 Main St, Unionville, CT 06085</p>
               </li>
               <li className="flex items-start space-x-3">
                 <Mail className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="break-all leading-tight">Troop170greenssale@gmail.com</p>
               </li>
             </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
           <p className="mb-4 md:mb-0">© 2026 Scouting America Troop 170</p>
           <p>Unionville, Connecticut</p>
        </div>
      </footer>
    </div>
  );
}
