import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MapPin, CheckCircle, AlertTriangle, ArrowRight, LogOut, 
  Search, Clock, Users, Calendar, Phone, Package, 
  RefreshCw, Check, X, 
  Sparkles, UserCheck, HeartHandshake, Copy, ExternalLink,
  ClipboardList, Building2, UserPlus, PhoneCall, Plus, StickyNote,
  Printer, FileText, CheckSquare, Square, AlertOctagon
} from 'lucide-react';

// Live Google Apps Script API Endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbwc0jFa7_F-m22bsb5n-mUMJuDOzLOdxdtHHd6fmN2_Xf-kYA1BeZ3w_WqUX5BABql9/exec";

// Helper: Extract street names from API route properties (populated from Master_Routes / Archive_2026 tab)
const getRouteStreets = (route) => {
  if (route.Streets && String(route.Streets).trim()) return String(route.Streets).trim();
  if (route.Street_Names && String(route.Street_Names).trim()) return String(route.Street_Names).trim();
  if (route.Description && String(route.Description).trim()) return String(route.Description).trim();
  if (route.Master_Streets && String(route.Master_Streets).trim()) return String(route.Master_Streets).trim();
  if (route.Route_Description && String(route.Route_Description).trim()) return String(route.Route_Description).trim();
  return null;
};

const PANTRY_SLOTS = [
  { id: '9-10', time: '9:00 AM - 10:00 AM', label: '9:00 AM – 10:00 AM', desc: 'Setup, early drop-offs & initial intake', target: 8 },
  { id: '10-11', time: '10:00 AM - 11:00 AM', label: '10:00 AM – 11:00 AM', desc: 'Peak route returns, expiration checks & sorting', target: 10 },
  { id: '11-12', time: '11:00 AM - 12:00 PM', label: '11:00 AM – 12:00 PM', desc: 'Major influx, categorization & packing', target: 10 },
  { id: '12-1', time: '12:00 PM - 1:00 PM', label: '12:00 PM – 1:00 PM', desc: 'Final returns, weighing & pantry stocking', target: 8 }
];

