import React, { useState } from 'react';
import { 
  Tent, Lock, ArrowUpRight, Star, MapPin, Mail, Calendar, Phone, 
  Users, Compass, DollarSign, Award, CheckCircle, Clock, 
  MessageCircle, ExternalLink, Medal, Flame, Heart, Key, 
  FileText, Smartphone, CreditCard, ShieldCheck, Download, 
  LogOut, BookOpen, X, Search, Printer, Snowflake, Mountain, Backpack, Facebook, Sun
} from 'lucide-react';

export default function App() {
  const seaBaseDate = new Date('August 2, 2026').getTime();
  const today = new Date().getTime();
  const daysLeft = Math.floor((seaBaseDate - today) / (1000 * 60 * 60 * 24));
  
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
  // SEA BASE FUNDRAISER STATE
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const fundraisingTotal = 3250; 
  const fundraisingGoal = 5000;
  const fundraisingPercent = Math.min(100, Math.round((fundraisingTotal / fundraisingGoal) * 100));

  const troopNavy = "#1D3A6C";
  const troopRed = "#BE1E2D";
  const darkBg = "#0B0F19";

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
      content: "<ul style='line-height:1.8;'><li><strong>Pocketknife</strong> (Totin' Chip required)</li><li><strong>First-Aid Kit</strong> (personal size)</li><li><strong>Extra Clothing</strong> (layers)</li><li><strong>Rain Gear</strong> (jacket & pants)</li><li><strong>Water Bottle</strong> (full)</li><li><strong>Flashlight or Headlamp</strong> (fresh batteries)</li><li><strong>Trail Food</strong> (high energy)</li><li><strong>Matches & Fire Starter</strong></li><li><strong>Sun Protection</strong> (SPF 30+)</li><li><strong>Map and Compass</strong></li></ul>",
      plainText: "- Pocketknife\n- First-Aid Kit\n- Extra Clothing\n- Rain Gear\n- Water Bottle\n- Flashlight or Headlamp\n- Trail Food\n- Fire Starter\n- Sun Protection\n- Map and Compass"
    },
    { 
      id: 2, title: "Warm Weather Camping", desc: "Lightweight, moisture-wicking packing list for Spring and Summer overnight trips.", icon: <Sun size={28} />,
      type: "document",
      content: "<h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Clothing</h3><ul style='line-height:1.8;'><li>T-shirt or short-sleeved shirt</li><li>Hiking shorts</li><li>Underwear & Extra underwear</li><li>Socks (synthetic or wool blend)</li><li>Long-sleeved shirt</li><li>Brimmed hat</li><li>Bandana</li><li>Long pants (lightweight)</li><li>Sweater or warm jacket</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Cooking & Eating</h3><ul style='line-height:1.8;'><li>Large plastic bowl</li><li>Spoon (lexan/metal)</li><li>Insulated mug</li><li>Water treatment system</li><li>Stove & Fuel</li><li>Cookset (Pots & Frying pan)</li><li>Hot-pot tongs</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Hygiene</h3><ul style='line-height:1.8;'><li>Toothbrush & Toothpaste</li><li>Dental floss</li><li>Biodegradable soap</li><li>Comb</li><li>Hand cleaner</li><li>Small towel</li><li>Toilet paper (in Ziploc)</li><li>Trowel</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Expert Pro Tips</h3><ul style='line-height:1.8;'><li>Rain suit (breathable)</li><li>Hiking boots (broken in)</li><li>Backpack that fits correctly</li><li>Personal blister kit (Moleskin)</li><li>Parachute cord (20 feet)</li></ul>",
      plainText: "CLOTHING:\n- T-shirt or short-sleeved shirt\n- Hiking shorts\n- Underwear & Extra underwear\n- Socks (synthetic or wool blend)\n- Long-sleeved shirt\n- Brimmed hat\n- Bandana\n- Long pants (lightweight)\n- Sweater or warm jacket\n\nCOOKING & EATING:\n- Large plastic bowl\n- Spoon (lexan/metal)\n- Insulated mug\n- Water treatment system\n- Stove & Fuel\n- Cookset (Pots & Frying pan)\n- Hot-pot tongs\n\nHYGIENE:\n- Toothbrush & Toothpaste\n- Dental floss\n- Biodegradable soap\n- Comb\n- Hand cleaner\n- Small towel\n- Toilet paper (in Ziploc)\n- Trowel\n\nEXPERT PRO TIPS:\n- Rain suit (breathable)\n- Hiking boots (broken in)\n- Backpack that fits correctly\n- Personal blister kit (Moleskin)\n- Parachute cord (20 feet)"
    },
    { 
      id: 3, title: "Cold-Weather Camping", desc: "Sub-freezing packing guide focusing on the 'No Cotton' rule and thermal layers.", icon: <Snowflake size={28} />, 
      type: "document",
      content: "<p style='font-style:italic; font-weight:bold; color:#BE1E2D;'>RULE: NO COTTON!</p><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Clothing & Layers</h3><ul style='line-height:1.8;'><li>Long-sleeved shirt (synthetic/wool)</li><li>Long pants (fleece or wool)</li><li>Sweater or Jacket (fleece or wool)</li><li>Base layer (polypropylene)</li><li>Hiking boots (waterproofed)</li><li>Wool socks (multiple pairs)</li><li>Warm parka with hood</li><li>Stocking hat (covers ears)</li><li>Mittens or Gloves (warm)</li><li>Wool scarf</li><li>Extra dry underwear</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Expert Gear</h3><ul style='line-height:1.8;'><li>Bandana</li><li>Insulated Sorel-style boots</li><li>Wind parka with hood</li><li>Side-attaching suspenders</li><li>Rubberized gloves (for wet snow)</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Eating & Cooking</h3><ul style='line-height:1.8;'><li>Large storage bowl & Spoon</li><li>Insulated mug</li><li>Water treatment & Stove</li><li>Cookset & Snow Melting Pot</li><li>Hot-pot tongs</li></ul>", 
      plainText: "RULE: NO COTTON!\n\nCLOTHING & LAYERS:\n- Long-sleeved shirt (synthetic/wool)\n- Long pants (fleece or wool)\n- Sweater or Jacket (fleece or wool)\n- Base layer (polypropylene)\n- Hiking boots (waterproofed)\n- Wool socks (multiple pairs)\n- Warm parka with hood\n- Stocking hat (covers ears)\n- Mittens or Gloves (warm)\n- Wool scarf\n- Extra dry underwear\n\nEXPERT GEAR:\n- Bandana\n- Insulated boots\n- Wind parka with hood\n- Side-attaching suspenders\n- Rubberized gloves (for wet snow)\n\nEATING & COOKING:\n- Large storage bowl & Spoon\n- Insulated mug\n- Water treatment & Stove\n- Cookset & Snow Melting Pot\n- Hot-pot tongs" 
    },
    { 
      id: 4, title: "Klondike Derby", desc: "Day-trip gear list for our active, high-energy winter competition in the snow.", icon: <Flame size={28} />, 
      type: "document",
      content: "<h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Health & Safety</h3><ul style='line-height:1.8;'><li>Waterproof Boots (Sneakers not allowed!)</li><li>1-2 Liters drinking water per scout</li><li>Proper Winter Attire (No cotton/shorts)</li><li>Trail Lunch</li><li>Cup for hot water</li><li>Mobile Phone (Charged, in ziplock)</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>First Aid</h3><ul style='line-height:1.8;'><li>Patrol First Aid Kit</li><li>Reflective Emergency Space Blanket</li><li>Multiple cravat/triangular bandages</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Tools & Navigation</h3><ul style='line-height:1.8;'><li>Pocket or lock-back knife</li><li>Mallet or hammer</li><li>Duct tape</li><li>TWO compasses</li><li>Small notebook and pen</li><li>Hand saw / Hatchet (with sheaths)</li></ul><h3 style='color:#1D3A6C; border-bottom:1px solid #ccc; padding-bottom:5px;'>Firebuilding & Sled</h3><ul style='line-height:1.8;'><li>Wooden matches & Ferro Rod</li><li>Char Cloth & Birds Nest firestarters</li><li>6 Firewood Tolls</li><li>8 Precut 6ft ropes</li><li>4 Six-foot staves & 4 Three-foot poles</li><li>Emergency Shelter/Tarp</li></ul>", 
      plainText: "HEALTH & SAFETY:\n- Waterproof Boots\n- 1-2L water\n- Winter Attire\n- Trail Lunch\n- Cup\n- Mobile Phone\n\nFIRST AID:\n- Patrol First Aid Kit\n- Space Blanket\n- Cravats\n\nTOOLS & NAVIGATION:\n- Knife\n- Mallet/hammer\n- Duct tape\n- 2 Compasses\n- Notebook/pen\n- Saw/Hatchet\n\nFIREBUILDING & SLED:\n- Matches & Ferro Rod\n- Char Cloth & Firestarters\n- Firewood\n- Ropes & Staves/Poles\n- Emergency Shelter/Tarp" 
    },
    { 
      id: 5, title: "High Adventure", desc: "Official outfitter guides and gear lists for our premier national treks.", icon: <Mountain size={28} />, 
      type: "external_links",
      links: [
        { name: "Philmont Packing", url: "https://www.philmontscoutranch.org/resources/what-to-bring/" },
        { name: "Sea Base Guides", url: "https://seabaseha.org/scouts/resources/participant-guides/" },
        { name: "Maine High Adv.", url: "https://www.mainehighadventure.org/pricing" }
      ]
    },
  ];

  const handlePrint = (list) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Troop 170 - ${list.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; max-w: 800px; margin: auto; color: #111; } 
            h1 { color: #1D3A6C; border-bottom: 3px solid #BE1E2D; padding-bottom: 10px; text-transform: uppercase; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 5px; }
            p.desc { color: #666; font-size: 14px; margin-bottom: 30px; font-style: italic; }
            .footer { margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; font-weight: bold; letter-spacing: 0.05em; }
          </style>
        </head>
        <body>
          <h1>${list.title}</h1>
          <p class="desc">${list.desc}</p>
          ${list.content}
          <div class="footer">SCOUTING AMERICA TROOP 170 • FARMINGTON / UNIONVILLE, CT</div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = (list) => {
    const fileContent = `TROOP 170: ${list.title.toUpperCase()}\n${list.desc}\n\n${list.plainText}\n\n---\nScouting America Troop 170 • Unionville, CT`;
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
    { id: 'join', label: 'Join' },
    { id: 'seabase', label: 'Sea Base 2026', highlight: true }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-[#BE1E2D] selection:text-white">
      
      {/* --- AGENCY NAVIGATION --- */}
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
                  onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }} 
                  className={`transition-all duration-300 ${
                    page.highlight 
                      ? 'bg-[#BE1E2D] text-white px-5 py-2 shadow-lg hover:bg-white hover:text-[#BE1E2D]' 
                      : `hover:text-white ${currentPage === page.id ? 'text-white' : ''}`
                  }`}
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
        
        {/* --- HOME PAGE --- */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-700">
            
            {/* Cinematic Hero */}
            <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: darkBg }}>
              <div className="absolute inset-0 z-0">
                <img src="/images/hero.jpg" alt="Scouts" className="w-full h-full object-cover object-[100%_70%] -scale-x-100 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-none mb-8 shadow-inner border border-white/5">
                  <Compass size={14} className="text-[#BE1E2D]" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Established 1956</span>
                </div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase max-w-4xl">
                  Transform Youth <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Into Leaders</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl leading-relaxed mb-12">
                  Drive character development, boost outdoor skills, and maximize personal growth. We craft engaging, year-round scouting strategies that deliver measurable results.
                </p>
                <button onClick={() => setCurrentPage('join')} className="px-10 py-5 bg-[#BE1E2D] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(190,30,45,0.4)] group flex items-center space-x-4 rounded-none">
                   <span>Schedule Visit</span>
                   <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Impact Strip */}
            <div className="bg-white border-b border-gray-100 relative z-20 shadow-xl">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                   {[
                     { val: "60+", label: "Years Serving Unionville" },
                     { val: "120+", label: "Eagle Scout Legacy" },
                     { val: "140+", label: "Merit Badges Offered" },
                     { val: "12+", label: "Annual Outdoor Trips" }
                   ].map((stat, idx) => (
                     <div key={idx} className="group border-l-4 border-gray-100 pl-6 hover:border-[#1D3A6C] transition-colors duration-300">
                        <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter group-hover:text-[#BE1E2D] transition-colors">{stat.val}</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-2">{stat.label}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

{/* Sea Base Fundraiser Hero Impact Block */}
            <div className="bg-[#0B0F19] text-white py-24 relative overflow-hidden border-b-4 border-[#BE1E2D]">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1D3A6C] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
               <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                        <div className="inline-flex items-center space-x-2 bg-[#BE1E2D]/20 px-4 py-1.5 mb-6 rounded-none border border-[#BE1E2D]/30">
                           <Flame size={14} className="text-[#BE1E2D]" />
                           <span className="font-black tracking-[0.3em] uppercase text-[10px] text-[#BE1E2D]">Urgent Mission</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
                          Operation <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008CFF] to-blue-200">Sea Base 2026</span>
                        </h3>
                        <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 max-w-md">
                          Help send our scouts on the ultimate high-adventure deep sea trek. We need your support to bridge the final gap for gear and travel.
                        </p>
                        <button onClick={() => { setCurrentPage('seabase'); window.scrollTo(0,0); }} className="px-8 py-4 bg-white text-[#0B0F19] font-black text-sm tracking-[0.2em] uppercase hover:bg-[#BE1E2D] hover:text-white transition-all duration-300 shadow-xl flex items-center space-x-3 rounded-none">
                           <span>Join The Mission</span>
                           <ArrowUpRight size={18} />
                        </button>
                     </div>
                     
                     {/* Progress Bar Side */}
                     <div className="bg-white/5 backdrop-blur-md p-10 border border-white/10 rounded-none shadow-2xl">
                        <div className="flex justify-between items-end mb-4">
                           <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Current Funding</p>
                             <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">${fundraisingTotal.toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Target Goal</p>
                             <p className="text-2xl font-bold text-gray-400 tracking-tight">${fundraisingGoal.toLocaleString()}</p>
                           </div>
                        </div>
                        
                        <div className="w-full h-6 bg-black/50 overflow-hidden rounded-none border border-white/10 mb-4">
                           <div 
                             className="h-full bg-gradient-to-r from-[#1D3A6C] to-[#008CFF] relative transition-all duration-1000"
                             style={{ width: `${fundraisingPercent}%` }}
                           >
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBsNDAtNDBINHptNDAgMGwtNDAtNDBINHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30"></div>
                           </div>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#008CFF]">
                           <span>{fundraisingPercent}% Completed</span>
                           <span>{daysLeft} Days Left</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Program Grid (Asymmetrical Agency Layout) */}
            <div className="bg-gray-50 py-32">
               <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                 
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-gray-900">
                      Driven By <br/> <span className="text-[#1D3A6C]">Adventure</span>
                    </h3>
                    <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md">
                      Select a focus area to explore how we transform young scouts into confident community leaders.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Visual Anchor */}
                    <div className="lg:col-span-7">
                       <div className="relative h-[500px] lg:h-[700px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] rounded-none group">
                          <img src={programsList[activeProgram].img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={programsList[activeProgram].title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent flex flex-col justify-end p-10 lg:p-16">
                             <span className="font-black uppercase tracking-[0.3em] text-[10px] mb-3 text-[#BE1E2D]">Focus Area 0{activeProgram + 1}</span>
                             <h4 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4 text-white leading-none">{programsList[activeProgram].title}</h4>
                             <p className="text-lg font-light text-gray-300 max-w-lg leading-relaxed">{programsList[activeProgram].desc}</p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Interactive Index */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-2">
                       {programsList.map((program, index) => {
                         const isActive = activeProgram === index;
                         return (
                           <button 
                             key={program.id} 
                             onClick={() => setActiveProgram(index)} 
                             className={`w-full text-left p-8 transition-all duration-300 rounded-none border-l-4 ${isActive ? 'bg-white border-[#BE1E2D] shadow-xl translate-x-2' : 'bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-300'}`}
                           >
                             <div className="flex justify-between items-center">
                                <div>
                                  <h5 className={`text-xl lg:text-2xl font-black uppercase tracking-tighter ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{program.title}</h5>
                                </div>
                                <span className={`font-black text-lg ${isActive ? 'text-[#1D3A6C]' : 'text-gray-300'}`}>0{index+1}</span>
                             </div>
                           </button>
                         );
                       })}
                    </div>
                 </div>

               </div>
            </div>
          </div>
        )}

        {/* --- ABOUT PAGE --- */}
        {currentPage === 'about' && (
          <div className="bg-white animate-in fade-in duration-700">
            
            {/* Mission Statement Hero */}
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

            {/* Legacy Section */}
            <div className="py-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                 <div className="lg:col-span-5">
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6 leading-none text-gray-900">A Legacy of <br/><span className="text-[#1D3A6C]">Excellence</span></h3>
                    <div className="w-16 h-2 bg-[#BE1E2D] mb-8"></div>
                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                      Founded in 1956 and rechartered in 1962, Troop 170 has been the standard for youth leadership in Unionville for decades. We are a scout-led organization where the youth plan the adventure and adults provide the mentorship.
                    </p>
                    <div className="space-y-6">
                       <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                         <p className="font-black text-gray-900 text-lg uppercase tracking-tight mb-1">The Road to Eagle</p>
                         <p className="text-gray-500 text-sm">A strong legacy of guiding scouts to the prestigious Eagle Scout rank through mentorship and service.</p>
                       </div>
                       <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-[#1D3A6C] hover:shadow-md transition-shadow">
                         <p className="font-black text-gray-900 text-lg uppercase tracking-tight mb-1">Philmont High Adventure</p>
                         <p className="text-gray-500 text-sm">Rugged backcountry trekking in the mountains of New Mexico.</p>
                       </div>
                       <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-[#1D3A6C] hover:shadow-md transition-shadow">
                         <p className="font-black text-gray-900 text-lg uppercase tracking-tight mb-1">Sea Base Florida</p>
                         <p className="text-gray-500 text-sm">Deep-sea sailing and tropical island survival in the Florida Keys.</p>
                       </div>
                       <div className="bg-gray-50 p-6 shadow-sm border-l-4 border-[#1D3A6C] hover:shadow-md transition-shadow">
                         <p className="font-black text-gray-900 text-lg uppercase tracking-tight mb-1">Maine High Adventure</p>
                         <p className="text-gray-500 text-sm">Canoeing and wilderness survival in the rugged backcountry of Maine.</p>
                       </div>
                    </div>
                 </div>
                 <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] mt-10 lg:mt-0">
                    <img src="/images/legacy2.jpg" className="absolute top-0 right-0 w-4/5 h-3/4 object-cover shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] z-10 rounded-none" alt="Hiking" />
                    <div className="absolute bottom-0 left-0 w-2/3 h-3/5 bg-white p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] z-20 rounded-none">
                       <img src="/images/legacy1.jpg" className="w-full h-full object-cover" alt="Sailing" />
                    </div>
                 </div>
               </div>
            </div>

            {/* Donation Funnel */}
            <div className="bg-[#050B14] py-32 px-6 text-center border-t border-gray-800">
              <div className="max-w-3xl mx-auto relative z-10">
                <div className="w-16 h-16 mx-auto bg-[#BE1E2D] flex items-center justify-center text-white mb-8 shadow-xl rounded-none">
                  <Heart size={28} />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-none">Support Us</h2>
                <p className="text-lg text-gray-400 mb-12 font-light leading-relaxed">
                  Help sustain our 60-year legacy. Your contributions directly fund critical equipment upkeep and high-adventure scholarships for scouts in need.
                </p>
                
                <a href="https://venmo.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="inline-flex flex-col sm:flex-row items-center sm:space-x-6 bg-[#008CFF] hover:bg-blue-600 px-10 py-6 font-black text-white text-xl transition-all shadow-xl group rounded-none">
                  <span>DONATE VIA VENMO</span>
                  <span className="bg-white/20 px-4 py-1 mt-2 sm:mt-0 text-[10px] tracking-[0.2em] uppercase rounded-none">@Troop170Unionville</span>
                </a>

                {/* The "Grandma Funnel" */}
                <div className="mt-16 pt-10 border-t border-white/10 text-gray-500">
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-3 text-[#BE1E2D]">Prefer to mail a check?</p>
                  <p className="text-md font-light italic leading-relaxed">
                    First Church of Christ<br/>
                    ATTN: Troop 170 Treasurer<br/>
                    61 Main St, Unionville, CT 06085
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- JOIN PAGE --- */}
        {currentPage === 'join' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="bg-[#0B0F19] text-white py-32 lg:py-60 px-6 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-30"><img src="/images/join.jpg" className="w-full h-full object-cover" alt="Campfire" /></div>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F19]"></div>
               <h2 className="relative z-10 text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">Start The Trail</h2>
               <p className="relative z-10 text-lg font-light text-gray-300 max-w-2xl mx-auto">Boys and girls ages 11-17 are welcome to join year-round.</p>
            </div>

            {/* Inquiry Form Block */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 relative z-20 mb-24">
               <div className="bg-white grid grid-cols-1 lg:grid-cols-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-none">
                 
                 {/* Info Side */}
                 <div className="lg:col-span-2 bg-[#050B14] text-white p-10 lg:p-14 flex flex-col justify-between">
                    <div>
                       <h3 className="text-3xl font-black uppercase tracking-tight mb-10 leading-none">Visit A Meeting</h3>
                       <div className="space-y-8">
                          <div className="flex items-start space-x-5">
                            <Clock className="text-[#BE1E2D] shrink-0" size={32}/> 
                            <div>
                              <p className="font-black text-lg uppercase tracking-tight mb-1">Monday Evenings</p>
                              <p className="text-gray-400 text-sm">During the school year (Sept-May)</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-5">
                            <MapPin className="text-[#BE1E2D] shrink-0" size={32}/> 
                            <div>
                              <p className="font-black text-lg uppercase tracking-tight mb-1">Unionville, CT</p>
                              <p className="text-gray-400 text-sm italic opacity-80">Exact location shared upon inquiry for youth protection.</p>
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Form Side - Netlify Configured */}
                 <div className="lg:col-span-3 p-10 lg:p-14 flex flex-col justify-center bg-white">
                    {joinSuccess ? (
                      <div className="text-center py-10 animate-in zoom-in duration-500">
                         <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-6 rounded-none"><CheckCircle size={40} className="text-green-500" /></div>
                         <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Request Received</h3>
                         <p className="text-gray-500 text-md font-light">The Scoutmaster will contact you shortly.</p>
                      </div>
                    ) : (
                      <form 
                        name="join-inquiry" 
                        method="POST" 
                        data-netlify="true" 
                        className="space-y-6" 
onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const formData = new FormData(form);

          fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              "form-name": "join-inquiry",
              ...Object.fromEntries(formData)
            }).toString()
          })
          .then(() => setJoinSuccess(true))
          .catch((error) => alert(error));
        }}
                      >
                        <input type="hidden" name="form-name" value="join-inquiry" />
                         <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-6">Secure Inquiry</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Parent Name</label>
                              <input required name="parent_name" className="w-full p-4 bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-[#1D3A6C] outline-none text-gray-900 rounded-none" placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Email Address</label>
                              <input required name="email" type="email" className="w-full p-4 bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-[#1D3A6C] outline-none text-gray-900 rounded-none" placeholder="jane@example.com" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Phone Number</label>
                              <input required name="phone" type="tel" className="w-full p-4 bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-[#1D3A6C] outline-none text-gray-900 rounded-none" placeholder="(555) 555-5555" />
                            </div>
                         </div>
                         <div className="pt-2">
                           <button type="submit" className="w-full p-5 bg-[#BE1E2D] text-white font-black uppercase tracking-[0.2em] text-sm shadow-md hover:bg-gray-900 transition-colors rounded-none flex justify-center items-center space-x-2">
                             <span>Request Info / Schedule Visit</span>
                             <ArrowUpRight size={16} />
                           </button>
                         </div>
                      </form>
                    )}
                 </div>

               </div>
            </div>

            {/* Registration Flow - Full Width Centered */}
            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
               <div className="bg-white p-10 lg:p-14 shadow-[0_20px_50px_-10px_rgba(29,58,108,0.1)] hover:-translate-y-1 transition-transform flex flex-col justify-between group rounded-none border-t-4 border-[#1D3A6C]">
                  <div>
                    <div className="flex items-center space-x-4 mb-10">
                       <div className="bg-blue-50 p-4 text-[#1D3A6C] rounded-none"><CheckCircle size={32} /></div>
                       <h4 className="text-2xl font-black tracking-tighter uppercase text-gray-900">Onboarding Process</h4>
                    </div>
                    <div className="space-y-8">
                       {[
                         ["1", "Observe", "Visit a meeting to see the Patrol Method."], 
                         ["2", "Apply", "Submit the official online application."], 
                         ["3", "Outfit", "Obtain your tan uniform and handbook."]
                       ].map(([num, title, desc]) => (
                         <div key={num} className="flex items-start space-x-5">
                           <div className="w-10 h-10 bg-[#1D3A6C] text-white flex items-center justify-center font-black shadow-md shrink-0 text-xl rounded-none">{num}</div>
                           <div>
                             <p className="font-black text-lg uppercase tracking-tight mb-1 text-gray-900 leading-none">{title}</p>
                             <p className="text-gray-500 text-sm font-light leading-snug">{desc}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                </div>
                <a 
                  href="https://my.scouting.org/VES/OnlineReg/1.0.0/?tu=UF-MB-066taa0170" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-10 w-full flex items-center justify-center space-x-3 p-5 bg-[#BE1E2D] text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg hover:bg-red-800 transition-colors rounded-none"
                >
                  <span>Official Application</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* --- MEMBER PORTAL (The Vault) --- */}
        {currentPage === 'portal' && (
          <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
            
            {/* Locked State */}
            {!isLoggedIn ? (
              <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden" style={{ backgroundColor: darkBg }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1D3A6C] rounded-full blur-[150px] opacity-30 animate-pulse pointer-events-none"></div>
                
                <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-12 lg:p-16 shadow-2xl max-w-md w-full border border-white/10 rounded-none">
                    <div className="w-20 h-20 bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner rounded-none">
                      <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase text-center">Member Login</h2>
                    <p className="text-gray-400 mb-10 text-sm font-light text-center">Protected resources and ledgers.</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); if (password.toUpperCase() === 'TROOP170') setIsLoggedIn(true); else setLoginError(true); }}>
                      <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Key size={16} className={loginError ? "text-red-400" : "text-gray-400"} />
                        </div>
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => {setPassword(e.target.value); setLoginError(false);}} 
                          className="w-full pl-12 pr-4 py-4 bg-black/40 text-white text-lg border-0 shadow-inner outline-none focus:ring-2 focus:ring-white/30 rounded-none" 
                          placeholder="Gate Code" 
                        />
                      </div>
                      {loginError && <p className="text-[#ff6b6b] mb-6 font-black animate-bounce uppercase text-[10px] tracking-widest text-center">Access Denied</p>}
                      <button type="submit" className="w-full py-4 bg-white text-[#1D3A6C] font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors rounded-none flex justify-center items-center space-x-2">
                        <span>Unlock</span>
                        <ArrowUpRight size={16} />
                      </button>
                    </form>
                </div>
              </div>
            ) : (
              
              /* Unlocked Dashboard */
              <div className="pb-32">
                
                {/* Secure Header */}
                <div className="bg-[#050B14] py-20 px-6 sm:px-8 lg:px-12 relative overflow-hidden shadow-xl mb-16">
                  <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#1D3A6C] rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
                  <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-8 md:mb-0">
                      <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-none mb-4 shadow-inner border border-white/5">
                        <Lock size={12} className="text-green-400" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-green-400">Secure Protocol Active</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 leading-none">Dashboard</h2>
                      <p className="text-gray-400 text-lg font-light">Internal Command Center</p>
                    </div>
                    <button onClick={() => setIsLoggedIn(false)} className="px-6 py-3 bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black border border-white/10 transition-colors rounded-none flex items-center space-x-2">
                      <span>Log Out</span><LogOut size={14}/>
                    </button>
                  </div>
                </div>
                
                {/* 5-Card Action Grid */}
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   
                   {/* Card 1: BAND APP */}
                   <div className="bg-gradient-to-br from-white to-green-50 border border-green-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-green-600 mb-6 shadow-sm"><Smartphone size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Band App</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Calendar updates, photos, and announcements.</p>
                      </div>
                      <a href="https://band.us/n/acabb5kcAfa10" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-600 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
                        <span>Launch App</span><ExternalLink size={14}/>
                      </a>
                   </div>

                   {/* Card 2: MEDICAL */}
                   <div className="bg-gradient-to-br from-white to-red-50 border border-red-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-[#BE1E2D] mb-6 shadow-sm"><FileText size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Health Forms</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">AHMR Parts A, B, and C required for all outings.</p>
                      </div>
                      <a href="https://www.scouting.org/health-and-safety/ahmr/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[#BE1E2D] font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
                        <span>Download PDF</span><Download size={14}/>
                      </a>
                   </div>

                   {/* Card 3: GEAR */}
                   <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-amber-600 mb-6 shadow-sm"><Tent size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Gear Hub</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Print packing checklists for troop adventures.</p>
                      </div>
                      <button onClick={() => setCurrentPage('gearLists')} className="flex items-center space-x-2 text-amber-600 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform text-left">
                        <span>Open Hub</span><ArrowUpRight size={14}/>
                      </button>
                   </div>

                   {/* Card 4: CLINICS */}
                   <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-purple-600 mb-6 shadow-sm"><Medal size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Clinics</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Schedule and registration for merit badges.</p>
                      </div>
                      <button onClick={() => setCurrentPage('meritBadges')} className="flex items-center space-x-2 text-purple-600 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform text-left">
                        <span>View Schedule</span><ArrowUpRight size={14}/>
                      </button>
                   </div>

                   {/* Card 5: LEDGER */}
                   <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-[#1D3A6C] mb-6 shadow-sm"><CreditCard size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Scout Dollars</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Securely check individual fundraising balances.</p>
                      </div>
                      <button onClick={() => { setCurrentPage('scoutDollars'); setHasSearched(false); setSearchQuery(''); }} className="flex items-center space-x-2 text-[#1D3A6C] font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform text-left">
                        <span>Access Ledger</span><Search size={14}/>
                      </button>
                   </div>

                   {/* Card 6: Scout Life Magazine */}
                   <div className="group relative bg-[#161B22] rounded-3xl p-8 border border-white/5 hover:border-[#BE1E2D]/50 transition-all duration-500 overflow-hidden">
                     {/* Decorative Background Icon */}
                     <div className="absolute -right-8 -top-8 text-white/5 group-hover:text-[#BE1E2D]/10 transition-colors duration-500 pointer-events-none">
                       <BookOpen size={160} />
                     </div>

                     <div className="relative z-10">
                       <div className="w-12 h-12 bg-[#BE1E2D]/10 rounded-xl flex items-center justify-center text-[#BE1E2D] mb-6">
                         <BookOpen size={24} />
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-3">Scout Life Magazine</h3>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                         Explore the official magazine of the BSA. Discover project ideas, gear reviews, and stories of scouting adventure.
                       </p>

                       <a 
                         href="https://scoutlife.org" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center space-x-3 bg-white/5 hover:bg-[#BE1E2D] text-white px-6 py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs"
                       >
                         <span>Read Online</span>
                         <ArrowUpRight size={18} />
                       </a>
                     </div>
                   </div>

                   {/* Card 7: Sea Base Countdown Card */}
                   <div className="relative group bg-[#0B0F19] rounded-3xl overflow-hidden border border-white/10 h-64 shadow-2xl md:col-span-2 lg:col-span-3">
                     {/* Background Image */}
                     <div className="absolute inset-0 opacity-40">
                       <img 
                         src="/images/download.jpg" 
                         alt="Sea Base" 
                         className="w-full h-full object-cover"
                       />
                     </div>
                     
                     {/* Gradient Overlay to make text pop */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>

                     {/* Text Content */}
                     <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                       <span className="text-[#BE1E2D] font-black tracking-[0.3em] uppercase text-[10px] mb-2">High Adventure 2026</span>
                       <h3 className="text-4xl font-black text-white mb-4 uppercase">Sea Base</h3>
                       
                       <div className="flex items-baseline space-x-3 mt-2">
                         <span className="text-6xl font-black text-white">{daysLeft}</span>
                         <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Days To Launch</span>
                       </div>

                       <div className="mt-6 flex items-center space-x-2 text-white/60 text-xs font-medium bg-black/30 px-3 py-1 rounded-full">
                         <span>Islamorada, Florida</span>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- DYNAMIC ROOM: GEAR HUB --- */}
        {currentPage === 'gearLists' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-24 px-6 text-center shadow-md relative overflow-hidden">
               <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">Gear Hub</h2>
               <button onClick={() => setCurrentPage('portal')} className="relative z-10 text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px] transition-colors">← Return to Vault</button>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
               {gearListsData.map(list => (
                 <div key={list.id} className="bg-white p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex flex-col justify-between border-t-4 border-[#1D3A6C] rounded-none">
                    <div>
                      <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-[#1D3A6C] mb-6 shadow-inner">{list.icon}</div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-gray-900">{list.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-8">{list.desc}</p>
                    </div>
                    <div className="flex space-x-2">
                       {list.type === "document" ? (
                         <>
                           <button onClick={() => handlePrint(list)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors rounded-none">
                             <Printer size={14}/> <span>Print</span>
                           </button>
                           <button onClick={() => handleDownload(list)} className="flex-1 py-3 bg-[#1D3A6C] text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors rounded-none">
                             <Download size={14}/> <span>Save</span>
                           </button>
                         </>
                       ) : (
                         <div className="flex flex-col space-y-2 w-full">
                           {list.links?.map(link => (
                             <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-gray-100 text-[#1D3A6C] font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-between px-4 hover:bg-gray-200 transition-colors rounded-none">
                               <span>{link.name}</span> <ExternalLink size={12}/>
                             </a>
                           ))}
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- DYNAMIC ROOM: LEDGER (Exact Match) --- */}
        {currentPage === 'scoutDollars' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-24 px-6 text-center shadow-md relative overflow-hidden">
               <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">Ledger</h2>
               <button onClick={() => setCurrentPage('portal')} className="relative z-10 text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px] transition-colors">← Return to Vault</button>
            </div>
            
            <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
               <form className="flex shadow-lg bg-white rounded-none border border-gray-100" onSubmit={(e) => { e.preventDefault(); const res = scoutAccounts.find(s => s.name.toLowerCase() === searchQuery.trim().toLowerCase()); setActiveResult(res || null); setHasSearched(true); }}>
                  <div className="flex items-center pl-6 text-gray-400"><Search size={24}/></div>
                  <input className="flex-grow p-6 text-xl font-light outline-none text-gray-900" placeholder="Exact Registered Name..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setHasSearched(false);}} />
                  <button type="submit" className="bg-[#1D3A6C] text-white px-8 font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors">Search</button>
               </form>
               
               {hasSearched && (
                 <div className="mt-12 animate-in slide-in-from-bottom duration-500">
                   {activeResult ? (
                     <div className="bg-white p-10 shadow-xl border-l-[12px] border-green-500 flex flex-col sm:flex-row justify-between items-center rounded-none">
                        <div className="text-center sm:text-left mb-8 sm:mb-0">
                           <h3 className="text-3xl font-black tracking-tight uppercase mb-4 text-gray-900">{activeResult.name}</h3>
                           <p className="inline-flex items-center space-x-2 bg-gray-50 px-3 py-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-4 border border-gray-100">
                             <Clock size={12}/> <span>Updated: {activeResult.date}</span>
                           </p>
                           <p className="text-gray-600 text-sm italic">"{activeResult.lastTransaction}"</p>
                        </div>
                        <div className="text-center sm:text-right bg-green-50 p-8 border border-green-100 min-w-[200px] rounded-none">
                           <span className="block text-green-800 font-black uppercase tracking-widest text-[10px] mb-2">Available Balance</span>
                           <span className="text-5xl font-black text-green-600 tracking-tighter">${activeResult.balance.toFixed(2)}</span>
                        </div>
                     </div>
                   ) : (
                    <div className="bg-white p-16 text-center shadow-xl border-t-[12px] border-[#BE1E2D] rounded-none">
                       <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-6 rounded-full"><Lock size={24} className="text-[#BE1E2D]"/></div>
                       <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-gray-900">Record Locked</h3>
                       <p className="text-gray-500 text-sm max-w-sm mx-auto">For privacy, you must search the exact spelling of the registered name (e.g. "Alexander T.").</p>
                    </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* --- DYNAMIC ROOM: CLINICS --- */}
        {currentPage === 'meritBadges' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-24 px-6 text-center shadow-md relative overflow-hidden">
               <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">Clinics</h2>
               <button onClick={() => setCurrentPage('portal')} className="relative z-10 text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px] transition-colors">← Return to Vault</button>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
               {upcomingBadges.map(badge => (
                 <div key={badge.id} className="bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] group flex flex-col justify-between rounded-none border-b-4 border-purple-800 hover:-translate-y-1 transition-transform">
                    <div className="relative h-48 overflow-hidden">
                       <img src={badge.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={badge.name} />
                       <div className="absolute top-4 right-4 bg-[#BE1E2D] text-white px-3 py-1 font-black uppercase tracking-widest text-[9px] shadow-md">{badge.status}</div>
                    </div>
                    <div className="p-8">
                       <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-gray-900 leading-tight">{badge.name}</h3>
                       <div className="space-y-3 mb-8 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                          <div className="flex items-center space-x-3"><Calendar size={14} className="text-[#1D3A6C]"/> <span>{badge.date}</span></div>
                          <div className="flex items-center space-x-3"><Clock size={14} className="text-[#1D3A6C]"/> <span>{badge.time}</span></div>
                          <div className="flex items-center space-x-3"><Users size={14} className="text-[#1D3A6C]"/> <span>{badge.counselor}</span></div>
                       </div>
                       <button onClick={() => { setSelectedBadge(badge); setRegistrationSuccess(false); }} className="w-full p-4 bg-[#1D3A6C] text-white font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-colors rounded-none">Register Scout</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

{/* --- SEA BASE FUNDRAISER PAGE --- */}
        {currentPage === 'seabase' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in duration-700">
            
            {/* Header / Countdown */}
            <div className="bg-[#0B0F19] text-white py-32 lg:py-48 px-6 text-center relative overflow-hidden border-b-8 border-[#1D3A6C]">
               <div className="absolute inset-0 opacity-20"><img src="/images/download.jpg" className="w-full h-full object-cover grayscale" alt="Ocean Trek" /></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
               
               <div className="relative z-10 max-w-4xl mx-auto">
                 <div className="inline-flex items-center space-x-2 bg-[#1D3A6C]/50 backdrop-blur-md px-4 py-1.5 rounded-none mb-8 border border-blue-500/30">
                    <Compass size={14} className="text-blue-300" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-300">August 2, 2026 • Islamorada, FL</span>
                 </div>
                 
                 <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                   Florida <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008CFF] to-white">Sea Base Trek</span>
                 </h2>
                 
                 <div className="flex justify-center items-center space-x-6 md:space-x-12 mt-12">
                   <div className="text-center">
                     <span className="block text-6xl md:text-8xl font-black tracking-tighter text-white">{daysLeft}</span>
                     <span className="block text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-gray-500 mt-2">Days</span>
                   </div>
                   <div className="text-4xl text-gray-700 font-light mb-6">:</div>
                   <div className="text-center">
                     <span className="block text-6xl md:text-8xl font-black tracking-tighter text-[#BE1E2D]">{Math.floor(daysLeft/7)}</span>
                     <span className="block text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-gray-500 mt-2">Weeks</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 relative z-20">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 
                 {/* Left Col: Info & Breakdown */}
                 <div className="lg:col-span-7 space-y-12">
                   <div className="bg-white p-10 lg:p-14 shadow-2xl rounded-none border-t-4 border-gray-100">
                     <h3 className="text-3xl font-black uppercase tracking-tight mb-6 leading-none text-gray-900">The Ultimate Adventure</h3>
                     <p className="text-gray-500 text-lg leading-relaxed font-light mb-10">
                       Our older scouts are preparing for a grueling, rewarding 7-day sailing and snorkeling adventure in the Florida Keys. This high-adventure trek tests their leadership, endurance, and nautical skills. Your support directly funds the intensive logistics of this national expedition.
                     </p>

                     <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-[#1D3A6C] border-b-2 border-gray-100 pb-4">What Your Donation Covers</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group rounded-none">
                           <div className="w-10 h-10 bg-white flex items-center justify-center text-[#1D3A6C] mb-4 shadow-sm"><Tent size={20}/></div>
                           <h5 className="text-xl font-black tracking-tight text-gray-900 mb-1">$50</h5>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Snorkel & Fin Rental</p>
                           <p className="text-gray-400 text-xs">Equips one scout with essential marine gear.</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group rounded-none">
                           <div className="w-10 h-10 bg-white flex items-center justify-center text-[#1D3A6C] mb-4 shadow-sm"><DollarSign size={20}/></div>
                           <h5 className="text-xl font-black tracking-tight text-gray-900 mb-1">$150</h5>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Provisions</p>
                           <p className="text-gray-400 text-xs">Funds daily meals aboard the sailing vessel.</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group rounded-none sm:col-span-2 border-l-4 border-l-[#BE1E2D]">
                           <div className="w-10 h-10 bg-white flex items-center justify-center text-[#BE1E2D] mb-4 shadow-sm"><MapPin size={20}/></div>
                           <h5 className="text-xl font-black tracking-tight text-gray-900 mb-1">$350</h5>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Flight & Transit</p>
                           <p className="text-gray-400 text-xs">Subsidizes major travel logistics from CT to FL.</p>
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Right Col: Sponsor Form & Venmo */}
                 <div className="lg:col-span-5 space-y-8">
                   <div className="bg-[#0B0F19] text-white p-10 lg:p-12 shadow-2xl rounded-none text-center border-t-4 border-[#008CFF]">
                     <div className="w-16 h-16 bg-[#008CFF] flex items-center justify-center mx-auto mb-6 shadow-lg"><Heart size={28} /></div>
                     <h3 className="text-3xl font-black tracking-tight uppercase mb-4 leading-none">Fund The Trek</h3>
                     <p className="text-gray-400 text-sm mb-8 font-light">100% of proceeds go directly to the Sea Base high-adventure fund.</p>
                     
                     <a href="https://venmo.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-[#008CFF] hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl rounded-none flex justify-center items-center space-x-3 mb-6">
                       <span>Venmo @Troop170Unionville</span>
                       <ExternalLink size={16} />
                     </a>
                     <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Please note "Sea Base" in Venmo</p>
                   </div>

                   {/* Pledge Form (Netlify Configured) */}
                   <div className="bg-white p-10 border border-gray-200 shadow-xl rounded-none relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 z-0"></div>
                     <div className="relative z-10">
                       {pledgeSuccess ? (
                         <div className="text-center py-6 animate-in zoom-in">
                            <div className="w-12 h-12 bg-green-50 flex items-center justify-center mx-auto mb-4 rounded-none"><CheckCircle size={28} className="text-green-500" /></div>
                            <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900">Pledge Secured</h4>
                            <p className="text-gray-500 text-xs mt-2">Our treasurer will contact you.</p>
                         </div>
                       ) : (
                         <form 
                           name="seabase-sponsor" 
                           method="POST" 
                           data-netlify="true" 
                           className="space-y-5" 
                           onSubmit={(e) => { 
                             e.preventDefault(); 
                             const form = e.target;
                             const formData = new FormData(form);
                             fetch("/", {
                               method: "POST",
                               headers: { "Content-Type": "application/x-www-form-urlencoded" },
                               body: new URLSearchParams({
                                 "form-name": "seabase-sponsor",
                                 ...Object.fromEntries(formData)
                               }).toString()
                             })
                             .then(() => setPledgeSuccess(true))
                             .catch((error) => alert(error));
                           }}
                         >
                           <input type="hidden" name="form-name" value="seabase-sponsor" />
                           <h4 className="text-lg font-black uppercase tracking-tighter text-gray-900 mb-4 flex items-center space-x-2">
                              <Star size={16} className="text-yellow-500" />
                              <span>Corporate / Large Sponsor</span>
                           </h4>
                           <div>
                             <input required name="sponsor_name" className="w-full p-4 bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-[#1D3A6C] outline-none text-gray-900 rounded-none text-sm" placeholder="Company or Family Name" />
                           </div>
                           <div>
                             <input required name="email" type="email" className="w-full p-4 bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-[#1D3A6C] outline-none text-gray-900 rounded-none text-sm" placeholder="Email Address" />
                           </div>
                           <button type="submit" className="w-full p-4 bg-[#1D3A6C] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-md hover:bg-gray-900 transition-colors rounded-none flex justify-center items-center space-x-2">
                             <span>Submit Sponsorship Request</span>
                           </button>
                         </form>
                       )}
                     </div>
                   </div>

                 </div>

               </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER (Clean 4-Column Agency Style) --- */}
      <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
             <div className="flex items-center space-x-4 mb-6 cursor-pointer" onClick={() => setCurrentPage('home')}>
                <div className="w-20 h-20 rounded-none flex items-center justify-center p-0.5">
                   <img src="/images/logo.png" className="w-full h-full object-contain" alt="Logo" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Troop 170</h2>
             </div>
             <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 pr-4">Building leaders through outdoor adventure since 1956.</p>
             <div className="flex space-x-4">
                <a href="https://www.facebook.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-none hover:bg-[#008CFF] transition-colors"><Facebook size={16}/></a>
                <a href="mailto:bsatroop170unionville@gmail.com" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-none hover:bg-[#BE1E2D] transition-colors"><Mail size={16}/></a>
             </div>
          </div>

          {/* Links Col */}
          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Navigation</h4>
             <ul className="space-y-4">
               {navLinks.map(page => (
                 <li key={page.id} className="hover:text-white text-gray-400 cursor-pointer transition-colors uppercase font-bold tracking-wider text-xs" onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }}>{page.label}</li>
               ))}
               <li><a href="https://venmo.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="text-[#008CFF] hover:underline uppercase font-bold tracking-wider text-xs">Sustaining Fund</a></li>
             </ul>
          </div>

          {/* Contact Col */}
          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Contact</h4>
             <ul className="space-y-5 text-sm text-gray-400">
               <li className="flex items-start space-x-3">
                 <MapPin className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="leading-tight">First Church of Christ<br/>61 Main St, Unionville, CT 06085</p>
               </li>
               <li className="flex items-start space-x-3">
                 <Phone className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="leading-tight">860.352.5471</p>
               </li>
               <li className="flex items-start space-x-3">
                 <Mail className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="break-all leading-tight">bsatroop170unionville<br/>@gmail.com</p>
               </li>
             </ul>
          </div>

          {/* Portal Col */}
          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Command Hub</h4>
             <p className="text-gray-400 mb-6 text-sm font-light leading-relaxed">Access secure documents and ledgers.</p>
             <button onClick={() => { setCurrentPage('portal'); window.scrollTo(0,0); }} className="w-full p-4 bg-white/5 hover:bg-white hover:text-black font-black uppercase tracking-[0.2em] text-[10px] transition-colors rounded-none flex items-center justify-center space-x-2">
               <Lock size={12}/>
               <span>Member Login</span>
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
           <p className="mb-4 md:mb-0">© 2026 Scouting America Troop 170</p>
           <p>Unionville, Connecticut</p>
        </div>
      </footer>

      {/* REGISTRATION MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" onClick={() => setSelectedBadge(null)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg p-10 shadow-2xl rounded-none border-t-8 border-[#1D3A6C] animate-in zoom-in duration-200">
            <button onClick={() => setSelectedBadge(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"><X size={24}/></button>
            
            {registrationSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={32} className="text-green-500" /></div>
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 text-gray-900">Confirmed</h3>
                <p className="text-gray-500 text-md mb-8 leading-relaxed">Seat reserved for {selectedBadge.name}.</p>
                <button onClick={() => setSelectedBadge(null)} className="w-full p-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors rounded-none">Close</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegistrationSuccess(true); }}>
                <span className="text-[#BE1E2D] font-black uppercase tracking-[0.2em] text-[10px] mb-3 block">Secure Registration</span>
                <h3 className="text-3xl font-black tracking-tight uppercase mb-8 leading-tight text-gray-900">{selectedBadge.name}</h3>
                
                <div className="space-y-6">
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Scout Name</label>
                     <input required className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors" placeholder="Full Legal Name" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Parent Email</label>
                     <input required type="email" className="w-full p-4 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#1D3A6C] outline-none text-gray-900 rounded-none transition-colors" placeholder="For confirmation" />
                   </div>
                   <div className="p-4 bg-blue-50 border-l-4 border-[#1D3A6C]">
                     <p className="text-[#1D3A6C] font-bold text-xs italic leading-relaxed">"Scouts must obtain a signed Blue Card prior to attending."</p>
                   </div>
                </div>
                
                <div className="mt-10 flex space-x-4">
                  <button type="button" onClick={() => setSelectedBadge(null)} className="flex-1 p-4 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors rounded-none">Cancel</button>
                  <button type="submit" className="flex-[2] p-4 bg-[#1D3A6C] text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors rounded-none shadow-lg">Confirm Seat</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FLOAT CHAT */}
      <a href="https://www.facebook.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#008CFF] rounded-none flex items-center justify-center text-white shadow-lg hover:-translate-y-1 transition-transform z-50 group">
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#BE1E2D] border-2 border-white"></span>
        </span>
      </a>

    </div>
  );
}


