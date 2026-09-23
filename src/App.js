import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tent, Lock, ArrowUpRight, MapPin, Mail, Calendar, Phone, 
  Users, Compass, CheckCircle, Clock, 
  MessageCircle, ExternalLink, Medal, Flame, Heart, Key, 
  FileText, Smartphone, CreditCard, ShieldCheck, Download, 
  LogOut, BookOpen, X, Printer, Snowflake, Mountain, 
  Facebook, Sun, Quote, Image as ImageIcon,
  Utensils, PlusCircle, MinusCircle, AlertCircle, RefreshCw, ChevronRight, Shield,
  ClipboardCheck, Send
} from 'lucide-react';

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz7tNBzEsbBF3DoKrmIhrAwjvqMyM91rbzi81-Rr48BHIKiqmJp0o56P9AYc787vR8B/exec";

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

  // JOIN FORM STATE
  const [joinSuccess, setJoinSuccess] = useState(false);

  // ACCORDION ARCHIVE STATE
  const [openArchiveId, setOpenArchiveId] = useState(null);
  const toggleArchive = (id) => {
    setOpenArchiveId(prev => prev === id ? null : id);
  };

  // ========================================================
  // SCOUT DOLLARS: PARENT & LEADER & AUDIT SYSTEM STATE
  // ========================================================
  const [scoutDollarMode, setScoutDollarMode] = useState('parent'); // 'parent', 'leader', 'audit'
  
  // Parent Search State
  const [parentScoutId, setParentScoutId] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [parentAccount, setParentAccount] = useState(null);
  const [parentTransactions, setParentTransactions] = useState([]);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState('');

  // Leader Admin State (Individual Auth)
  const [leaderAuthUnlocked, setLeaderAuthUnlocked] = useState(false);
  const [leaderEmailInput, setLeaderEmailInput] = useState('');
  const [leaderPinInput, setLeaderPinInput] = useState('');
  const [activeLeader, setActiveLeader] = useState(null);
  const [leaderAuthError, setLeaderAuthError] = useState('');
  
  // Leader Transaction Form State
  const [scoutList, setScoutList] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [txType, setTxType] = useState('DEBIT');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Campout');
  const [txDescription, setTxDescription] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txMessage, setTxMessage] = useState(null);

  // Treasurer Audit Queue State
  const [auditData, setAuditData] = useState({
    totalTroopLiability: 0,
    cumulativeCredits: 0,
    cumulativeDebits: 0,
    pendingTransactions: []
  });
  const [selectedTxIds, setSelectedTxIds] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState(null);

  // Fetch Parent Balance & Ledger
  const handleParentLookup = async (e) => {
    e.preventDefault();
    setParentLoading(true);
    setParentError('');
    setParentAccount(null);

    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'getBalance',
          scoutId: parentScoutId.trim().toUpperCase(),
          pin: String(parentPin).trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setParentAccount(data.account);
        setParentTransactions(data.transactions || []);
      } else {
        setParentError(data.error || 'Invalid Scout ID or Family PIN.');
      }
    } catch (err) {
      setParentError('Unable to connect to Scout Dollar server: ' + err.message);
    } finally {
      setParentLoading(false);
    }
  };

  // Fetch Scout Roster for Leader Dropdown
  const fetchScoutRoster = useCallback(async (email, pin) => {
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'getScouts',
          leaderEmail: email,
          leaderPin: pin
        })
      });
      const data = await res.json();
      if (data.success && data.scouts) {
        setScoutList(data.scouts);
        setSelectedScoutId(prev => prev || (data.scouts[0] ? data.scouts[0].scoutId : ''));
      }
    } catch (err) {
      console.error("Could not fetch scouts:", err);
    }
  }, []);

  // Fetch Pending Audit Queue
  const fetchAuditQueue = useCallback(async (email, pin) => {
    setAuditLoading(true);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'getPendingAudit',
          leaderEmail: email,
          leaderPin: pin
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuditData({
          totalTroopLiability: data.totalTroopLiability || 0,
          cumulativeCredits: data.cumulativeCredits || 0,
          cumulativeDebits: data.cumulativeDebits || 0,
          pendingTransactions: data.pendingTransactions || []
        });
        // Pre-select all pending transactions by default
        setSelectedTxIds(data.pendingTransactions.map(tx => tx.txId));
      }
    } catch (err) {
      console.error("Could not fetch audit queue:", err);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    if (leaderAuthUnlocked && currentPage === 'scoutDollars' && activeLeader) {
      fetchScoutRoster(activeLeader.email, leaderPinInput);
      fetchAuditQueue(activeLeader.email, leaderPinInput);
    }
  }, [leaderAuthUnlocked, currentPage, activeLeader, leaderPinInput, fetchScoutRoster, fetchAuditQueue]);

  // Submit Leader Login
  const handleLeaderLogin = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    setLeaderAuthError('');

    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'verifyLeader',
          email: leaderEmailInput.trim().toLowerCase(),
          pin: leaderPinInput.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setActiveLeader(data.leader);
        setLeaderAuthUnlocked(true);
        fetchScoutRoster(leaderEmailInput.trim().toLowerCase(), leaderPinInput.trim());
        fetchAuditQueue(leaderEmailInput.trim().toLowerCase(), leaderPinInput.trim());
      } else {
        setLeaderAuthError(data.error || 'Invalid leader email or PIN.');
      }
    } catch (err) {
      setLeaderAuthError('Connection error to server.');
    } finally {
      setTxLoading(false);
    }
  };

  // Submit Leader Transaction
  const handleLeaderSubmit = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    setTxMessage(null);

    const amountNum = parseFloat(txAmount);
    const chosenScout = scoutList.find(s => s.scoutId === selectedScoutId);

    if (!selectedScoutId) {
      setTxMessage({ type: 'error', text: 'Please select a scout.' });
      setTxLoading(false);
      return;
    }

    if (txType === 'DEBIT' && chosenScout && amountNum > chosenScout.balance) {
      setTxMessage({ type: 'error', text: `Insufficient funds! Available: $${chosenScout.balance.toFixed(2)}, Requested: $${amountNum.toFixed(2)}` });
      setTxLoading(false);
      return;
    }

    try {
      const payload = {
        action: 'recordTransaction',
        leaderEmail: activeLeader.email,
        leaderPin: leaderPinInput.trim(),
        scoutId: selectedScoutId,
        type: txType,
        amount: amountNum,
        category: txCategory,
        description: txDescription
      };

      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setTxMessage({ type: 'success', text: data.message });
        setTxAmount('');
        setTxDescription('');
        fetchScoutRoster(activeLeader.email, leaderPinInput.trim());
        fetchAuditQueue(activeLeader.email, leaderPinInput.trim());
      } else {
        setTxMessage({ type: 'error', text: data.error || 'Transaction failed to post.' });
      }
    } catch (err) {
      setTxMessage({ type: 'error', text: 'Server communication error.' });
    } finally {
      setTxLoading(false);
    }
  };

  // Treasurer: Approve & Reconcile Selected Transactions
  const handleReconcileSelected = async () => {
    if (selectedTxIds.length === 0) return;
    setAuditLoading(true);
    setAuditFeedback(null);

    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'reconcileBatch',
          leaderEmail: activeLeader.email,
          leaderPin: leaderPinInput.trim(),
          txIds: selectedTxIds
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuditFeedback({ type: 'success', text: data.message });
        fetchAuditQueue(activeLeader.email, leaderPinInput.trim());
      } else {
        setAuditFeedback({ type: 'error', text: data.error || 'Reconciliation failed.' });
      }
    } catch (err) {
      setAuditFeedback({ type: 'error', text: 'Connection error while reconciling.' });
    } finally {
      setAuditLoading(false);
    }
  };

  // Treasurer: Dispatch CFO Memorandum Email
  const handleDispatchCfo = async () => {
    if (!window.confirm("Send the official Monthly Reconciliation Memorandum to Oliver Gloe (CFO) and Michelle Guerrerra?")) return;
    setAuditLoading(true);
    setAuditFeedback(null);

    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'dispatchCfoMemo',
          leaderEmail: activeLeader.email,
          leaderPin: leaderPinInput.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuditFeedback({ type: 'success', text: data.message });
      } else {
        setAuditFeedback({ type: 'error', text: data.error || 'Failed to dispatch memo.' });
      }
    } catch (err) {
      setAuditFeedback({ type: 'error', text: 'Server communication error.' });
    } finally {
      setAuditLoading(false);
    }
  };

  const selectedScoutObj = scoutList.find(s => s.scoutId === selectedScoutId);
  const isFinanceOfficer = activeLeader && (
    activeLeader.role.toLowerCase().includes('treasurer') || 
    activeLeader.role.toLowerCase().includes('cfo') || 
    activeLeader.role.toLowerCase().includes('admin')
  );

  const darkBg = "#0B0F19";

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
      gallery: [],
      galleryFallbacks: []
    }
  ];

  const featuredEntry = scoutTrailData[0];
  const pastEntries = scoutTrailData.slice(1);

  const programsList = [
    { id: 0, title: "Scout Rank Advancement", desc: "Progress through the scouting ranks at your own pace with the guidance of experienced mentors and youth leaders.", img: "/images/rank.jpg" },
    { id: 1, title: "Merit Badge Program", desc: "Explore over 140 different subjects from Robotics to First Aid in our active, year-round educational program.", img: "/images/merit.jpg" },
    { id: 2, title: "Monthly Campouts", desc: "Develop outdoor survival skills, patrol camaraderie, and self-reliance during our regular weekend camping trips.", img: "/images/campout.jpg" },
    { id: 3, title: "Community Service", desc: "Giving back to Farmington and Unionville through local conservation, food drives, and extensive Eagle Scout projects.", img: "/images/service.jpg" },
    { id: 4, title: "Summer Camp", desc: "A week of intensive advancement, unparalleled fun, and outdoor bonding at our annual summer camp.", img: "/images/camp.jpg" },
    { id: 5, title: "High Adventure Trekking", desc: "Epic outdoor trips including backpacking, wilderness survival, and annual high-adventure treks across the country.", img: "/images/philmont.jpg" }
  ];

  const upcomingBadges = [
    { id: 101, name: "First Aid", date: "Saturday, Oct 14", time: "9:00 AM - 1:00 PM", counselor: "Dr. Smith", status: "Open", img: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=800&q=80" }
  ];

  const gearListsData = [
    { 
      id: 1, title: "The 10 Essentials", desc: "The absolute required items for every Scout's daypack, regardless of trip duration.", icon: <Compass size={28} />,
      type: "document",
      content: "<ul style='line-height:1.8;'><li><strong>Pocketknife</strong></li><li><strong>First-Aid Kit</strong></li><li><strong>Extra Clothing</strong></li><li><strong>Rain Gear</strong></li><li><strong>Water Bottle</strong></li><li><strong>Flashlight</strong></li><li><strong>Trail Food</strong></li><li><strong>Matches</strong></li><li><strong>Sun Protection</strong></li><li><strong>Map & Compass</strong></li></ul>",
      plainText: "- Pocketknife\n- First-Aid Kit\n- Extra Clothing\n- Rain Gear\n- Water Bottle\n- Flashlight\n- Trail Food\n- Matches\n- Sun Protection\n- Map and Compass"
    }
  ];

  const handlePrint = (list) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Troop 170 - ${list.title}</title></head><body><h1>${list.title}</h1>${list.content}</body></html>`);
    printWindow.document.close();
  };

  const handleDownload = (list) => {
    const fileContent = `TROOP 170: ${list.title.toUpperCase()}\n\n${list.plainText}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Troop170_${list.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'scoutCorner', label: 'Scout Corner' },
    { id: 'join', label: 'Join' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-[#BE1E2D] selection:text-white">
      
      {/* NAVIGATION */}
      <nav className="text-white relative z-50 border-b border-white/10" style={{ backgroundColor: darkBg }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-24 items-center">
            
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setCurrentPage('home')}>
              <div className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img src="/images/logo.png" className="w-full h-full object-contain" alt="Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Troop 170</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Unionville, CT</p>
              </div>
            </div>

            <div className="hidden md:flex space-x-10 items-center text-base font-bold uppercase tracking-wider text-gray-300">
              {navLinks.map(page => (
                <button 
                  key={page.id} 
                  onClick={() => setCurrentPage(page.id)} 
                  className={`hover:text-white transition-colors ${currentPage === page.id ? 'text-white border-b-2 border-[#BE1E2D] pb-1' : ''}`}
                >
                  {page.label}
                </button>
              ))}
              <a href="https://venmo.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="text-[#008CFF] hover:text-blue-400 transition-colors flex items-center space-x-2">
                <Heart size={16}/><span>Donate</span>
              </a>
              <button onClick={() => setCurrentPage('portal')} className="flex items-center space-x-2 px-6 py-2.5 bg-white text-gray-900 hover:bg-[#BE1E2D] hover:text-white transition-all duration-300 shadow-md rounded-none font-black text-sm tracking-widest">
                <Lock size={16}/><span>Member Login</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <main className="flex-grow">
        
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-700">
            <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: darkBg }}>
              <div className="absolute inset-0 z-0">
                <img src="/images/hero.jpg" alt="Scouts" className="w-full h-full object-cover object-[100%_70%] -scale-x-100 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none mb-8 border border-white/5">
                  <Compass size={14} className="text-[#BE1E2D]" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Established 1956</span>
                </div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase max-w-4xl">
                  Transform Youth <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Into Leaders</span>
                </h2>
                <button onClick={() => setCurrentPage('join')} className="px-10 py-5 bg-[#BE1E2D] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-4 rounded-none">
                   <span>Schedule Visit</span>
                   <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MEMBER PORTAL */}
        {currentPage === 'portal' && (
          <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
            {!isLoggedIn ? (
              <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden" style={{ backgroundColor: darkBg }}>
                <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-12 lg:p-16 shadow-2xl max-w-md w-full border border-white/10 rounded-none text-center">
                    <div className="w-20 h-20 bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Member Login</h2>
                    <p className="text-gray-400 mb-10 text-sm font-light">Internal Command Center.</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); if (password.toUpperCase() === 'TROOP170') setIsLoggedIn(true); else setLoginError(true); }}>
                      <div className="relative mb-6">
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => {setPassword(e.target.value); setLoginError(false);}} 
                          className="w-full px-4 py-4 bg-black/40 text-white text-center font-bold tracking-widest text-lg outline-none focus:ring-2 focus:ring-white/30 rounded-none" 
                          placeholder="Gate Code" 
                        />
                      </div>
                      {loginError && <p className="text-[#ff6b6b] mb-6 font-black uppercase text-[10px] tracking-widest">Access Denied</p>}
                      <button type="submit" className="w-full py-4 bg-white text-[#1D3A6C] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors rounded-none flex justify-center items-center space-x-2">
                        <span>Unlock</span>
                        <ArrowUpRight size={16} />
                      </button>
                    </form>
                </div>
              </div>
            ) : (
              <div className="pb-32">
                <div className="bg-[#050B14] py-20 px-6 sm:px-8 lg:px-12 relative overflow-hidden shadow-xl mb-16 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Troop 170 Dashboard</h2>
                    <p className="text-gray-400 text-sm mt-1">Secured Financial & Advancement Portals</p>
                  </div>
                  <button onClick={() => setIsLoggedIn(false)} className="px-6 py-3 bg-white/10 font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-colors flex items-center space-x-2">
                    <span>Log Out</span><LogOut size={14}/>
                  </button>
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-[#1D3A6C] mb-6 shadow-sm"><CreditCard size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Scout Dollars</h3>
                         <p className="text-gray-500 text-sm mb-8">Access family account balance, leader transactions, and monthly treasurer audits.</p>
                      </div>
                      <button onClick={() => setCurrentPage('scoutDollars')} className="flex items-center space-x-2 text-[#1D3A6C] font-black uppercase tracking-widest text-[10px]">
                        <span>Enter Bank Portal</span><ChevronRight size={14}/>
                      </button>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            SCOUT DOLLAR BANKING & TREASURER AUDIT ROOM
           ======================================================== */}
        {currentPage === 'scoutDollars' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-20 px-6 text-center shadow-md relative overflow-hidden text-white">
               <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                 <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-none mb-4 border border-white/10">
                    <CreditCard size={14} className="text-green-400" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-green-400">Troop 170 Financial Reserve</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Scout Dollar Bank</h2>
                 <button onClick={() => setCurrentPage('portal')} className="text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px] transition-colors">← Return to Vault</button>

                 {/* TAB SELECTOR */}
                 <div className="flex mt-8 border border-white/10 bg-white/5 p-1">
                    <button 
                      onClick={() => setScoutDollarMode('parent')} 
                      className={`px-5 py-2.5 font-black uppercase tracking-wider text-xs transition-colors ${scoutDollarMode === 'parent' ? 'bg-white text-gray-900 shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      Family Account Card
                    </button>
                    <button 
                      onClick={() => setScoutDollarMode('leader')} 
                      className={`px-5 py-2.5 font-black uppercase tracking-wider text-xs transition-colors flex items-center space-x-1.5 ${scoutDollarMode === 'leader' ? 'bg-[#BE1E2D] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Shield size={14} />
                      <span>Leader Transaction Hub</span>
                    </button>
                    {isFinanceOfficer && (
                      <button 
                        onClick={() => setScoutDollarMode('audit')} 
                        className={`px-5 py-2.5 font-black uppercase tracking-wider text-xs transition-colors flex items-center space-x-1.5 ${scoutDollarMode === 'audit' ? 'bg-[#1D3A6C] text-white shadow' : 'text-green-400 hover:text-white'}`}
                      >
                        <ClipboardCheck size={14} />
                        <span>Treasurer Audit Queue</span>
                      </button>
                    )}
                 </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
              
              {/* 1. FAMILY MOBILE ACCOUNT CARD */}
              {scoutDollarMode === 'parent' && (
                <div>
                  <form onSubmit={handleParentLookup} className="bg-white p-6 shadow-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-none mb-8">
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Scout ID</label>
                      <input 
                        required 
                        value={parentScoutId} 
                        onChange={(e) => setParentScoutId(e.target.value.toUpperCase())}
                        placeholder="e.g. S-105" 
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-900 font-bold uppercase text-sm focus:border-[#1D3A6C] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Family PIN</label>
                      <input 
                        required 
                        type="password"
                        maxLength={6}
                        value={parentPin} 
                        onChange={(e) => setParentPin(e.target.value)}
                        placeholder="4-digit PIN" 
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#1D3A6C] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                      <button 
                        type="submit" 
                        disabled={parentLoading}
                        className="w-full p-3.5 bg-[#1D3A6C] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                      >
                        {parentLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>View Balance</span>}
                      </button>
                    </div>
                  </form>

                  {parentError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center space-x-3 text-red-700 text-sm font-semibold">
                      <AlertCircle size={20} />
                      <span>{parentError}</span>
                    </div>
                  )}

                  {parentAccount && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                      
                      {/* Modern Debit/Card View */}
                      <div className="relative overflow-hidden bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364] text-white p-8 md:p-10 shadow-2xl rounded-2xl border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">Troop 170 • Member Reserve</span>
                            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">{parentAccount.fullName}</h3>
                            <p className="text-xs font-mono text-gray-400 mt-0.5">Scout ID: {parentAccount.scoutId}</p>
                          </div>
                          <div className="bg-white/10 px-3 py-1.5 rounded-md border border-white/10 text-right">
                            <span className="text-[9px] uppercase tracking-widest font-black text-green-300 block">Status</span>
                            <span className="text-xs font-bold text-white uppercase">{parentAccount.status}</span>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between border-t border-white/10 pt-6 gap-6">
                          <div>
                            <span className="block text-[10px] uppercase tracking-[0.25em] text-green-300 font-black mb-1">Available Scout Dollars</span>
                            <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                              ${parentAccount.currentBalance.toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-right sm:text-left">
                            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                              <span className="text-[9px] uppercase tracking-wider text-gray-300 block font-bold">Total Earned</span>
                              <span className="text-sm font-black text-green-400">+${parentAccount.totalEarned.toFixed(2)}</span>
                            </div>
                            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                              <span className="text-[9px] uppercase tracking-wider text-gray-300 block font-bold">Total Applied</span>
                              <span className="text-sm font-black text-red-400">-${parentAccount.totalUsed.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Feed */}
                      <div className="bg-white shadow-xl border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                          <div>
                            <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">Activity Journal</h4>
                            <p className="text-xs text-gray-400">Chronological history of credits and debits</p>
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1">
                            {parentTransactions.length} Transactions
                          </span>
                        </div>

                        {parentTransactions.length === 0 ? (
                          <p className="text-gray-400 text-center py-8 text-sm italic">No transaction records on file yet.</p>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {parentTransactions.map(tx => {
                              const isCredit = tx.type === 'CREDIT';
                              return (
                                <div key={tx.txId} className="py-4 flex items-center justify-between hover:bg-gray-50/80 px-2 transition-colors">
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[#BE1E2D]'}`}>
                                      {isCredit ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
                                    </div>
                                    <div>
                                      <p className="font-bold text-sm text-gray-900 leading-snug">{tx.description || tx.category}</p>
                                      <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                                        <span>{tx.date}</span>
                                        <span>•</span>
                                        <span className="text-[#1D3A6C]">{tx.category}</span>
                                        <span>•</span>
                                        <span>Ref: {tx.txId}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className={`text-base font-black tracking-tight ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                                      {isCredit ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                                    </span>
                                    <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-0.5">{tx.auditStatus}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* 2. LEADER TRANSACTION HUB */}
              {scoutDollarMode === 'leader' && (
                <div className="bg-white shadow-2xl border-t-8 border-[#BE1E2D] p-8 md:p-10 animate-in fade-in duration-300">
                  
                  {!leaderAuthUnlocked ? (
                    <div className="max-w-md mx-auto text-center py-6">
                      <div className="w-16 h-16 bg-red-50 text-[#BE1E2D] flex items-center justify-center mx-auto mb-4">
                        <Lock size={30} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">Leader Sign-In</h3>
                      <p className="text-gray-500 text-xs mb-6">Enter your authorized email and unique leader PIN.</p>
                      
                      <form onSubmit={handleLeaderLogin} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Leader Email</label>
                          <input 
                            required 
                            type="email"
                            placeholder="e.g. vallarioc@gmail.com"
                            value={leaderEmailInput}
                            onChange={(e) => setLeaderEmailInput(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 text-sm focus:border-[#BE1E2D] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Personal Leader PIN</label>
                          <input 
                            required 
                            type="password"
                            maxLength={8}
                            placeholder="••••"
                            value={leaderPinInput}
                            onChange={(e) => setLeaderPinInput(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 text-sm font-bold tracking-widest focus:border-[#BE1E2D] outline-none"
                          />
                        </div>

                        {leaderAuthError && (
                          <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-center">{leaderAuthError}</p>
                        )}

                        <button 
                          type="submit" 
                          disabled={txLoading}
                          className="w-full p-4 bg-[#BE1E2D] text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors flex justify-center items-center space-x-2"
                        >
                          {txLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Sign In as Leader</span>}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div>
                          <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#BE1E2D] mb-1">
                            <ShieldCheck size={14} /> <span>Session: {activeLeader.name} ({activeLeader.role})</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Record Transaction</h3>
                        </div>
                        <button 
                          onClick={() => { setLeaderAuthUnlocked(false); setActiveLeader(null); setLeaderPinInput(''); }} 
                          className="text-[10px] uppercase font-bold text-gray-400 hover:text-gray-700 tracking-wider"
                        >
                          Lock Session
                        </button>
                      </div>

                      {txMessage && (
                        <div className={`p-4 mb-6 text-sm font-bold flex items-center space-x-3 ${txMessage.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'}`}>
                          {txMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                          <span>{txMessage.text}</span>
                        </div>
                      )}

                      <form onSubmit={handleLeaderSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Select Scout</label>
                            <select 
                              value={selectedScoutId} 
                              onChange={(e) => setSelectedScoutId(e.target.value)}
                              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#1D3A6C] outline-none"
                            >
                              {scoutList.map(s => (
                                <option key={s.scoutId} value={s.scoutId}>
                                  {s.fullName} ({s.scoutId}) - ${s.balance.toFixed(2)} Available
                                </option>
                              ))}
                            </select>
                            {selectedScoutObj && (
                              <p className="text-xs text-gray-500 mt-2">
                                Available Balance: <strong className="text-green-600 font-black">${selectedScoutObj.balance.toFixed(2)}</strong>
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Logged By</label>
                            <input 
                              disabled
                              value={`${activeLeader.name} (${activeLeader.role})`}
                              className="w-full p-4 bg-gray-100 border border-gray-200 text-gray-600 text-sm font-semibold outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Transaction Type</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setTxType('DEBIT')}
                              className={`p-4 border font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 ${txType === 'DEBIT' ? 'bg-red-50 border-[#BE1E2D] text-[#BE1E2D]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                            >
                              <MinusCircle size={16} /> <span>Withdrawal (Debit)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTxType('CREDIT')}
                              className={`p-4 border font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 ${txType === 'CREDIT' ? 'bg-green-50 border-green-600 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                            >
                              <PlusCircle size={16} /> <span>Deposit (Credit)</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Amount ($ USD)</label>
                            <input 
                              required 
                              type="number" 
                              step="0.01" 
                              min="0.01"
                              value={txAmount} 
                              onChange={(e) => setTxAmount(e.target.value)}
                              placeholder="55.00" 
                              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 font-black text-lg focus:border-[#1D3A6C] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                            <select 
                              value={txCategory} 
                              onChange={(e) => setTxCategory(e.target.value)}
                              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold text-sm focus:border-[#1D3A6C] outline-none"
                            >
                              <option value="Campout">Campout</option>
                              <option value="Summer Camp">Summer Camp</option>
                              <option value="High Adventure">High Adventure</option>
                              <option value="Wreaths">Wreath Fundraiser</option>
                              <option value="Fundraiser">General Fundraiser</option>
                              <option value="Dues">Troop Dues</option>
                              <option value="Equipment">Scout Equipment / Gear</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Event Reference / Description</label>
                          <input 
                            required 
                            value={txDescription} 
                            onChange={(e) => setTxDescription(e.target.value)}
                            placeholder="e.g. October Sequassen Fall Campout (Paid via Form)" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-[#1D3A6C] outline-none"
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={txLoading}
                          className="w-full p-5 bg-[#1D3A6C] text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors flex items-center justify-center space-x-2"
                        >
                          {txLoading ? <RefreshCw size={16} className="animate-spin" /> : <span>Post Entry to Master Ledger</span>}
                        </button>

                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* 3. TREASURER AUDIT & CFO RECONCILIATION QUEUE */}
              {scoutDollarMode === 'audit' && isFinanceOfficer && (
                <div className="bg-white shadow-2xl border-t-8 border-[#1D3A6C] p-8 md:p-10 animate-in fade-in duration-300">
                  
                  {/* Top Financial Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100 text-center">
                    <div className="bg-blue-50 p-6 border border-blue-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1D3A6C] block mb-1">Total Restricted Liability</span>
                      <span className="text-3xl font-black text-[#1D3A6C]">${auditData.totalTroopLiability.toFixed(2)}</span>
                    </div>
                    <div className="bg-green-50 p-6 border border-green-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-700 block mb-1">Cumulative Credits Earned</span>
                      <span className="text-3xl font-black text-green-700">+${auditData.cumulativeCredits.toFixed(2)}</span>
                    </div>
                    <div className="bg-red-50 p-6 border border-red-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#BE1E2D] block mb-1">Cumulative Debits Applied</span>
                      <span className="text-3xl font-black text-[#BE1E2D]">-${auditData.cumulativeDebits.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Pending Audit Queue</h3>
                      <p className="text-xs text-gray-500">Unreconciled transactions awaiting Treasurer validation</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={handleReconcileSelected}
                        disabled={auditLoading || selectedTxIds.length === 0}
                        className="px-5 py-3 bg-green-700 text-white font-black uppercase tracking-widest text-xs hover:bg-green-800 transition-colors flex items-center space-x-2 disabled:opacity-40"
                      >
                        <CheckCircle size={15} />
                        <span>Validate Selected ({selectedTxIds.length})</span>
                      </button>
                      <button 
                        onClick={handleDispatchCfo}
                        disabled={auditLoading}
                        className="px-5 py-3 bg-[#1D3A6C] text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors flex items-center space-x-2"
                      >
                        <Send size={15} />
                        <span>Dispatch CFO Memo</span>
                      </button>
                    </div>
                  </div>

                  {auditFeedback && (
                    <div className={`p-4 mb-6 text-sm font-bold flex items-center space-x-3 ${auditFeedback.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'}`}>
                      {auditFeedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      <span>{auditFeedback.text}</span>
                    </div>
                  )}

                  {auditLoading ? (
                    <div className="py-12 text-center text-gray-400 flex items-center justify-center space-x-3">
                      <RefreshCw className="animate-spin" size={24} />
                      <span className="font-bold text-sm">Syncing audit journal with master sheet...</span>
                    </div>
                  ) : auditData.pendingTransactions.length === 0 ? (
                    <div className="bg-gray-50 p-12 text-center border border-gray-100">
                      <CheckCircle size={40} className="text-green-600 mx-auto mb-3" />
                      <h4 className="text-lg font-black uppercase tracking-tight text-gray-900">Audit Journal Complete</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">All posted debits and credits have been reconciled. Click "Dispatch CFO Memo" above to send the monthly report to Oliver Gloe.</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-black tracking-wider">
                            <th className="p-3 w-10 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedTxIds.length === auditData.pendingTransactions.length}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedTxIds(auditData.pendingTransactions.map(t => t.txId));
                                  else setSelectedTxIds([]);
                                }}
                              />
                            </th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Scout</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Recorded By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {auditData.pendingTransactions.map(tx => {
                            const isSelected = selectedTxIds.includes(tx.txId);
                            const isCredit = tx.type === 'CREDIT';
                            return (
                              <tr key={tx.txId} className={`hover:bg-blue-50/50 ${isSelected ? 'bg-blue-50/20' : ''}`}>
                                <td className="p-3 text-center">
                                  <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedTxIds(prev => [...prev, tx.txId]);
                                      else setSelectedTxIds(prev => prev.filter(id => id !== tx.txId));
                                    }}
                                  />
                                </td>
                                <td className="p-3 font-mono text-gray-600">{tx.date}</td>
                                <td className="p-3 font-bold text-gray-900">{tx.scoutName}</td>
                                <td className={`p-3 font-black ${isCredit ? 'text-green-600' : 'text-[#BE1E2D]'}`}>{tx.type}</td>
                                <td className="p-3 font-black text-gray-900">${tx.amount.toFixed(2)}</td>
                                <td className="p-3 text-gray-600">{tx.category}</td>
                                <td className="p-3 text-gray-700 italic max-w-xs">{tx.description}</td>
                                <td className="p-3 text-[11px] text-gray-500 font-semibold">{tx.recordedBy}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

        {/* GEAR HUB */}
        {currentPage === 'gearLists' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-24 px-6 text-center text-white">
               <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Gear Hub</h2>
               <button onClick={() => setCurrentPage('portal')} className="text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px]">← Return to Vault</button>
            </div>
            <div className="max-w-7xl mx-auto px-6 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {gearListsData.map(list => (
                 <div key={list.id} className="bg-white p-8 border-t-4 border-[#1D3A6C] shadow-md flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black uppercase mb-2">{list.title}</h3>
                      <p className="text-gray-500 text-sm mb-8">{list.desc}</p>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => handlePrint(list)} className="flex-1 py-3 bg-gray-100 font-bold uppercase text-[10px] flex items-center justify-center space-x-2">
                         <Printer size={14}/><span>Print</span>
                       </button>
                       <button onClick={() => handleDownload(list)} className="flex-1 py-3 bg-[#1D3A6C] text-white font-bold uppercase text-[10px] flex items-center justify-center space-x-2">
                         <Download size={14}/><span>Save</span>
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
           <p className="mb-4 md:mb-0">© 2026 Scouting America Troop 170</p>
           <p>Unionville, Connecticut</p>
        </div>
      </footer>

      {/* FLOAT CHAT */}
      <a href="https://www.facebook.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#008CFF] flex items-center justify-center text-white shadow-lg hover:-translate-y-1 transition-transform z-50">
        <MessageCircle size={24} />
      </a>

    </div>
  );
}