export default function ScoutDispatch() {
  const [user, setUser] = useState(null);
  // Main Navigation Sections: 'routes' (Route Selection), 'pantry' (Food Sorting), 'dashboard' (Dispatch Command Center)
  const [activeSection, setActiveSection] = useState('routes');
  // Sub-phase for Route Selection: 'tagging' (Phase A: Door Tags) or 'collection' (Phase B: Food Pickup)
  const [routePhase, setRoutePhase] = useState('tagging');
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({ campaign: 'CAMP-2027', routes: [], claims: {} });

  // Route Filters
  const [routeFilter, setRouteFilter] = useState('all'); // 'all', 'available', 'claimed', 'my_routes', 'completed', 'orphans', 'alerts'
  const [routeSearchQuery, setRouteSearchQuery] = useState('');

  // Claim Modal State (Door tags -> auto-assumes pickup unless opted out)
  const [claimingRoute, setClaimingRoute] = useState(null);
  const [alsoClaimPickup, setAlsoClaimPickup] = useState(true);

  // Volunteer Dossier (Printable Field Packet) Modal
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Real-Time Route Notes State (Stored locally & synced with API)
  const [routeNotes, setRouteNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('sff_route_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editingNoteRouteId, setEditingNoteRouteId] = useState(null);

  // Dispatch Dashboard Search Tool
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [dashboardPhaseFilter, setDashboardPhaseFilter] = useState('both'); // 'both', 'tagging', 'collection'

  // Food Sorting Volunteer Signups State (Clean start, zero dummy/example names)
  const [pantrySignups, setPantrySignups] = useState(() => {
    try {
      const saved = localStorage.getItem('sff_food_sorting_signups');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Purge any legacy example placeholder IDs to ensure completely clear signups
        return parsed.filter(item => !['p1', 'p2', 'p3', 'p4', 'p5'].includes(item.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Food Sorting Form State
  const [selectedPantrySlots, setSelectedPantrySlots] = useState([]);
  const [pantryForm, setPantryForm] = useState({
    name: '',
    phone: '',
    email: '',
    affiliation: 'Troop 170 Scout & Parent',
    partySize: 1,
    notes: ''
  });
  const [pantrySuccessMessage, setPantrySuccessMessage] = useState(null);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  // Volunteer phone mapping registry
  const [contactRegistry, setContactRegistry] = useState(() => {
    try {
      const saved = localStorage.getItem('sff_volunteer_contacts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Frictionless Login Check
  useEffect(() => {
    const savedUser = localStorage.getItem('sff_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setPantryForm(prev => ({ ...prev, name: parsed.name || '', phone: parsed.phone || '' }));
      } catch {
        // ignore
      }
    }
    fetchData();
  }, []);

  // Save pantry signups to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sff_food_sorting_signups', JSON.stringify(pantrySignups));
    } catch {
      // ignore
    }
  }, [pantrySignups]);

  // Save contact registry
  useEffect(() => {
    try {
      localStorage.setItem('sff_volunteer_contacts', JSON.stringify(contactRegistry));
    } catch {
      // ignore
    }
  }, [contactRegistry]);

  // Save route notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sff_route_notes', JSON.stringify(routeNotes));
    } catch {
      // ignore
    }
  }, [routeNotes]);

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const phone = e.target.phone.value.trim();
    if (!name || !phone) return;
    const userData = { name, phone };
    localStorage.setItem('sff_user', JSON.stringify(userData));
    setUser(userData);
    setPantryForm(prev => ({ ...prev, name, phone }));
    setContactRegistry(prev => ({ ...prev, [name.toLowerCase()]: phone }));
  };

  const handleLogout = () => {
    localStorage.removeItem('sff_user');
    setUser(null);
  };

  // Fetch live route and claim data from Google Apps Script
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(prev => prev.routes?.length > 0 ? prev : {
        campaign: 'CAMP-2027',
        routes: Array.from({ length: 69 }, (_, i) => ({
          Route_ID: i + 1,
          Route_Name: `Route ${i + 1}`,
          Map_URL: '',
          Total_Houses: 100 + ((i * 17) % 150),
          Permanent_Alerts: i === 3 ? 'Westwoods Dr has 0 homes' : i === 6 ? 'Condo complex: West Woods II' : ''
        })),
        claims: {}
      });
    }
    setLoading(false);
    setRefreshing(false);
  };

  // Send action to API
  const sendAction = async (payload) => {
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      await fetchData();
    } catch (error) {
      console.error("Action failed:", error);
      setLoading(false);
    }
  };

  // Retrieve claim object for a specific route and phase
  const getClaimInfo = useCallback((routeId, phase) => {
    const routeClaims = data.claims[routeId] || data.claims[String(routeId)];
    if (!routeClaims) return null;

    if (phase === 'tagging') {
      return (
        routeClaims['Tagging'] || 
        routeClaims['Phase 1 (Distribution)'] || 
        routeClaims['Phase 1 & 2'] ||
        null
      );
    } else {
      return (
        routeClaims['Collection'] || 
        routeClaims['Phase 2 (Collection)'] || 
        routeClaims['Phase 1 & 2'] ||
        null
      );
    }
  }, [data.claims]);

  // Helper: Get volunteer contact phone
  const getVolunteerPhone = (volunteerName) => {
    if (!volunteerName) return null;
    const nameKey = volunteerName.trim().toLowerCase();
    if (contactRegistry[nameKey]) return contactRegistry[nameKey];
    if (user && user.name.trim().toLowerCase() === nameKey) return user.phone;
    if (nameKey.includes('fernandes')) return '(860) 796-0170';
    if (nameKey.includes('bystricky')) return '(860) 555-0115';
    if (nameKey.includes('michalic')) return '(860) 555-0182';
    if (nameKey.includes('walsdorf')) return '(860) 555-0133';
    if (nameKey.includes('sahoo')) return '(860) 555-0199';
    return null;
  };

  // Initiate Route Claim (opens confirmation modal explaining dual ownership default)
  const startClaimRoute = (route) => {
    setClaimingRoute(route);
    setAlsoClaimPickup(true); // default: assume both door tags and donation pickup
  };

  // Execute Route Claim after modal confirmation
  const executeClaimRoute = async () => {
    if (!claimingRoute || !user) return;
    const routeId = claimingRoute.Route_ID;

    setContactRegistry(prev => ({ ...prev, [user.name.toLowerCase()]: user.phone }));

    if (routePhase === 'tagging') {
      if (alsoClaimPickup) {
        // Volunteer claims BOTH door tags AND donation pickup
        await sendAction({
          action: 'claim_route',
          campaign_id: data.campaign,
          route_id: routeId,
          phase: 'Tagging',
          volunteer_name: user.name,
          volunteer_phone: user.phone
        });
        await sendAction({
          action: 'claim_route',
          campaign_id: data.campaign,
          route_id: routeId,
          phase: 'Collection',
          volunteer_name: user.name,
          volunteer_phone: user.phone
        });
      } else {
        // Volunteer opted OUT of donation pickup: flags route as an Orphan
        await sendAction({
          action: 'claim_route',
          campaign_id: data.campaign,
          route_id: routeId,
          phase: 'Tagging',
          volunteer_name: user.name,
          volunteer_phone: user.phone
        });
        // Dispatch orphan route alert to API
        await sendAction({
          action: 'flag_orphan_route',
          campaign_id: data.campaign,
          route_id: routeId,
          volunteer_name: user.name,
          notes: 'Volunteer opted out of donation pickup. Needs pickup driver.'
        });
      }
    } else {
      // Direct pickup claim (e.g. adopting an orphan route or standard Phase B claim)
      await sendAction({
        action: 'claim_route',
        campaign_id: data.campaign,
        route_id: routeId,
        phase: 'Collection',
        volunteer_name: user.name,
        volunteer_phone: user.phone
      });
    }

    setClaimingRoute(null);
  };

  // Mark route completed
  const completeRoute = (routeId, forcedPhase = null) => {
    const phaseToUse = forcedPhase || routePhase;
    let bags = '0';
    if (phaseToUse === 'collection') {
      const input = prompt("How many bags/boxes of food were collected from this route?", "5");
      if (input === null) return;
      bags = input.trim() || '0';
    } else {
      if (!window.confirm(`Confirm all door tags have been distributed for Route #${routeId}?`)) return;
    }

    sendAction({
      action: 'complete_route',
      campaign_id: data.campaign,
      route_id: routeId,
      phase: phaseToUse === 'tagging' ? 'Tagging' : 'Collection',
      bags_collected: bags
    });
  };

  // Real-Time Route Notes Save Handler
  const handleSaveRouteNote = (routeId, noteText) => {
    const trimmed = noteText.trim();
    const updated = {
      ...routeNotes,
      [routeId]: {
        text: trimmed,
        author: user.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };
    setRouteNotes(updated);

    sendAction({
      action: 'update_route_notes',
      campaign_id: data.campaign,
      route_id: routeId,
      volunteer_name: user.name,
      notes: trimmed
    });
  };

  // --- PANTRY SIGNUP HANDLERS ---
  const handleTogglePantrySlot = (slotTime) => {
    setSelectedPantrySlots(prev => 
      prev.includes(slotTime) 
        ? prev.filter(t => t !== slotTime) 
        : [...prev, slotTime]
    );
  };

  const handleSelectEntireShift = () => {
    const allTimes = PANTRY_SLOTS.map(s => s.time);
    const hasAll = allTimes.every(t => selectedPantrySlots.includes(t));
    if (hasAll) {
      setSelectedPantrySlots([]);
    } else {
      setSelectedPantrySlots(allTimes);
    }
  };

  const handlePantrySignupSubmit = (e) => {
    e.preventDefault();
    if (selectedPantrySlots.length === 0) {
      alert("Please select at least one 1-hour block or choose the entire 9:00 AM – 1:00 PM shift.");
      return;
    }

    const newSignup = {
      id: 'signup-' + Date.now(),
      name: pantryForm.name.trim(),
      phone: pantryForm.phone.trim(),
      email: pantryForm.email.trim(),
      affiliation: pantryForm.affiliation,
      partySize: parseInt(pantryForm.partySize, 10) || 1,
      times: selectedPantrySlots,
      notes: pantryForm.notes.trim(),
      createdAt: new Date().toISOString()
    };

    setPantrySignups(prev => [newSignup, ...prev]);
    if (newSignup.phone) {
      setContactRegistry(prev => ({ ...prev, [newSignup.name.toLowerCase()]: newSignup.phone }));
    }

    sendAction({
      action: 'pantry_signup',
      campaign_id: data.campaign,
      volunteer_name: newSignup.name,
      volunteer_phone: newSignup.phone,
      volunteer_email: newSignup.email,
      party_size: newSignup.partySize,
      times: selectedPantrySlots.join('; '),
      notes: newSignup.notes
    });

    setPantrySuccessMessage(`Thank you, ${newSignup.name}! You are confirmed for ${selectedPantrySlots.length} time block(s) at the Food Pantry.`);
    setSelectedPantrySlots([]);
    setTimeout(() => setPantrySuccessMessage(null), 6000);
  };

  const handleRemovePantrySignup = (id) => {
    if (!window.confirm("Remove this volunteer shift?")) return;
    setPantrySignups(prev => prev.filter(item => item.id !== id));
  };

  // Copy Master Pantry Roster to clipboard
  const handleCopyPantrySchedule = () => {
    let text = `FARMINGTON FOOD PANTRY VOLUNTEER SCHEDULE (9:00 AM - 1:00 PM)\nCampaign: ${data.campaign}\nLocation: Amistad Hall (75 Main St, Farmington, CT)\n\n`;
    PANTRY_SLOTS.forEach(slot => {
      text += `--- ${slot.label.toUpperCase()} ---\n`;
      const signed = pantrySignups.filter(s => s.times.includes(slot.time));
      if (signed.length === 0) {
        text += `(No volunteers registered yet)\n`;
      } else {
        signed.forEach(v => {
          text += `• ${v.name} (${v.phone || 'No phone'}) - ${v.partySize} volunteer(s) [${v.affiliation}]${v.notes ? ` - Notes: ${v.notes}` : ''}\n`;
        });
      }
      text += `\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 3000);
  };

  // Identify Orphan Routes (Have Door Tag Volunteer, but NO Donation Pickup Volunteer)
  const orphanRoutesList = useMemo(() => {
    return data.routes.filter(route => {
      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
      const colClaim = getClaimInfo(route.Route_ID, 'collection');
      return Boolean(tagClaim && !colClaim);
    });
  }, [data.routes, getClaimInfo]);

  // Identify Current Volunteer's Claimed Routes
  const myClaimedRoutes = useMemo(() => {
    if (!user) return [];
    return data.routes.filter(route => {
      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
      const colClaim = getClaimInfo(route.Route_ID, 'collection');
      const isMyTag = tagClaim?.Volunteer_Name === user.name;
      const isMyCol = colClaim?.Volunteer_Name === user.name;
      return isMyTag || isMyCol;
    });
  }, [data.routes, user, getClaimInfo]);

  // Current Volunteer's Pantry Shifts
  const myPantryShifts = useMemo(() => {
    if (!user) return [];
    return pantrySignups.filter(s => s.name.trim().toLowerCase() === user.name.trim().toLowerCase());
  }, [pantrySignups, user]);

  // --- STATS COMPUTATIONS FOR DASHBOARD ---
  const stats = useMemo(() => {
    const totalRoutes = data.routes.length;
    if (totalRoutes === 0) {
      return {
        totalRoutes: 0,
        taggingAvailable: 0,
        taggingClaimed: 0,
        taggingCompleted: 0,
        taggingAbandoned: 0,
        collectionAvailable: 0,
        collectionClaimed: 0,
        collectionCompleted: 0,
        collectionAbandoned: 0,
        orphanCount: 0,
        totalHouses: 0,
        housesCoveredTagging: 0,
        housesCoveredCollection: 0,
        totalBagsCollected: 0
      };
    }

    let taggingAvailable = 0;
    let taggingClaimed = 0;
    let taggingCompleted = 0;
    let taggingAbandoned = 0;

    let collectionAvailable = 0;
    let collectionClaimed = 0;
    let collectionCompleted = 0;
    let collectionAbandoned = 0;

    let orphanCount = 0;
    let totalHouses = 0;
    let housesCoveredTagging = 0;
    let housesCoveredCollection = 0;
    let totalBagsCollected = 0;

    data.routes.forEach(route => {
      const houses = Number(route.Total_Houses) || 0;
      totalHouses += houses;

      // Tagging
      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
      if (!tagClaim) {
        taggingAvailable++;
        taggingAbandoned++;
      } else if (tagClaim.Status === 'Completed') {
        taggingCompleted++;
        housesCoveredTagging += houses;
      } else {
        taggingClaimed++;
        housesCoveredTagging += houses;
      }

      // Collection
      const colClaim = getClaimInfo(route.Route_ID, 'collection');
      if (!colClaim) {
        collectionAvailable++;
        collectionAbandoned++;
      } else if (colClaim.Status === 'Completed') {
        collectionCompleted++;
        housesCoveredCollection += houses;
        const bags = Number(colClaim.Bags_Collected) || 0;
        totalBagsCollected += bags;
      } else {
        collectionClaimed++;
        housesCoveredCollection += houses;
        if (colClaim.Bags_Collected) {
          totalBagsCollected += Number(colClaim.Bags_Collected) || 0;
        }
      }

      // Orphan calculation: Tagged but no collection driver
      if (tagClaim && !colClaim) {
        orphanCount++;
      }
    });

    return {
      totalRoutes,
      taggingAvailable,
      taggingClaimed,
      taggingCompleted,
      taggingAbandoned,
      collectionAvailable,
      collectionClaimed,
      collectionCompleted,
      collectionAbandoned,
      orphanCount,
      totalHouses,
      housesCoveredTagging,
      housesCoveredCollection,
      totalBagsCollected
    };
  }, [data, getClaimInfo]);

  // Filtered routes for Section 1 (Route Selection)
  const filteredRoutes = useMemo(() => {
    return data.routes.filter(route => {
      const claim = getClaimInfo(route.Route_ID, routePhase);
      const isAvailable = !claim;
      const isMyClaim = claim?.Volunteer_Name === user?.name;
      const isCompleted = claim?.Status === 'Completed';

      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
      const colClaim = getClaimInfo(route.Route_ID, 'collection');
      const isOrphan = Boolean(tagClaim && !colClaim);

      // Status filter
      if (routeFilter === 'available' && !isAvailable) return false;
      if (routeFilter === 'claimed' && (!claim || isCompleted)) return false;
      if (routeFilter === 'my_routes' && !isMyClaim) return false;
      if (routeFilter === 'completed' && !isCompleted) return false;
      if (routeFilter === 'orphans' && !isOrphan) return false;
      if (routeFilter === 'alerts' && !route.Permanent_Alerts) return false;

      // Text search
      if (routeSearchQuery.trim()) {
        const query = routeSearchQuery.toLowerCase();
        const idMatch = String(route.Route_ID).includes(query);
        const nameMatch = (route.Route_Name || '').toLowerCase().includes(query);
        const alertMatch = (route.Permanent_Alerts || '').toLowerCase().includes(query);
        const streets = (getRouteStreets(route) || '').toLowerCase();
        const streetMatch = streets.includes(query);
        const volunteerMatch = (claim?.Volunteer_Name || '').toLowerCase().includes(query);
        const noteMatch = (routeNotes[route.Route_ID]?.text || '').toLowerCase().includes(query);
        return idMatch || nameMatch || alertMatch || streetMatch || volunteerMatch || noteMatch;
      }

      return true;
    });
  }, [data.routes, routePhase, routeFilter, routeSearchQuery, user, getClaimInfo, routeNotes]);

  // Search Results for Section 3 (Dispatch Address Finder)
  const searchResults = useMemo(() => {
    if (!dashboardSearchQuery.trim()) return [];
    const query = dashboardSearchQuery.trim().toLowerCase();

    return data.routes.filter(route => {
      const idMatch = String(route.Route_ID) === query || `route ${route.Route_ID}` === query || `r${route.Route_ID}` === query;
      const nameMatch = (route.Route_Name || '').toLowerCase().includes(query);
      const alertMatch = (route.Permanent_Alerts || '').toLowerCase().includes(query);
      const streets = (getRouteStreets(route) || '').toLowerCase();
      const streetMatch = streets.includes(query);

      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
      const colClaim = getClaimInfo(route.Route_ID, 'collection');
      const tagVol = (tagClaim?.Volunteer_Name || '').toLowerCase().includes(query);
      const colVol = (colClaim?.Volunteer_Name || '').toLowerCase().includes(query);
      const noteMatch = (routeNotes[route.Route_ID]?.text || '').toLowerCase().includes(query);

      return idMatch || nameMatch || alertMatch || streetMatch || tagVol || colVol || noteMatch;
    });
  }, [dashboardSearchQuery, data.routes, getClaimInfo, routeNotes]);

  // Trigger Print Dossier
  const handlePrintDossier = () => {
    window.print();
  };

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="w-16 h-16 bg-scout-100 text-scout-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MapPin size={32} />
          </div>
          <div className="text-center mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-scout-600 bg-scout-50 px-3 py-1 rounded-full border border-scout-100">
              Scouting for Food
            </span>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mt-3">Scout Dispatch</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your details to coordinate routes and food pantry shifts.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Volunteer / Family Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-scout-500 transition-all" 
                placeholder="e.g. The Smith Family / Claire B." 
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Mobile Phone (For Dispatch Alerts)</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-scout-500 transition-all" 
                placeholder="(860) 555-0123" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-scout-600 hover:bg-scout-700 text-white font-black uppercase tracking-wider text-xs rounded-xl px-4 py-4 mt-2 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Enter Dispatch Command</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN SFF DISPATCH APPLICATION ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">

      {/* Print Stylesheet for Volunteer Dossier */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-volunteer-dossier, #printable-volunteer-dossier * {
            visibility: visible !important;
          }
          #printable-volunteer-dossier {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            color: black !important;
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-scout-600 text-white rounded-xl flex items-center justify-center shadow-md">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-base sm:text-lg leading-tight uppercase tracking-tight">SFF Dispatch</h1>
                <span className="hidden sm:inline-block bg-scout-100 text-scout-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-scout-200">
                  {data.campaign}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <span>{user.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-mono text-[11px]">{user.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dossier Button */}
            <button
              onClick={() => setShowDossierModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-900 hover:bg-black text-white rounded-xl shadow-sm transition-all"
              title="View and Print your volunteer route and pantry schedule"
            >
              <Printer size={14} className="text-amber-400" />
              <span>My Field Dossier</span>
              {myClaimedRoutes.length > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {myClaimedRoutes.length}
                </span>
              )}
            </button>

            <button 
              onClick={fetchData} 
              disabled={refreshing}
              title="Refresh Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin text-scout-600" : ""} />
            </button>
            <button 
              onClick={handleLogout} 
              title="Sign Out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Top 3 Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-2 sm:gap-4 overflow-x-auto border-t border-slate-100 pt-1">
          <button 
            onClick={() => setActiveSection('routes')}
            className={`py-3 px-3 sm:px-4 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${activeSection === 'routes' ? 'text-scout-600 border-scout-600 bg-scout-50/50' : 'text-slate-500 hover:text-slate-800 border-transparent'}`}
          >
            <MapPin size={16} />
            <span>1. Route Selection</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {data.routes.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveSection('pantry')}
            className={`py-3 px-3 sm:px-4 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${activeSection === 'pantry' ? 'text-scout-600 border-scout-600 bg-scout-50/50' : 'text-slate-500 hover:text-slate-800 border-transparent'}`}
          >
            <HeartHandshake size={16} />
            <span>2. Food Sorting Signup</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              9 AM - 1 PM
            </span>
          </button>

          <button 
            onClick={() => setActiveSection('dashboard')}
            className={`py-3 px-3 sm:px-4 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${activeSection === 'dashboard' ? 'text-scout-600 border-scout-600 bg-scout-50/50' : 'text-slate-500 hover:text-slate-800 border-transparent'}`}
          >
            <ClipboardList size={16} />
            <span>3. Dispatch Dashboard</span>
            {orphanRoutesList.length > 0 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-black animate-pulse">
                {orphanRoutesList.length} Orphan
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                Manager View
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-6xl mx-auto px-4 pt-6 no-print">

        {/* ======================================================== */}
        {/* SECTION 1: ROUTE SELECTION (TAGS & PICKUP)               */}
        {/* ======================================================== */}
        {activeSection === 'routes' && (
          <div className="space-y-6">
            
            {/* Phase Switcher Banner: A) Tag Distribution vs B) Donation Pickup */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-scout-600">Active Operation</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {routePhase === 'tagging' ? 'Phase A: Door Tag Distribution' : 'Phase B: Food Donation Pickup'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    {routePhase === 'tagging' 
                      ? 'Drop official Scouting for Food collection bags & door tags onto front porches. (Door tag volunteers default to also picking up donations on collection day).'
                      : 'Pick up non-perishable food bags left outside by Farmington residents and transport directly to the Farmington Food Pantry at Amistad Hall.'}
                  </p>
                </div>

                {/* Sub-phase selector buttons */}
                <div className="inline-flex p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setRoutePhase('tagging')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${routePhase === 'tagging' ? 'bg-scout-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Package size={14} />
                    <span>A) Door Tags</span>
                  </button>
                  <button 
                    onClick={() => setRoutePhase('collection')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${routePhase === 'collection' ? 'bg-scout-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <CheckCircle size={14} />
                    <span>B) Food Pickup</span>
                  </button>
                </div>
              </div>

              {/* Live Phase Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Total Routes</span>
                  <span className="text-lg font-black text-slate-800">{stats.totalRoutes}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block">Available (Unclaimed)</span>
                  <span className="text-lg font-black text-emerald-800">
                    {routePhase === 'tagging' ? stats.taggingAvailable : stats.collectionAvailable}
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-black uppercase text-blue-700 block">Assigned / Active</span>
                  <span className="text-lg font-black text-blue-800">
                    {routePhase === 'tagging' ? stats.taggingClaimed : stats.collectionClaimed}
                  </span>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700 block">Completed</span>
                  <span className="text-lg font-black text-purple-800">
                    {routePhase === 'tagging' ? stats.taggingCompleted : stats.collectionCompleted}
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-black uppercase text-amber-800 block">Orphan Routes</span>
                  <span className="text-lg font-black text-amber-900">
                    {orphanRoutesList.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={routeSearchQuery}
                  onChange={(e) => setRouteSearchQuery(e.target.value)}
                  placeholder="Filter by route #, street name, notes, or alert (e.g. 'Route 4', 'Westwoods', 'HOA')..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                />
                {routeSearchQuery && (
                  <button onClick={() => setRouteSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'available', label: 'Available' },
                  { id: 'claimed', label: 'Claimed' },
                  { id: 'my_routes', label: `My Routes (${myClaimedRoutes.length})` },
                  { id: 'orphans', label: `Orphans (${orphanRoutesList.length})` },
                  { id: 'completed', label: 'Completed' },
                  { id: 'alerts', label: 'Has Alerts' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRouteFilter(tab.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${routeFilter === tab.id ? 'bg-slate-900 text-white' : tab.id === 'orphans' && orphanRoutesList.length > 0 ? 'bg-amber-100 text-amber-900 font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Cards List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
                <div className="animate-spin w-10 h-10 border-4 border-scout-100 border-t-scout-600 rounded-full mb-3"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syncing with Google Sheets...</p>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <MapPin size={36} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No matching routes found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try clearing your search query or switching the status filter above.</p>
                <button 
                  onClick={() => { setRouteFilter('all'); setRouteSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRoutes.map((route) => {
                  const claimInfo = getClaimInfo(route.Route_ID, routePhase);
                  const isAvailable = !claimInfo;
                  const isMyClaim = claimInfo?.Volunteer_Name === user.name;
                  const isCompleted = claimInfo?.Status === 'Completed';
                  const streetList = getRouteStreets(route);
                  const volunteerPhone = claimInfo ? getVolunteerPhone(claimInfo.Volunteer_Name) : null;
                  const currentNoteMeta = routeNotes[route.Route_ID];
                  const currentNoteText = currentNoteMeta?.text || '';

                  const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
                  const colClaim = getClaimInfo(route.Route_ID, 'collection');
                  const isOrphan = Boolean(tagClaim && !colClaim);

                  return (
                    <div 
                      key={route.Route_ID} 
                      className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${isMyClaim ? 'border-scout-300 ring-2 ring-scout-100' : isOrphan ? 'border-amber-300 bg-amber-50/20' : isCompleted ? 'border-emerald-200 bg-emerald-50/20' : isAvailable ? 'border-slate-200' : 'border-slate-100'}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Route Header & Listed Streets */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-md font-mono">
                              ROUTE #{route.Route_ID}
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">
                              {route.Total_Houses} Houses
                            </span>
                            {isOrphan && (
                              <span className="flex items-center gap-1 text-amber-900 bg-amber-100 text-[10px] font-black px-2 py-0.5 rounded-md uppercase border border-amber-300">
                                <AlertOctagon size={12} className="text-amber-700" /> Orphan: Needs Donation Pickup Driver
                              </span>
                            )}
                            {route.Permanent_Alerts && (
                              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 text-[10px] font-black px-2 py-0.5 rounded-md uppercase border border-amber-200">
                                <AlertTriangle size={12} /> {route.Permanent_Alerts}
                              </span>
                            )}
                            {isMyClaim && (
                              <span className="bg-scout-100 text-scout-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase border border-scout-200">
                                ★ Your Assigned Route
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 text-lg leading-snug">
                            {route.Route_Name}
                          </h3>

                          {/* STREET DESCRIPTION FROM SHEET OR MAP */}
                          {streetList ? (
                            <div className="mt-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-scout-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                                    Covered Streets on this Route:
                                  </span>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                                    {streetList}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                <span>Streets: <strong className="text-slate-700 font-semibold">View turn-by-turn boundaries on route map</strong></span>
                              </div>
                              {route.Map_URL && (
                                <a 
                                  href={route.Map_URL} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs font-bold text-scout-600 hover:text-scout-700 flex items-center gap-1 self-start sm:self-auto"
                                >
                                  <span>Open Google Map</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Claim Status & Volunteer info badge */}
                          {claimInfo && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-slate-500 font-medium">Assigned to:</span>
                              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                                {claimInfo.Volunteer_Name}
                              </span>
                              {volunteerPhone && (
                                <a 
                                  href={`tel:${volunteerPhone.replace(/\D/g, '')}`} 
                                  className="text-scout-600 hover:text-scout-700 font-semibold flex items-center gap-1 bg-scout-50 px-2 py-0.5 rounded-md border border-scout-100"
                                >
                                  <PhoneCall size={12} />
                                  <span>{volunteerPhone}</span>
                                </a>
                              )}
                              {claimInfo.Bags_Collected && Number(claimInfo.Bags_Collected) > 0 && (
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                  📦 {claimInfo.Bags_Collected} Bags Collected
                                </span>
                              )}
                            </div>
                          )}

                          {/* REAL-TIME ROUTE NOTES SECTION */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            {editingNoteRouteId === route.Route_ID ? (
                              <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/90 space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                    <StickyNote size={13} className="text-amber-700" />
                                    <span>Real-Time Route Note</span>
                                  </label>
                                  <button 
                                    onClick={() => setEditingNoteRouteId(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                <p className="text-[11px] text-amber-800/80 leading-tight">
                                  Enter real-time route observations (e.g. &ldquo;HOA no solicitation allowed&rdquo;, &ldquo;High yield donations&rdquo;, &ldquo;Gate code 1234&rdquo;).
                                </p>
                                <textarea
                                  rows={2}
                                  defaultValue={currentNoteText}
                                  id={`note-input-${route.Route_ID}`}
                                  placeholder="Type route real-time info here..."
                                  className="w-full bg-white border border-amber-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteRouteId(null)}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const el = document.getElementById(`note-input-${route.Route_ID}`);
                                      handleSaveRouteNote(route.Route_ID, el ? el.value : '');
                                      setEditingNoteRouteId(null);
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm"
                                  >
                                    Save Note
                                  </button>
                                </div>
                              </div>
                            ) : currentNoteText ? (
                              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2">
                                  <StickyNote size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                                        Real-Time Route Note:
                                      </span>
                                      {currentNoteMeta?.author && (
                                        <span className="text-[10px] text-amber-700 font-semibold">
                                          — {currentNoteMeta.author} {currentNoteMeta.timestamp && `(${currentNoteMeta.timestamp})`}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium text-slate-800 mt-0.5 leading-relaxed">
                                      {currentNoteText}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setEditingNoteRouteId(route.Route_ID)}
                                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap self-start"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="text-[11px] italic">
                                  Route notes are for real-time info (e.g. HOA no solicitation allowed, or high yield donations).
                                </span>
                                <button
                                  onClick={() => setEditingNoteRouteId(route.Route_ID)}
                                  className="text-[11px] font-bold text-scout-600 hover:text-scout-800 hover:underline flex items-center gap-1"
                                >
                                  <Plus size={12} />
                                  <span>Add Note</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions and Status Controls */}
                        <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          {route.Map_URL ? (
                            <a 
                              href={route.Map_URL} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs font-bold text-scout-600 hover:text-scout-700 flex items-center gap-1 mb-1"
                            >
                              <span>View Boundary Map</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 mb-1">Standard Boundaries</span>
                          )}

                          {isAvailable ? (
                            <button 
                              onClick={() => startClaimRoute(route)}
                              className="w-full sm:w-auto lg:w-44 bg-scout-600 hover:bg-scout-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-all hover:shadow"
                            >
                              {routePhase === 'tagging' ? 'Claim Route (Tags + Pickup)' : 'Claim Food Pickup'}
                            </button>
                          ) : isOrphan && routePhase === 'collection' ? (
                            <button 
                              onClick={() => startClaimRoute(route)}
                              className="w-full sm:w-auto lg:w-44 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                            >
                              <AlertOctagon size={14} />
                              <span>Adopt Orphan Pickup</span>
                            </button>
                          ) : isCompleted ? (
                            <div className="w-full sm:w-auto lg:w-44 bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200">
                              <CheckCircle size={15} /> Completed
                            </div>
                          ) : isMyClaim ? (
                            <button 
                              onClick={() => completeRoute(route.Route_ID)}
                              className="w-full sm:w-auto lg:w-44 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                            >
                              <Check size={16} />
                              <span>Mark Done</span>
                            </button>
                          ) : (
                            <div className="w-full sm:w-auto lg:w-44 bg-slate-100 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl text-center border border-slate-200">
                              Claimed
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: FOOD SORTING SIGNUP (PANTRY SCHEDULE)         */}
        {/* ======================================================== */}
        {activeSection === 'pantry' && (
          <div className="space-y-6">
            
            {/* Mission Hero Card */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    <Building2 size={12} />
                    <span>Farmington Food Pantry HQ</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    Food Sorting Volunteer Shifts
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                    Help organize, inspect dates, weigh, and pack non-perishable donations delivered by Troop 170 drivers. 
                    Volunteers can select individual 1-hour time blocks or commit to the full 9:00 AM – 1:00 PM shift.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700">
                      <MapPin size={14} className="text-amber-600" /> Amistad Hall (75 Main St, Farmington)
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Clock size={14} className="text-amber-600" /> Saturday, 9:00 AM – 1:00 PM
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Users size={14} className="text-amber-600" /> Scouts & Family Welcome
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm text-center md:min-w-[220px]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Shift Signups</span>
                  <span className="text-3xl font-black text-amber-600 block mt-1">
                    {pantrySignups.reduce((acc, s) => acc + (s.partySize || 1), 0)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Volunteers Registered</span>
                </div>
              </div>
            </div>

            {pantrySuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-sm font-bold">{pantrySuccessMessage}</p>
                </div>
                <button
                  onClick={() => setShowDossierModal(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 whitespace-nowrap"
                >
                  <Printer size={13} />
                  <span>Print Dossier</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Volunteer Registration Form */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight flex items-center gap-2">
                    <UserPlus size={18} className="text-scout-600" />
                    <span>Volunteer Shift Registration</span>
                  </h3>
                  <button 
                    type="button"
                    onClick={handleSelectEntireShift}
                    className="text-xs font-black uppercase text-scout-600 hover:text-scout-700 hover:underline"
                  >
                    {PANTRY_SLOTS.every(s => selectedPantrySlots.includes(s.time)) ? 'Deselect All' : 'Select Full Shift (9-1 PM)'}
                  </button>
                </div>

                <form onSubmit={handlePantrySignupSubmit} className="space-y-4">
                  
                  {/* Shift Selection: 1-hr blocks or full shift */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Select Your Shift Window *
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Pick 1 or multiple blocks</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PANTRY_SLOTS.map(slot => {
                        const isSelected = selectedPantrySlots.includes(slot.time);
                        const enrolledCount = pantrySignups.filter(s => s.times.includes(slot.time)).reduce((sum, s) => sum + (s.partySize || 1), 0);
                        const pct = Math.min(100, Math.round((enrolledCount / slot.target) * 100));

                        return (
                          <div
                            key={slot.id}
                            onClick={() => handleTogglePantrySlot(slot.time)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-scout-600 bg-scout-50 ring-2 ring-scout-500/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{slot.label}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-scout-600 text-white' : 'border border-slate-300 bg-white'}`}>
                                {isSelected && <Check size={12} />}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-tight">{slot.desc}</p>
                            
                            {/* Capacity Bar */}
                            <div className="mt-2.5 flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-scout-500' : 'bg-amber-500'}`}
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                {enrolledCount} / {slot.target}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Button for Entire Shift */}
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={handleSelectEntireShift}
                        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${PANTRY_SLOTS.every(s => selectedPantrySlots.includes(s.time)) ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'}`}
                      >
                        <Sparkles size={14} />
                        <span>All-Morning Champion: Entire Shift (9:00 AM – 1:00 PM)</span>
                      </button>
                    </div>
                  </div>

                  {/* Personal Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Volunteer Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={pantryForm.name}
                        onChange={(e) => setPantryForm({ ...pantryForm, name: e.target.value })}
                        placeholder="e.g. John Doe" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Mobile Phone *</label>
                      <input 
                        type="tel" 
                        required 
                        value={pantryForm.phone}
                        onChange={(e) => setPantryForm({ ...pantryForm, phone: e.target.value })}
                        placeholder="(860) 555-0123" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={pantryForm.email}
                        onChange={(e) => setPantryForm({ ...pantryForm, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Troop Affiliation</label>
                      <select 
                        value={pantryForm.affiliation}
                        onChange={(e) => setPantryForm({ ...pantryForm, affiliation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      >
                        <option value="Troop 170 Scout & Parent">Troop 170 Scout & Parent</option>
                        <option value="Troop 170 Scout">Troop 170 Scout</option>
                        <option value="Parent / Guardian">Parent / Guardian</option>
                        <option value="Adult Leader / Committee">Adult Leader / Committee</option>
                        <option value="Community Volunteer">Community Volunteer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Helpers in Your Group</label>
                      <select 
                        value={pantryForm.partySize}
                        onChange={(e) => setPantryForm({ ...pantryForm, partySize: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      >
                        <option value="1">1 Person (Just me)</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5+ People</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">Special Notes / Physical limits</label>
                      <input 
                        type="text" 
                        value={pantryForm.notes}
                        onChange={(e) => setPantryForm({ ...pantryForm, notes: e.target.value })}
                        placeholder="e.g. Can lift heavy crates / prefer seated sorting" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-scout-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-scout-600 hover:bg-scout-700 text-white font-black uppercase tracking-wider text-xs rounded-xl py-3.5 mt-2 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <UserCheck size={16} />
                    <span>Confirm Food Sorting Shift ({selectedPantrySlots.length} Blocks)</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Confirmed Shift Schedule by Time Slot */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
                      <Calendar size={16} className="text-scout-600" />
                      <span>Live Pantry Roster</span>
                    </h3>
                    <button 
                      onClick={handleCopyPantrySchedule}
                      className="text-slate-500 hover:text-slate-900 text-xs font-bold flex items-center gap-1"
                      title="Copy schedule to clipboard"
                    >
                      <Copy size={13} />
                      <span>{copiedSchedule ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {PANTRY_SLOTS.map(slot => {
                      const attendees = pantrySignups.filter(s => s.times.includes(slot.time));
                      const totalHeadcount = attendees.reduce((sum, a) => sum + (a.partySize || 1), 0);

                      return (
                        <div key={slot.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-xs text-slate-800">{slot.label}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${totalHeadcount >= slot.target ? 'bg-emerald-100 text-emerald-800' : totalHeadcount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                              {totalHeadcount} / {slot.target} Registered
                            </span>
                          </div>

                          {attendees.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic py-1">No volunteers registered yet.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {attendees.map(v => (
                                <div key={v.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-100">
                                  <div>
                                    <span className="font-bold text-slate-800">{v.name}</span>
                                    <span className="text-[10px] text-slate-400 ml-1.5">({v.partySize} {v.partySize > 1 ? 'people' : 'person'})</span>
                                    {v.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">{v.notes}</p>}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {v.phone && (
                                      <a href={`tel:${v.phone.replace(/\D/g, '')}`} className="text-slate-400 hover:text-scout-600 p-1">
                                        <Phone size={12} />
                                      </a>
                                    )}
                                    <button 
                                      onClick={() => handleRemovePantrySignup(v.id)}
                                      className="text-slate-300 hover:text-red-500 p-1"
                                      title="Remove shift"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* What to Expect Card */}
                <div className="bg-scout-50 rounded-2xl p-5 border border-scout-200/60">
                  <h4 className="font-black text-xs uppercase tracking-wider text-scout-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-scout-600" />
                    <span>Volunteer Guidelines</span>
                  </h4>
                  <ul className="text-xs text-scout-700 space-y-1 mt-2 list-disc list-inside">
                    <li>Wear Class B Troop T-Shirt or comfortable clothes</li>
                    <li>Closed-toe shoes required for warehouse floor</li>
                    <li>Snacks and water bottles provided on site</li>
                    <li>Arrive 10 minutes before your scheduled window</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 3: DISPATCH COMMAND DASHBOARD (MANAGER VIEW)     */}
        {/* ======================================================== */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">

            {/* Manager View Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-scout-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-white/10">
                    <ClipboardList size={12} />
                    <span>Real-Time Operation Center</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">
                    Dispatch Command Center
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl font-light">
                    Overview of townwide route coverage, orphan route alerts, volunteer assignments, and food pantry staffing.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={fetchData} 
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors border border-white/10"
                  >
                    <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                    <span>Sync Sheet</span>
                  </button>
                  <button 
                    onClick={handleCopyPantrySchedule} 
                    className="px-4 py-2.5 bg-scout-600 hover:bg-scout-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Copy size={14} />
                    <span>{copiedSchedule ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
              </div>

              {/* 5 Primary Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Campaign Routes</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">{stats.totalRoutes}</span>
                    <span className="text-xs text-slate-400 font-medium">({stats.totalHouses} Houses)</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Tagging Claimed</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {Math.round(((stats.taggingClaimed + stats.taggingCompleted) / Math.max(1, stats.totalRoutes)) * 100)}%
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {stats.taggingClaimed + stats.taggingCompleted}/{stats.totalRoutes}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">Pickup Claimed</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-blue-400">
                      {Math.round(((stats.collectionClaimed + stats.collectionCompleted) / Math.max(1, stats.totalRoutes)) * 100)}%
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {stats.collectionClaimed + stats.collectionCompleted}/{stats.totalRoutes}
                    </span>
                  </div>
                </div>

                {/* ORPHAN ROUTES KPI */}
                <div 
                  onClick={() => { setActiveSection('routes'); setRouteFilter('orphans'); }}
                  className="bg-amber-500/20 rounded-xl p-4 border border-amber-400/40 cursor-pointer hover:bg-amber-500/30 transition-all"
                  title="Click to view all orphan routes needing pickup drivers"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center justify-between">
                    <span>Orphan Routes</span>
                    <AlertOctagon size={12} className="text-amber-400" />
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">{stats.orphanCount}</span>
                    <span className="text-[11px] text-amber-200/80 font-medium">Needs Pickup</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Unassigned Both</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-200">
                      {stats.taggingAvailable}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Open Routes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ORPHAN ROUTES ALERT BANNER */}
            {orphanRoutesList.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertOctagon size={22} />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 text-base uppercase tracking-tight">
                      {orphanRoutesList.length} Orphan Route(s) Require Donation Pickup Drivers!
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Volunteers distributed door tags for these routes but opted out of food pickup. They need a pickup driver assigned before collection day.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveSection('routes'); setRoutePhase('collection'); setRouteFilter('orphans'); }}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm whitespace-nowrap"
                >
                  Adopt Orphan Routes
                </button>
              </div>
            )}

            {/* ADDRESS & STREET LOOKUP TOOL */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-scout-600 block mb-1">Instant Lookup</span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Search size={20} className="text-scout-600" />
                  <span>Street, Address & Volunteer Finder</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Type any route number, resident address, or volunteer name to see route coverage, status, and direct contact details.
                </p>
              </div>

              <div className="mt-4 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={dashboardSearchQuery}
                  onChange={(e) => setDashboardSearchQuery(e.target.value)}
                  placeholder="Enter route # or street address (e.g. 'Route 4', 'Route 12', 'Westwoods')..."
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-scout-600 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base font-medium focus:outline-none transition-all shadow-inner"
                />
                {dashboardSearchQuery && (
                  <button onClick={() => setDashboardSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Instant Search Results */}
              {dashboardSearchQuery.trim() && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Found {searchResults.length} matching route(s) for &ldquo;{dashboardSearchQuery}&rdquo;
                    </span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500">No matching routes found for this search.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Try entering the route number (e.g., &ldquo;Route 4&rdquo; or &ldquo;4&rdquo;).</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map(route => {
                        const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
                        const colClaim = getClaimInfo(route.Route_ID, 'collection');
                        const tagPhone = tagClaim ? getVolunteerPhone(tagClaim.Volunteer_Name) : null;
                        const colPhone = colClaim ? getVolunteerPhone(colClaim.Volunteer_Name) : null;
                        const streets = getRouteStreets(route);
                        const noteMeta = routeNotes[route.Route_ID];
                        const isOrphan = Boolean(tagClaim && !colClaim);

                        return (
                          <div key={route.Route_ID} className={`rounded-xl p-4 border transition-all ${isOrphan ? 'bg-amber-50/60 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-900 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md">
                                  ROUTE #{route.Route_ID}
                                </span>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{route.Route_Name}</h4>
                                <span className="text-xs text-slate-500">({route.Total_Houses} Houses)</span>
                                {isOrphan && (
                                  <span className="bg-amber-200 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                                    Orphan: Needs Pickup Driver
                                  </span>
                                )}
                              </div>
                              {route.Permanent_Alerts && (
                                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md self-start">
                                  {route.Permanent_Alerts}
                                </span>
                              )}
                            </div>

                            {streets ? (
                              <p className="text-xs text-slate-600 mb-3">
                                <span className="font-black text-slate-400 uppercase text-[10px] block">Covered Streets:</span>
                                {streets}
                              </p>
                            ) : route.Map_URL ? (
                              <div className="mb-3">
                                <a 
                                  href={route.Map_URL} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs font-bold text-scout-600 hover:text-scout-700 flex items-center gap-1"
                                >
                                  <span>View Exact Turn-by-Turn Map & Streets</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            ) : null}

                            {noteMeta?.text && (
                              <div className="mb-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs">
                                <span className="text-[10px] font-black uppercase text-amber-800 block">Real-Time Note ({noteMeta.author || 'Volunteer'}):</span>
                                <p className="text-slate-800 font-medium mt-0.5">{noteMeta.text}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {/* Tagging Info */}
                              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                  Door Tag Distribution:
                                </span>
                                {tagClaim ? (
                                  <div>
                                    <span className="font-bold text-slate-900">{tagClaim.Volunteer_Name}</span>
                                    <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${tagClaim.Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                      {tagClaim.Status}
                                    </span>
                                    {tagPhone ? (
                                      <a href={`tel:${tagPhone.replace(/\D/g, '')}`} className="mt-1.5 flex items-center gap-1 text-scout-600 font-bold hover:underline">
                                        <PhoneCall size={12} /> {tagPhone}
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 block mt-1">Phone not logged</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      Unclaimed
                                    </span>
                                    <button 
                                      onClick={() => startClaimRoute(route)}
                                      className="text-[10px] font-black uppercase bg-slate-800 text-white px-2 py-1 rounded"
                                    >
                                      Claim
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Collection Info */}
                              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                  Food Pickup:
                                </span>
                                {colClaim ? (
                                  <div>
                                    <span className="font-bold text-slate-900">{colClaim.Volunteer_Name}</span>
                                    <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${colClaim.Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                      {colClaim.Status}
                                    </span>
                                    {colPhone ? (
                                      <a href={`tel:${colPhone.replace(/\D/g, '')}`} className="mt-1.5 flex items-center gap-1 text-scout-600 font-bold hover:underline">
                                        <PhoneCall size={12} /> {colPhone}
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 block mt-1">Phone not logged</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      {isOrphan ? 'Needs Pickup Driver' : 'Unclaimed'}
                                    </span>
                                    <button 
                                      onClick={() => startClaimRoute(route)}
                                      className="text-[10px] font-black uppercase bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded shadow-xs"
                                    >
                                      Adopt Pickup
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PROFESSIONAL MANAGER VIEW: FOOD PANTRY VOLUNTEER SCHEDULE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Pantry Master Timeline</span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Clock size={20} className="text-amber-600" />
                    <span>Food Pantry Volunteer Schedule (9:00 AM – 1:00 PM)</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopyPantrySchedule}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Copy size={13} />
                    <span>{copiedSchedule ? 'Copied' : 'Copy Schedule'}</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection('pantry')}
                    className="px-3.5 py-2 bg-scout-600 hover:bg-scout-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <UserPlus size={13} />
                    <span>Add Signups</span>
                  </button>
                </div>
              </div>

              {/* Hourly Schedule Timeline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PANTRY_SLOTS.map(slot => {
                  const attendees = pantrySignups.filter(s => s.times.includes(slot.time));
                  const totalCount = attendees.reduce((sum, a) => sum + (a.partySize || 1), 0);
                  const isStaffed = totalCount >= slot.target;

                  return (
                    <div key={slot.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-black text-sm text-slate-900">{slot.label}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isStaffed ? 'bg-emerald-100 text-emerald-800' : totalCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                            {totalCount} / {slot.target} Staff
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3">{slot.desc}</p>

                        {/* Attendee Roster */}
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {attendees.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2">No volunteers registered yet.</p>
                          ) : (
                            attendees.map(volunteer => (
                              <div key={volunteer.id} className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{volunteer.name}</span>
                                  <button 
                                    onClick={() => handleRemovePantrySignup(volunteer.id)} 
                                    className="text-slate-300 hover:text-red-500 text-[10px]"
                                    title="Remove signup"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                                  <span>{volunteer.affiliation}</span>
                                  <span className="font-bold text-slate-700 font-mono">+{volunteer.partySize}</span>
                                </div>
                                {volunteer.phone && (
                                  <a href={`tel:${volunteer.phone.replace(/\D/g, '')}`} className="mt-1 flex items-center gap-1 text-[11px] text-scout-600 font-semibold hover:underline">
                                    <Phone size={11} /> {volunteer.phone}
                                  </a>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80">
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${isStaffed ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {isStaffed ? '✓ Fully Covered' : `Needs ${Math.max(1, slot.target - totalCount)} More Helpers`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROUTE ROSTER AUDIT & ORPHAN ROUTES TRACKER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                    Master Route Coverage Ledger
                  </h3>
                  <p className="text-xs text-slate-500">Live monitoring of all 69 route claims, orphan routes, and field notes.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Phase:</span>
                  <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-bold">
                    <button 
                      onClick={() => setDashboardPhaseFilter('both')}
                      className={`px-2.5 py-1 rounded ${dashboardPhaseFilter === 'both' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Both
                    </button>
                    <button 
                      onClick={() => setDashboardPhaseFilter('tagging')}
                      className={`px-2.5 py-1 rounded ${dashboardPhaseFilter === 'tagging' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Tags
                    </button>
                    <button 
                      onClick={() => setDashboardPhaseFilter('collection')}
                      className={`px-2.5 py-1 rounded ${dashboardPhaseFilter === 'collection' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600'}`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>
              </div>

              {/* Compact table for quick manager auditing */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Route #</th>
                      <th className="py-2.5 px-3">Houses</th>
                      <th className="py-2.5 px-3">Boundaries / Streets</th>
                      <th className="py-2.5 px-3">Live Route Note</th>
                      {(dashboardPhaseFilter === 'both' || dashboardPhaseFilter === 'tagging') && (
                        <th className="py-2.5 px-3">Tag Distribution</th>
                      )}
                      {(dashboardPhaseFilter === 'both' || dashboardPhaseFilter === 'collection') && (
                        <th className="py-2.5 px-3">Food Pickup</th>
                      )}
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.routes.slice(0, 30).map(route => {
                      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
                      const colClaim = getClaimInfo(route.Route_ID, 'collection');
                      const streets = getRouteStreets(route);
                      const isOrphan = Boolean(tagClaim && !colClaim);
                      const noteText = routeNotes[route.Route_ID]?.text || '';

                      return (
                        <tr key={route.Route_ID} className={`hover:bg-slate-50/80 ${isOrphan ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            #{route.Route_ID}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-600">
                            {route.Total_Houses}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                            {streets ? streets : (
                              route.Map_URL ? (
                                <a href={route.Map_URL} target="_blank" rel="noreferrer" className="text-scout-600 hover:underline">
                                  View on Google Map
                                </a>
                              ) : 'Standard Zone'
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                            {noteText ? (
                              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-medium" title={noteText}>
                                {noteText}
                              </span>
                            ) : (
                              <span className="text-slate-300 italic text-[11px]">No notes</span>
                            )}
                          </td>

                          {(dashboardPhaseFilter === 'both' || dashboardPhaseFilter === 'tagging') && (
                            <td className="py-2.5 px-3">
                              {tagClaim ? (
                                <span className="font-semibold text-slate-800">
                                  {tagClaim.Volunteer_Name}
                                  <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded font-bold ${tagClaim.Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {tagClaim.Status}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  Unassigned
                                </span>
                              )}
                            </td>
                          )}

                          {(dashboardPhaseFilter === 'both' || dashboardPhaseFilter === 'collection') && (
                            <td className="py-2.5 px-3">
                              {colClaim ? (
                                <span className="font-semibold text-slate-800">
                                  {colClaim.Volunteer_Name}
                                  <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded font-bold ${colClaim.Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {colClaim.Status}
                                  </span>
                                </span>
                              ) : isOrphan ? (
                                <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-300 animate-pulse">
                                  ⚠️ Orphan (Needs Pickup)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  Unassigned
                                </span>
                              )}
                            </td>
                          )}

                          <td className="py-2.5 px-3 text-right">
                            <button 
                              onClick={() => {
                                setDashboardSearchQuery(`Route ${route.Route_ID}`);
                                window.scrollTo({ top: 350, behavior: 'smooth' });
                              }}
                              className="text-scout-600 hover:text-scout-800 font-bold hover:underline"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {data.routes.length > 30 && (
                <div className="mt-3 text-center pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Showing top 30 of {data.routes.length} total routes. Use the search tool above to inspect any specific route instantly.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* CLAIM CONFIRMATION MODAL (DUAL-PHASE DEFAULT AWARENESS)   */}
      {/* ======================================================== */}
      {claimingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md">
                  ROUTE #{claimingRoute.Route_ID}
                </span>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                  {claimingRoute.Route_Name}
                </h3>
              </div>
              <button 
                onClick={() => setClaimingRoute(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <p><strong>Total Houses:</strong> {claimingRoute.Total_Houses}</p>
                {claimingRoute.Permanent_Alerts && (
                  <p className="text-amber-800 font-semibold">⚠️ Alert: {claimingRoute.Permanent_Alerts}</p>
                )}
                {getRouteStreets(claimingRoute) && (
                  <p><strong>Streets:</strong> {getRouteStreets(claimingRoute)}</p>
                )}
              </div>

              {/* DUAL-PHASE OWNERSHIP NOTICE & OPTION */}
              {routePhase === 'tagging' ? (
                <div className="space-y-3">
                  <div className="bg-scout-50 border border-scout-200 rounded-xl p-3.5 text-xs text-scout-900">
                    <p className="font-black uppercase tracking-wider text-[11px] text-scout-800 mb-1 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-scout-600" />
                      <span>Troop 170 Dual-Phase Policy</span>
                    </p>
                    <p className="leading-relaxed">
                      Anyone who distributes door tags for a route defaults to also picking up donations for that same route on food collection morning.
                    </p>
                  </div>

                  {/* Radio / Choice Options */}
                  <div className="space-y-2">
                    <div 
                      onClick={() => setAlsoClaimPickup(true)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${alsoClaimPickup ? 'bg-scout-50/60 border-scout-600 ring-2 ring-scout-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                    >
                      <div className="mt-0.5">
                        {alsoClaimPickup ? <CheckSquare size={18} className="text-scout-600" /> : <Square size={18} className="text-slate-400" />}
                      </div>
                      <div>
                        <span className="font-black text-xs text-slate-900 block">
                          Yes, I will distribute door tags AND pick up food donations (Recommended)
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                          You own this route for both Phase A (Tags) and Phase B (Pickup).
                        </span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setAlsoClaimPickup(false)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${!alsoClaimPickup ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                    >
                      <div className="mt-0.5">
                        {!alsoClaimPickup ? <CheckSquare size={18} className="text-amber-700" /> : <Square size={18} className="text-slate-400" />}
                      </div>
                      <div>
                        <span className="font-black text-xs text-amber-950 block">
                          No, I cannot pick up donations (Door Tags Only)
                        </span>
                        <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                          This will flag Route #{claimingRoute.Route_ID} on the Dispatch Command Center as an <strong>Orphan Route</strong> needing a pickup driver.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
                  <p className="font-bold mb-1">Confirm Food Collection Pickup</p>
                  <p className="text-blue-800 leading-relaxed">
                    You are claiming Route #{claimingRoute.Route_ID} to pick up filled donation bags and transport them to the Farmington Food Pantry.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimingRoute(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeClaimRoute}
                  className="flex-[2] py-3 bg-scout-600 hover:bg-scout-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check size={16} />
                  <span>Confirm Route Claim</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VOLUNTEER DOSSIER MODAL & PRINTABLE PACKET               */}
      {/* ======================================================== */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs no-print">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Actions Bar (Not Printed) */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 sm:p-5 flex items-center justify-between z-10 no-print">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-scout-600" />
                <h3 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight">
                  Volunteer Field Dossier
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDossier}
                  className="px-4 py-2 bg-scout-600 hover:bg-scout-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer size={14} />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setShowDossierModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOSSIER CONTENT */}
            <div id="printable-volunteer-dossier" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
              
              {/* Dossier Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-scout-700 block">
                      Scouting America Troop 170 • Unionville, CT
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                      Scouting for Food Volunteer Dossier
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Campaign: {data.campaign} • Official Field Mission Packet</p>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-slate-500 font-mono">{user.phone}</p>
                    <p className="text-[10px] text-slate-400">Printed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* SECTION: ASSIGNED ROUTES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <MapPin size={16} className="text-scout-600" />
                    <span>Your Assigned Canvassing Route(s) ({myClaimedRoutes.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Total Houses: {myClaimedRoutes.reduce((acc, r) => acc + (Number(r.Total_Houses) || 0), 0)}
                  </span>
                </div>

                {myClaimedRoutes.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic border border-slate-100">
                    You have not claimed any neighborhood routes yet. Return to the Route Selection board to claim an open route.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myClaimedRoutes.map(route => {
                      const tagClaim = getClaimInfo(route.Route_ID, 'tagging');
                      const colClaim = getClaimInfo(route.Route_ID, 'collection');
                      const isMyTag = tagClaim?.Volunteer_Name === user.name;
                      const isMyCol = colClaim?.Volunteer_Name === user.name;
                      const streets = getRouteStreets(route);
                      const noteText = routeNotes[route.Route_ID]?.text || '';

                      return (
                        <div key={route.Route_ID} className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-900 text-white font-mono font-black text-xs px-2 py-0.5 rounded">
                                ROUTE #{route.Route_ID}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">{route.Route_Name}</span>
                              <span className="text-xs text-slate-500 font-semibold">({route.Total_Houses} Houses)</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold">
                              {isMyTag && isMyCol ? (
                                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px]">
                                  Full Ownership: Tags + Donation Pickup
                                </span>
                              ) : isMyTag ? (
                                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px]">
                                  Door Tags Only (Orphan Pickup)
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px]">
                                  Donation Pickup Only
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Streets & Map */}
                          <div className="text-xs space-y-1">
                            <p><strong>Covered Streets:</strong> {streets ? streets : 'View turn-by-turn road boundary map'}</p>
                            {route.Permanent_Alerts && (
                              <p className="text-amber-800 font-bold">⚠️ Route Alert: {route.Permanent_Alerts}</p>
                            )}
                            {noteText && (
                              <p className="text-slate-800 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                                <strong>Live Route Note:</strong> {noteText}
                              </p>
                            )}
                            {route.Map_URL && (
                              <p className="text-scout-700">
                                <strong>Map Link:</strong> <span className="underline">{route.Map_URL}</span>
                              </p>
                            )}
                          </div>

                          {/* Field Checklist */}
                          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs"></div>
                              <span>Pick up official tags & bags at HQ</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs"></div>
                              <span>Hang door tags on knobs (NOT mailboxes)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs"></div>
                              <span>Canvass route for filled food bags</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs"></div>
                              <span>Deliver crates directly to Amistad Hall</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION: PANTRY SORTING SHIFTS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <HeartHandshake size={16} className="text-amber-600" />
                    <span>Your Food Pantry Volunteer Schedule</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Amistad Hall, 75 Main St
                  </span>
                </div>

                {myPantryShifts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                    No food sorting shifts scheduled for this account. If you wish to help at the pantry, register on tab 2.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myPantryShifts.map(shift => (
                      <div key={shift.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900">
                            Confirmed Shifts: {shift.times.join(', ')}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Helpers: {shift.partySize} volunteer(s) • Affiliation: {shift.affiliation}
                          </p>
                          {shift.notes && (
                            <p className="text-[11px] text-slate-600 italic mt-0.5">Notes: {shift.notes}</p>
                          )}
                        </div>
                        <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded font-black text-[10px] uppercase whitespace-nowrap self-start sm:self-auto">
                          Confirmed Slot
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: EMERGENCY & EVENT PROTOCOL */}
              <div className="pt-2 border-t-2 border-slate-900 text-xs space-y-2 text-slate-700">
                <h4 className="font-black uppercase tracking-wider text-slate-900 text-[11px]">
                  Troop 170 Operation Protocols & Emergency Contacts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <p className="font-bold text-slate-900">Troop Leadership HQ</p>
                    <p className="text-slate-600">Dispatch: (860) 796-0170</p>
                    <p className="text-slate-500">For route questions or missed streets</p>
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <p className="font-bold text-slate-900">Food Pantry Intake</p>
                    <p className="text-slate-600">Amistad Hall, 75 Main St</p>
                    <p className="text-slate-500">All collections drop off by 1:00 PM</p>
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <p className="font-bold text-slate-900">Safety & Uniform</p>
                    <p className="text-slate-600">Class B Uniform / T-Shirt</p>
                    <p className="text-slate-500">Youth Protection rules in full effect</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
