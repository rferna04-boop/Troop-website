import React, { useState, useEffect } from 'react';
import { 
  Tent, Lock, ArrowUpRight, MapPin, Compass, DollarSign, CheckCircle, Clock, 
  MessageCircle, ExternalLink, Medal, Smartphone, CreditCard, ShieldCheck, 
  LogOut, Search, Printer, Snowflake, Mountain, Sun, Newspaper, ChevronRight, 
  ChefHat, ShoppingBag
} from 'lucide-react';

export default function App() {
  // --- BRAIN (STATE) ---
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProgram, setActiveProgram] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // --- THE CLOCK ---
  const seaBaseDate = new Date('August 2, 2026').getTime();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const today = new Date().getTime();
    setDaysLeft(Math.floor((seaBaseDate - today) / (1000 * 60 * 60 * 24)));
  }, [seaBaseDate]);

  // --- BLOG DATA ---
  const blogPosts = [
    {
      id: 3,
      title: "May Adventures & Service",
      date: "June 01, 2026",
      author: "Scout Corner",
      excerpt: "May was an active and meaningful month for the troop, filled with outdoor adventure, service, and preparation...",
      content: "May was an active and meaningful month for the troop, filled with outdoor adventure, service, and preparation for upcoming celebrations and events. One exciting highlight of the month was the Semi Quinsentennial Fun Campout at Camp Workcoeman, where Scouts spent time enjoying outdoor activities, strengthening patrol teamwork, and celebrating Scouting traditions in a fun environment. The campout gave Scouts the opportunity to connect with one another while participating in engaging activities and building lasting memories together. The troop also participated in a hike during the month, allowing Scouts to continue developing their outdoor skills and appreciation for nature. The hike challenged Scouts to work together, stay prepared, and practice important skills while enjoying time on the trail. Events like these continue to build confidence, leadership, and teamwork within the troop. In addition, Scouts took part in flag placement and preparations for the Memorial Day parade, honoring those who served our country. Placing flags was a meaningful act of respect and remembrance, giving Scouts the opportunity to reflect on the importance of service and patriotism. Throughout the month, troop meetings continued to focus on advancement, skill-building, and preparation for upcoming activities. Scouts worked on merit badges, practiced leadership skills, and prepared for future adventures and troop events. Looking ahead, the troop is also preparing for the upcoming Court of Honor, where Scouts will be recognized for their achievements, hard work, and progress in Scouting. This event will celebrate the dedication and accomplishments of troop members and provide an opportunity for families and leaders to recognize their continued growth. Overall, May was a month filled with adventure, service, and community involvement, highlighting the troop’s dedication to leadership, teamwork, and Scouting values.",
      category: "Monthly Recap"
    },
    {
      id: 1,
      title: "Klondike Derby Victory",
      date: "February 15, 2026",
      author: "Patrol Leader Sam",
      excerpt: "Our Polar Bear patrol took first place in the fire-building competition this weekend...",
      content: "It was 15 degrees at the start, but our training paid off. Using only a ferro rod and natural tinder, we had a waist-high flame in under three minutes. The sled held up perfectly through the snowy trek.",
      category: "Adventure"
    },
    {
      id: 2,
      title: "Community Service: Food Drive",
      date: "January 10, 2026",
      author: "Eagle Candidate Alex",
      excerpt: "Troop 170 collected over 500 pounds of non-perishable goods for the local pantry...",
      content: "A huge thank you to everyone who donated. We spent Saturday morning sorting cans and boxes at the First Church of Christ.",
      category: "Service"
    }
  ];

  // --- DATA (Restored All Images & Details) ---
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
      id: 1, title: "The 10 Essentials", desc: "The absolute required items for every Scout's daypack.", icon: <Compass size={28} />,
      type: "document",
      content: "<ul style='line-height:1.8;'><li>Pocketknife</li><li>First-Aid Kit</li><li>Extra Clothing</li><li>Rain Gear</li><li>Water Bottle</li><li>Flashlight</li><li>Trail Food</li><li>Fire Starter</li><li>Sun Protection</li><li>Map and Compass</li></ul>"
    },
    { 
      id: 2, title: "Warm Weather", desc: "Lightweight packing list for Spring and Summer overnight trips.", icon: <Sun size={28} />,
      type: "document",
      content: "<h3>Clothing</h3><ul><li>Hiking shorts</li><li>Moisture-wicking shirts</li><li>Wool blend socks</li><li>Sun hat</li></ul><h3>Gear</h3><ul><li>Eating kit</li><li>Sleep system</li></ul>"
    },
    { 
      id: 3, title: "Cold-Weather", desc: "Sub-freezing packing guide focusing on the 'No Cotton' rule.", icon: <Snowflake size={28} />, 
      type: "document",
      content: "<p style='color:#BE1E2D; font-weight:bold;'>RULE: NO COTTON!</p><ul><li>Polypro base layers</li><li>Wool socks</li><li>Fleece jacket</li><li>Waterproof boots</li></ul>" 
    },
    { 
      id: 5, title: "High Adventure", desc: "Official outfitter guides and gear lists for national treks.", icon: <Mountain size={28} />, 
      type: "external_links",
      links: [
        { name: "Philmont Packing", url: "https://www.philmontscoutranch.org/resources/what-to-bring/" },
        { name: "Sea Base Guides", url: "https://seabaseha.org/scouts/resources/participant-guides/" }
      ]
    },
  ];

  // --- HELPERS ---
  const handlePrint = (list) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>${list.title}</title></head><body><h1>${list.title}</h1>${list.content}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'join', label: 'Join' }
  ];

  const handleFormSubmit = (e, formName, setSuccess) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": formName, ...Object.fromEntries(formData) }).toString()
    }).then(() => setSuccess(true)).catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-[#BE1E2D] selection:text-white">
      
      {/* NAVIGATION */}
      <nav className="text-white relative z-50 border-b border-white/10 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-16 h-16 bg-white/5 p-2 border border-white/10 flex items-center justify-center">
               <img src="/images/logo.png" className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none">Troop 170</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Unionville, CT</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-10 items-center text-sm font-black uppercase tracking-widest text-gray-300">
            {navLinks.map(page => (
              <button key={page.id} onClick={() => setCurrentPage(page.id)} className={`hover:text-white transition-colors ${currentPage === page.id ? 'text-white' : ''}`}>{page.label}</button>
            ))}
            <button onClick={() => setCurrentPage('portal')} className="px-6 py-2.5 bg-white text-gray-900 hover:bg-[#BE1E2D] hover:text-white transition-all shadow-md rounded-none font-black flex items-center space-x-2">
              <Lock size={14}/><span>Member Login</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        
        {/* --- HOME PAGE --- */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-700">
            <div className="relative pt-32 pb-40 px-6 overflow-hidden bg-[#0B0F19]">
              <div className="absolute inset-0 z-0">
                <img src="/images/hero.jpg" alt="Scouts" className="w-full h-full object-cover object-[100%_70%] -scale-x-100 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/5 mb-8">
                  <Compass size={14} className="text-[#BE1E2D]" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Established 1956</span>
                </div>
                <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase max-w-4xl">
                  Transform Youth <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Into Leaders</span>
                </h2>
                <button onClick={() => setCurrentPage('join')} className="px-10 py-5 bg-[#BE1E2D] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-xl flex items-center space-x-4 rounded-none">
                   <span>Schedule Visit</span>
                   <ArrowUpRight size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white border-b border-gray-100 shadow-xl relative z-20">
              <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
                {[
                  { val: "60+", label: "Years Serving Unionville" },
                  { val: "120+", label: "Eagle Scout Legacy" },
                  { val: "140+", label: "Merit Badges Offered" },
                  { val: "12+", label: "Annual Outdoor Trips" }
                ].map((stat, idx) => (
                  <div key={idx} className="border-l-4 border-gray-100 pl-6 hover:border-[#1D3A6C] transition-colors">
                    <div className="text-4xl font-black text-gray-900 tracking-tighter">{stat.val}</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 py-32">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                  <h3 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] text-gray-900">Driven By <br/><span className="text-[#1D3A6C]">Adventure</span></h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7">
                    <div className="relative h-[500px] overflow-hidden shadow-2xl group">
                      <img src={programsList[activeProgram].img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Focus" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent flex flex-col justify-end p-10">
                        <span className="font-black uppercase tracking-[0.3em] text-[10px] mb-3 text-[#BE1E2D]">Focus Area 0{activeProgram + 1}</span>
                        <h4 className="text-3xl lg:text-5xl font-black uppercase text-white mb-4 leading-none">{programsList[activeProgram].title}</h4>
                        <p className="text-lg font-light text-gray-300 max-w-lg leading-relaxed">{programsList[activeProgram].desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-2">
                    {programsList.map((p, i) => (
                      <button key={p.id} onClick={() => setActiveProgram(i)} className={`w-full text-left p-6 transition-all border-l-4 ${activeProgram === i ? 'bg-white border-[#BE1E2D] shadow-xl translate-x-2 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-900'}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-black uppercase tracking-tight">{p.title}</span>
                          <span className="font-black opacity-20">0{i+1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ABOUT PAGE (Restored Legacy Images) --- */}
        {currentPage === 'about' && (
          <div className="animate-in fade-in duration-700 bg-white">
            <div className="py-40 bg-[#0B0F19] text-center px-6 relative overflow-hidden">
               <img src="/images/about.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Background" />
               <div className="relative z-10 max-w-4xl mx-auto">
                 <h2 className="text-3xl md:text-5xl font-light italic text-white leading-relaxed font-serif">
                   "To enhance character, promote self-discovery, and challenge Scouts to grow in leadership, fitness, and service through exceptional outdoor experiences."
                 </h2>
               </div>
            </div>
            <div className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">A Legacy of <br/><span className="text-[#1D3A6C]">Excellence</span></h3>
                <div className="w-16 h-2 bg-[#BE1E2D] mb-8"></div>
                <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                  Founded in 1956, Troop 170 has been the standard for youth leadership in Unionville for decades. We are a scout-led organization where the youth plan the adventure and adults provide the mentorship.
                </p>
                <div className="space-y-4">
                   <div className="bg-gray-50 p-6 border-l-4 border-yellow-500 font-black uppercase text-sm tracking-tight">The Road to Eagle</div>
                   <div className="bg-gray-50 p-6 border-l-4 border-[#1D3A6C] font-black uppercase text-sm tracking-tight">Philmont High Adventure</div>
                   <div className="bg-gray-50 p-6 border-l-4 border-[#1D3A6C] font-black uppercase text-sm tracking-tight">Sea Base Florida</div>
                </div>
              </div>
              <div className="lg:col-span-7 relative h-[600px]">
                 <img src="/images/legacy2.jpg" className="absolute top-0 right-0 w-4/5 h-3/4 object-cover shadow-2xl z-10" alt="Hiking" />
                 <div className="absolute bottom-0 left-0 w-2/3 h-3/5 bg-white p-2 shadow-2xl z-20">
                    <img src="/images/legacy1.jpg" className="w-full h-full object-cover" alt="Sailing" />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- JOIN PAGE (Restored inquiry form) --- */}
        {currentPage === 'join' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in">
             <div className="bg-[#0B0F19] py-32 text-center text-white relative overflow-hidden">
                <img src="/images/join.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Fire" />
                <h2 className="relative z-10 text-6xl font-black uppercase tracking-tighter">Start The Trail</h2>
             </div>
             <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-5 bg-white shadow-2xl">
                <div className="lg:col-span-2 bg-[#050B14] text-white p-12">
                   <h3 className="text-3xl font-black uppercase mb-10">Visit A Meeting</h3>
                   <div className="space-y-8">
                      <div className="flex items-center space-x-5"><Clock className="text-[#BE1E2D]" size={32}/><span className="font-black uppercase text-sm tracking-widest">Mondays @ 7:00 PM</span></div>
                      <div className="flex items-center space-x-5"><MapPin className="text-[#BE1E2D]" size={32}/><span className="font-black uppercase text-sm tracking-widest">Unionville, CT</span></div>
                   </div>
                </div>
                <div className="lg:col-span-3 p-12">
                   {joinSuccess ? (
                     <div className="text-center py-10"><CheckCircle size={64} className="text-green-500 mx-auto mb-4"/><h3 className="text-3xl font-black uppercase">Request Received</h3></div>
                   ) : (
                     <form name="join-inquiry" data-netlify="true" className="space-y-6" onSubmit={(e) => handleFormSubmit(e, 'join-inquiry', setJoinSuccess)}>
                        <input type="hidden" name="form-name" value="join-inquiry" />
                        <h4 className="text-2xl font-black uppercase mb-6">Secure Inquiry</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input required name="parent_name" className="w-full p-4 bg-gray-50 border-0 outline-none focus:ring-2 focus:ring-[#1D3A6C]" placeholder="Parent Name" />
                           <input required name="email" type="email" className="w-full p-4 bg-gray-50 border-0 outline-none focus:ring-2 focus:ring-[#1D3A6C]" placeholder="Email Address" />
                        </div>
                        <button type="submit" className="w-full p-5 bg-[#BE1E2D] text-white font-black uppercase text-sm tracking-widest shadow-lg hover:bg-gray-900 transition-colors">Request Info</button>
                     </form>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* --- VAULT (MEMBER PORTAL) --- */}
        {currentPage === 'portal' && (
          <div className="min-h-screen bg-gray-50 animate-in fade-in">
            {!isLoggedIn ? (
              <div className="min-h-[80vh] flex items-center justify-center bg-[#0B0F19] px-6">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-12 border border-white/10 shadow-2xl">
                  <ShieldCheck size={48} className="text-white mx-auto mb-8" />
                  <h2 className="text-3xl font-black text-white uppercase text-center mb-10 tracking-tighter">Member Login</h2>
                  <form onSubmit={(e) => { e.preventDefault(); if(password.toUpperCase()==='TROOP170') setIsLoggedIn(true); else setLoginError(true); }}>
                    <input type="password" value={password} onChange={(e) => {setPassword(e.target.value); setLoginError(false);}} className="w-full p-4 bg-black/40 text-white border-0 outline-none focus:ring-2 focus:ring-white/20 mb-6" placeholder="Access Code" />
                    {loginError && <p className="text-red-500 font-black text-center text-[10px] uppercase mb-6 animate-bounce">Denied</p>}
                    <button className="w-full p-4 bg-white text-[#1D3A6C] font-black uppercase text-sm tracking-widest">Unlock</button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="pb-32">
                <div className="bg-[#050B14] py-20 px-6 text-white shadow-xl mb-16 relative overflow-hidden">
                   <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
                     <h2 className="text-5xl font-black uppercase tracking-tighter">Command Hub</h2>
                     <button onClick={() => setIsLoggedIn(false)} className="px-6 py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white hover:text-black transition-colors flex items-center space-x-2">
                       <span>Log Out</span> <LogOut size={14}/>
                     </button>
                   </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Card: Blog */}
                  <div className="bg-[#BE1E2D] p-8 shadow-lg hover:-translate-y-1 transition-transform group text-white">
                    <Newspaper size={24} className="mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Troop Blog</h3>
                    <p className="text-white/70 text-sm mb-8">Latest stories and adventure updates.</p>
                    <button onClick={() => setCurrentPage('blog')} className="font-black uppercase text-[10px] tracking-widest flex items-center space-x-2 group-hover:translate-x-2 transition-transform"><span>Read More</span> <ArrowUpRight size={14}/></button>
                  </div>
                  
                  {/* Card: University of Cooking (UPDATED!) */}
                  <div className="bg-[#1D3A6C] p-8 shadow-lg hover:-translate-y-1 transition-transform group text-white">
                    <ChefHat size={24} className="mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">University of Cooking</h3>
                    <p className="text-white/70 text-sm mb-8">Master the culinary arts with our official troop recipes and guides.</p>
                    <a href="https://sites.google.com/view/troop170universityofcooking/university-of-cooking" target="_blank" rel="noopener noreferrer" className="font-black uppercase text-[10px] tracking-widest flex items-center space-x-2 group-hover:translate-x-2 transition-transform"><span>Enter University</span> <ExternalLink size={14}/></a>
                  </div>

                  {/* Card: Troop Store (NEW!) */}
                  <div className="bg-white p-8 shadow-lg border-t-4 border-[#BE1E2D] group">
                    <ShoppingBag size={24} className="text-[#BE1E2D] mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Troop Store</h3>
                    <p className="text-gray-500 text-sm mb-8">Official Troop 170 apparel and gear from SquadLocker.</p>
                    <a href="https://teamlocker.squadlocker.com/#/lockers/scouting-america-troop-170-unionville-ct/landing" target="_blank" rel="noopener noreferrer" className="text-[#BE1E2D] font-black uppercase text-[10px] tracking-widest flex items-center space-x-2 group-hover:translate-x-1 transition-transform"><span>Shop Now</span> <ExternalLink size={14}/></a>
                  </div>

                  {/* Restored Cards */}
                  <div className="bg-white p-8 shadow-lg border-t-4 border-green-500 group">
                    <Smartphone size={24} className="text-green-600 mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Band App</h3>
                    <p className="text-gray-500 text-sm mb-8">Calendar and announcements.</p>
                    <a href="https://band.us/n/acabb5kcAfa10" target="_blank" rel="noopener noreferrer" className="text-green-600 font-black uppercase text-[10px] flex items-center space-x-2 group-hover:translate-x-1 transition-transform"><span>Launch App</span> <ExternalLink size={14}/></a>
                  </div>

                  <div className="bg-white p-8 shadow-lg border-t-4 border-[#1D3A6C] group">
                    <Tent size={24} className="text-[#1D3A6C] mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Gear Hub</h3>
                    <p className="text-gray-500 text-sm mb-8">Packing checklists.</p>
                    <button onClick={() => setCurrentPage('gearLists')} className="text-[#1D3A6C] font-black uppercase text-[10px] flex items-center space-x-2 group-hover:translate-x-1 transition-transform"><span>View Lists</span> <ArrowUpRight size={14}/></button>
                  </div>

                  <div className="bg-white p-8 shadow-lg border-t-4 border-purple-500 group">
                    <Medal size={24} className="text-purple-600 mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Clinics</h3>
                    <p className="text-gray-500 text-sm mb-8">Merit Badge registrations.</p>
                    <button onClick={() => setCurrentPage('meritBadges')} className="text-purple-600 font-black uppercase text-[10px] flex items-center space-x-2 group-hover:translate-x-1 transition-transform"><span>Schedule</span> <ArrowUpRight size={14}/></button>
                  </div>

                  <div className="bg-white p-8 shadow-lg border-t-4 border-[#1D3A6C] group">
                    <DollarSign size={24} className="text-[#1D3A6C] mb-6"/>
                    <h3 className="text-xl font-black uppercase mb-2">Scout Dollars</h3>
                    <p className="text-gray-500 text-sm mb-8">Check your balance.</p>
                    <button onClick={() => setCurrentPage('scoutDollars')} className="text-[#1D3A6C] font-black uppercase text-[10px] flex items-center space-x-2 group-hover:translate-x-1 transition-transform"><span>Open Ledger</span> <Search size={14}/></button>
                  </div>

                  {/* Sea Base Countdown Card */}
                  <div className="md:col-span-2 lg:col-span-3 bg-[#0B0F19] p-12 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute inset-0 opacity-20"><img src="/images/download.jpg" className="w-full h-full object-cover" alt="Sea Base" /></div>
                    <div className="relative z-10">
                      <span className="text-[#BE1E2D] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">High Adventure 2026</span>
                      <h3 className="text-5xl font-black uppercase mb-6 tracking-tighter">Sea Base</h3>
                      <div className="flex items-center justify-center space-x-4">
                        <span className="text-7xl font-black">{daysLeft}</span>
                        <span className="text-gray-500 font-black uppercase tracking-widest text-sm">Days to Launch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- BLOG PAGE --- */}
        {currentPage === 'blog' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-500">
            <div className="bg-[#050B14] py-24 text-center text-white relative">
               <h2 className="relative z-10 text-5xl font-black uppercase tracking-tighter">Troop Blog</h2>
               <button onClick={() => setCurrentPage('portal')} className="relative z-10 text-gray-500 hover:text-white uppercase font-black text-[10px] tracking-widest">← Back to Command Hub</button>
            </div>
            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
               {blogPosts.map(post => (
                 <div key={post.id} className="bg-white p-10 shadow-xl border-l-[12px] border-[#BE1E2D]">
                    <div className="flex justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1D3A6C] bg-blue-50 px-3 py-1">{post.category}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-gray-900">{post.title}</h3>
                    <p className="text-gray-500 font-light text-lg mb-8 leading-relaxed italic">"{post.excerpt}"</p>
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-gray-900">By: {post.author}</span>
                       <button className="text-[#BE1E2D] font-black uppercase text-[10px] flex items-center space-x-2"><span>Full Story</span> <ChevronRight size={14} /></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- GEAR HUB PAGE (Restored) --- */}
        {currentPage === 'gearLists' && (
           <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right">
              <div className="bg-[#050B14] py-24 text-center text-white"><h2 className="text-4xl font-black uppercase mb-4">Gear Hub</h2><button onClick={() => setCurrentPage('portal')} className="text-gray-500 uppercase font-black text-[10px] tracking-widest">← Back</button></div>
              <div className="max-w-7xl mx-auto px-6 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gearListsData.map(list => (
                  <div key={list.id} className="bg-white p-8 shadow-lg border-t-4 border-[#1D3A6C]">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-[#1D3A6C] mb-6">{list.icon}</div>
                    <h3 className="text-xl font-black uppercase mb-2">{list.title}</h3>
                    <p className="text-gray-500 text-sm mb-8">{list.desc}</p>
                    {list.type === "document" ? (
                      <button onClick={() => handlePrint(list)} className="w-full p-4 bg-gray-100 text-[#1D3A6C] font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2"><Printer size={14}/> <span>Print Checklist</span></button>
                    ) : (
                      <div className="space-y-2">
                        {list.links?.map(l => (
                          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-gray-100 text-[#1D3A6C] font-black uppercase tracking-widest text-[10px] flex items-center justify-between"><span>{l.name}</span> <ExternalLink size={12}/></a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* --- CLINICS PAGE (Restored) --- */}
        {currentPage === 'meritBadges' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right">
            <div className="bg-[#050B14] py-24 text-center text-white"><h2 className="text-4xl font-black uppercase mb-4">Clinics</h2><button onClick={() => setCurrentPage('portal')} className="text-gray-500 uppercase font-black text-[10px] tracking-widest">← Back</button></div>
            <div className="max-w-7xl mx-auto px-6 -mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {upcomingBadges.map(badge => (
                 <div key={badge.id} className="bg-white shadow-lg border-b-4 border-purple-500 group">
                    <div className="relative h-48 overflow-hidden">
                       <img src={badge.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="badge" />
                       <div className="absolute top-4 right-4 bg-[#BE1E2D] text-white px-3 py-1 font-black uppercase text-[9px]">{badge.status}</div>
                    </div>
                    <div className="p-8">
                       <h3 className="text-xl font-black uppercase mb-6">{badge.name}</h3>
                       <button className="w-full p-4 bg-[#1D3A6C] text-white font-black uppercase text-[10px] tracking-widest">Register</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- LEDGER PAGE (Restored) --- */}
        {currentPage === 'scoutDollars' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right">
             <div className="bg-[#050B14] py-24 text-center text-white"><h2 className="text-4xl font-black uppercase mb-4">Ledger</h2><button onClick={() => setCurrentPage('portal')} className="text-gray-500 uppercase font-black text-[10px] tracking-widest">← Back</button></div>
             <div className="max-w-3xl mx-auto px-6 -mt-10">
                <form className="flex bg-white shadow-xl border border-gray-100" onSubmit={(e) => { e.preventDefault(); const res = scoutAccounts.find(s => s.name.toLowerCase() === searchQuery.trim().toLowerCase()); setActiveResult(res || null); setHasSearched(true); }}>
                  <div className="flex items-center pl-6 text-gray-400"><Search size={24}/></div>
                  <input className="flex-grow p-6 text-xl outline-none" placeholder="Exact Registered Name..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setHasSearched(false);}} />
                  <button type="submit" className="bg-[#1D3A6C] text-white px-8 font-black uppercase tracking-widest text-xs">Search</button>
                </form>
                {hasSearched && (
                 <div className="mt-12 animate-in slide-in-from-bottom">
                   {activeResult ? (
                     <div className="bg-white p-10 shadow-xl border-l-[12px] border-green-500 flex justify-between items-center">
                        <div><h3 className="text-3xl font-black uppercase mb-4">{activeResult.name}</h3><p className="text-gray-500 text-xs font-bold uppercase mb-4">Updated: {activeResult.date}</p></div>
                        <div className="bg-green-50 p-8 border border-green-100 text-center"><span className="block text-green-800 font-black uppercase text-[10px] mb-2">Balance</span><span className="text-5xl font-black text-green-600 tracking-tighter">${activeResult.balance.toFixed(2)}</span></div>
                     </div>
                   ) : (
                    <div className="bg-white p-16 text-center shadow-xl border-t-[12px] border-[#BE1E2D]"><Lock size={32} className="text-[#BE1E2D] mx-auto mb-6"/><h3 className="text-2xl font-black uppercase">Record Locked</h3></div>
                   )}
                 </div>
               )}
             </div>
          </div>
        )}

      </main>

      {/* FOOTER (Restored Agency Style) */}
      <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-left">
           <div className="lg:col-span-1"><div className="flex items-center space-x-4 mb-6"><Tent size={32} className="text-[#BE1E2D]" /><h2 className="text-2xl font-black uppercase tracking-tighter">Troop 170</h2></div><p className="text-gray-400 text-sm font-light leading-relaxed">Building leaders through outdoor adventure since 1956.</p></div>
           <div><h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-[#BE1E2D]">Navigation</h4><ul className="space-y-4 text-xs font-black uppercase tracking-widest text-gray-400">{navLinks.map(page => (<li key={page.id} className="hover:text-white cursor-pointer" onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }}>{page.label}</li>))}</ul></div>
           <div><h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-[#BE1E2D]">Contact</h4><ul className="space-y-4 text-sm text-gray-400 font-light"><li className="flex items-start space-x-3"><MapPin size={16} className="text-[#BE1E2D] shrink-0"/><p>61 Main St, Unionville, CT 06085</p></li></ul></div>
           <div><h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-[#BE1E2D]">Command Hub</h4><button onClick={() => { setCurrentPage('portal'); window.scrollTo(0,0); }} className="w-full p-4 bg-white/5 hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-[0.2em] transition-colors flex items-center justify-center space-x-2"><Lock size={12}/> <span>Member Login</span></button></div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between">
           <p>© 2026 Scouting America Troop 170</p><p>Unionville, Connecticut</p>
        </div>
      </footer>

      {/* FLOAT CHAT */}
      <a href="https://www.facebook.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#008CFF] flex items-center justify-center text-white shadow-lg hover:-translate-y-1 transition-transform z-50"><MessageCircle size={24} /></a>

    </div>
  );
}
