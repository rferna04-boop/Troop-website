import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, AlertTriangle, ArrowRight, LogOut } from 'lucide-react';

// Live Google Apps Script API Endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbwc0jFa7_F-m22bsb5n-mUMJuDOzLOdxdtHHd6fmN2_Xf-kYA1BeZ3w_WqUX5BABql9/exec";

export default function ScoutDispatch() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tagging'); // 'tagging', 'collection', 'pantry'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ campaign: '', routes: [], claims: {} });

  // Handle Frictionless Login
  useEffect(() => {
    const savedUser = localStorage.getItem('sff_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const userData = { name, phone };
    localStorage.setItem('sff_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('sff_user');
    setUser(null);
  };

  // Fetch Data from Google Sheets API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback for development if API fails
      setData({ campaign: 'CAMP-2026', routes: [], claims: {} });
    }
    setLoading(false);
  };

  // Dispatch Action to Google Sheets API
  const sendAction = async (payload) => {
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      await fetchData(); // Refresh board after action
    } catch (error) {
      console.error("Action failed:", error);
      setLoading(false);
    }
  };

  const claimRoute = (routeId) => {
    if (!window.confirm("Confirm you want to claim this route?")) return;
    sendAction({
      action: 'claim_route',
      campaign_id: data.campaign,
      route_id: routeId,
      phase: activeTab === 'tagging' ? 'Tagging' : 'Collection',
      volunteer_name: user.name,
      volunteer_phone: user.phone
    });
  };

  const completeRoute = (routeId) => {
    const bags = prompt("How many bags/boxes were collected? (Enter 0 if tagging)");
    if (bags === null) return;
    
    sendAction({
      action: 'complete_route',
      campaign_id: data.campaign,
      route_id: routeId,
      phase: activeTab === 'tagging' ? 'Tagging' : 'Collection',
      bags_collected: bags
    });
  };

  // --- LOGIN SCREEN UI ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="w-16 h-16 bg-scout-100 text-scout-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          </div>
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Scout Dispatch</h1>
          <p className="text-slate-500 text-center mb-8">Enter your details to access the route board.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-scout-500 transition-all" placeholder="e.g. The Smith Family" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input type="tel" name="phone" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-scout-500 transition-all" placeholder="(860) 555-0123" />
            </div>
            <button type="submit" className="w-full bg-scout-500 hover:bg-scout-600 text-white font-semibold rounded-xl px-4 py-3.5 mt-4 transition-colors flex items-center justify-center gap-2">
              Enter Dispatch <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-scout-500 text-white rounded-xl flex items-center justify-center shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">Command Center</h1>
              <p className="text-xs font-medium text-slate-500">{user.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 p-2">
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto px-4 flex gap-6 overflow-x-auto no-scrollbar">
          {['tagging', 'collection', 'pantry'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold text-sm capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-scout-500 border-b-2 border-scout-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'tagging' ? '1. Door Tags' : tab === 'collection' ? '2. Food Pickup' : '3. Pantry Sorting'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-scout-100 border-t-scout-500 rounded-full"></div>
          </div>
        ) : (
          data.routes.map((route) => {
            const phaseKey = activeTab === 'tagging' ? 'Tagging' : 'Collection';
            const claimInfo = data.claims[route.Route_ID]?.[phaseKey];
            const isAvailable = !claimInfo;
            const isMyClaim = claimInfo?.Volunteer_Name === user.name;
            
            return (
              <div key={route.Route_ID} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                
                {/* Route Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">{route.Route_ID}</span>
                    {route.Permanent_Alerts && (
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        <AlertTriangle size={12} /> Alert
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{route.Route_Name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"> {route.Total_Houses} Houses</span>
                  </div>
                  {route.Permanent_Alerts && <p className="text-xs text-amber-700 mt-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100">{route.Permanent_Alerts}</p>}
                </div>

                {/* Actions & Status */}
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  {route.Map_URL ? (
                    <a href={route.Map_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold text-scout-500 hover:text-scout-600 flex items-center justify-center sm:justify-end gap-1 mb-1">
                      View Boundaries <ArrowRight size={14} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 mb-1">Map pending</span>
                  )}
                  
                  {isAvailable ? (
                    <button onClick={() => claimRoute(route.Route_ID)} className="w-full sm:w-32 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                      Claim Route
                    </button>
                  ) : claimInfo.Status === 'Completed' ? (
                    <div className="w-full sm:w-32 bg-emerald-50 text-emerald-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 border border-emerald-100">
                      <CheckCircle size={16} /> Completed
                    </div>
                  ) : isMyClaim ? (
                    <button onClick={() => completeRoute(route.Route_ID)} className="w-full sm:w-32 bg-scout-500 hover:bg-scout-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                      Mark Done
                    </button>
                  ) : (
                    <div className="w-full sm:w-32 bg-slate-100 text-slate-500 font-medium py-2.5 rounded-xl text-sm text-center border border-slate-200">
                      Claimed
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
