import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tent, Lock, ArrowUpRight, MapPin, Mail, Calendar, Phone, 
  Users, Compass, CheckCircle, Clock, 
  MessageCircle, ExternalLink, Medal, Flame, Heart, Key, 
  FileText, Smartphone, CreditCard, ShieldCheck, Download, 
  LogOut, BookOpen, X, Printer, Snowflake, Mountain, 
  Facebook, Sun, Quote, Image as ImageIcon,
  Utensils, PlusCircle, MinusCircle, AlertCircle, RefreshCw, ChevronRight, Shield
} from 'lucide-react';

// SET YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE:
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz7tNBzEsbBF3DoKrmIhrAwjvqMyM91rbzi81-Rr48BHIKiqmJp0o56P9AYc787vR8B/exec";
const LEADER_PORTAL_PASSCODE = "T170LEADER";

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
  // SCOUT DOLLARS: PARENT & LEADER SYSTEM STATE
  // ========================================================
  const [scoutDollarMode, setScoutDollarMode] = useState('parent'); // 'parent' or 'leader'
  
  // Parent Search State
  const [parentScoutId, setParentScoutId] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [parentAccount, setParentAccount] = useState(null);
  const [parentTransactions, setParentTransactions] = useState([]);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState('');

  // Leader Admin State
  const [leaderAuthUnlocked, setLeaderAuthUnlocked] = useState(false);
  const [leaderPassInput, setLeaderPassInput] = useState('');
  const [leaderAuthError, setLeaderAuthError] = useState(false);
  const [leaderEmail, setLeaderEmail] = useState('');
  const [scoutList, setScoutList] = useState([]);
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [txType, setTxType] = useState('DEBIT');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Campout');
  const [txDescription, setTxDescription] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txMessage, setTxMessage] = useState(null);

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
          pin: parentPin.trim()
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
      setParentError('Unable to connect to Scout Dollar server. Please check connection.');
    } finally {
      setParentLoading(false);
    }
  };

  // Fetch Scout Roster for Leader Dropdown (Memoized with useCallback)
  const fetchScoutRoster = useCallback(async () => {
    try {
      const res = await fetch(`${GAS_API_URL}?action=getScouts&apiKey=T170_LEADER_SECRET_2026&leaderEmail=${encodeURIComponent(leaderEmail || 'leader@troop170.org')}`);
      const data = await res.json();
      if (data.success && data.scouts) {
        setScoutList(data.scouts);
        setSelectedScoutId(prev => prev || (data.scouts[0] ? data.scouts[0].scoutId : ''));
      }
    } catch (err) {
      console.error("Could not fetch scouts:", err);
    }
  }, [leaderEmail]);

  useEffect(() => {
    if (leaderAuthUnlocked && currentPage === 'scoutDollars') {
      fetchScoutRoster();
    }
  }, [leaderAuthUnlocked, currentPage, fetchScoutRoster]);

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
        apiKey: 'T170_LEADER_SECRET_2026',
        leaderEmail: leaderEmail || 'leader@troop170.org',
        scoutId: selectedScoutId,
        type: txType,
        amount: amountNum,
        category: txCategory,
        description: txDescription,
        recordedBy: leaderEmail || 'Scoutmaster'
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
        fetchScoutRoster(); // Refresh live balances
      } else {
        setTxMessage({ type: 'error', text: data.error || 'Transaction failed to post.' });
      }
    } catch (err) {
      setTxMessage({ type: 'error', text: 'Server communication error.' });
    } finally {
      setTxLoading(false);
    }
  };

  const selectedScoutObj = scoutList.find(s => s.scoutId === selectedScoutId);

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
      summary: "August was a month of adventure, service, and exciting opportunities for the troop. Scouts took part in the long-awaited Sea Base high-adventure experience, continued giving back through service projects, and spent time camping and working together at the Unionville Museum tag sale. At the same time, an impressive seven Scouts continued their work toward the rank of Eagle Scout, making August another busy and meaningful month for the troop.\n\nThe biggest highlight of the month was undoubtedly Sea Base. Scouts had the opportunity to take part in an unforgettable high-adventure experience, putting their Scouting skills, teamwork, and independence to the test while enjoying an incredible adventure together. After months of preparation, planning, and anticipation, the trip gave Scouts the chance to experience something far outside their usual routine and create memories that will stay with them for years to come. More than just an adventure, Sea Base provided an opportunity for Scouts to work together, face new challenges, and grow through shared experiences. As one Scout put it, \"Sea Base was an incredible experience because we got to do so many things together that we normally wouldn't get to do.\"\n\nAugust also provided several opportunities for the troop to give back to the community. On Monday, August 17, Scouts gathered at the Churchury United Methodist Church to help clean the playground equipment, continuing the troop's tradition of helping with this project each year. Service projects like this are a reminder that Scouting is not only about adventure and advancement, but also about taking the time to improve the communities around us. One Scout reflected, \"It's always nice to come back and help with the playground because it's something our troop has been doing for years, and we know we're helping make it better for everyone who uses it.\"\n\nAnother major August event was the Unionville Museum tag sale and campout, held August 21–23. Scouts camped on the FCCU church property while helping with the tag sale across the street. The weekend gave Scouts the chance to contribute to an important community event while also enjoying time together around camp. Balancing service with camping made the weekend a great example of the fun and fellowship that can come from working together. One Scout shared, \"The tag sale was a lot of work, but camping together afterward made it really fun. It was a great way to spend the weekend with the troop.\"\n\nAugust was also an especially busy month for Eagle Scout projects. Seven—yes, seven—Scouts are currently working on their Eagle Scout projects. Each project represents a significant commitment of planning, leadership, and service, and the troop is proud to support these Scouts as they work toward this important milestone. Scouts, families, and leaders are encouraged to keep a close eye on the calendar and the Band app and help out whenever possible. These projects provide valuable opportunities for the entire troop to demonstrate the Scouting spirit of service while helping our community.\n\nOverall, August was a month filled with adventure, service, leadership, and teamwork. From the excitement and challenges of Sea Base to the Unionville Museum campout, community service at the Churchury United Methodist Church, and the continued work of seven Scouts toward their Eagle rank, the troop stayed active throughout the month. The experiences of August gave Scouts opportunities to grow, serve others, strengthen friendships, and create memories that will carry forward into the rest of the Scouting year.",
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
    },
    {
      id: '2026-07',
      month: 'July',
      year: '2026',
      milestones: ['Summer Camp', 'Eagle Work Parties', 'Sea Base Prep'],
      heroImg: '/images/scout-corner/2026-07-hero.jpg',
      heroFallback: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      summary: "July was a month of adventure, service, and continued preparation for the exciting opportunities ahead. Scouts spent time building skills and memories at summer camp, supporting one another through Eagle Scout projects, and preparing for the upcoming Sea Base adventure. Throughout the month, the troop continued to demonstrate the importance of leadership, teamwork, and service.\n\nOne of the month's biggest highlights was summer camp. Scouts had the opportunity to spend time outdoors, learn new skills, work toward advancement, and enjoy the traditions and experiences that make summer camp such an important part of Scouting. The week provided Scouts with opportunities to challenge themselves, strengthen friendships, and grow more independent while participating in a variety of activities. Reflecting on the experience, one Scout shared, \"Summer camp is one of my favorite parts of Scouting because you get to learn new things while spending the week with your friends.\"\n\nJuly was also an active month for service, with multiple Scouts continuing to work toward their Eagle Scout rank by planning and completing their Eagle projects. The troop supported these efforts through two work parties, giving fellow Scouts, leaders, and families the opportunity to contribute their time and skills. These projects provided valuable leadership experiences for the Scouts organizing them while also demonstrating the Scouting spirit of service to others. As one Scout remarked, \"It's great being able to help with an Eagle project because you know that your work is making a difference and helping someone in the community.\"\n\nWith Sea Base quickly approaching, Scouts and families also continued preparing for the upcoming high-adventure experience. The trip has given Scouts something exciting to look forward to while encouraging them to work together, prepare responsibly, and make the most of the opportunities ahead. The months of planning and fundraising are coming together as the group gets closer to setting out on this adventure. One Scout summed up the excitement by saying, \"We've been preparing for Sea Base for a long time, so it's exciting to know that the adventure is finally getting closer.\"\n\nOverall, July was a month filled with adventure, service, and anticipation. From the excitement of summer camp to the hard work taking place on Eagle projects and the final preparations for Sea Base, Scouts continued to grow as leaders, teammates, and members of their community. The experiences of July helped build both individual confidence and troop spirit while setting the stage for even more memorable adventures in the months ahead.",
      quote: "Summer camp is one of my favorite parts of Scouting because you get to learn new things while spending the week with your friends.",
      scoutName: "Troop 170 Scout",
      scoutRank: "Summer Camper",
      scoutImg: '/images/scout-corner/sheldon.jpg',
      scoutFallback: 'https://images.unsplash.com/photo-1512641406448-6524e5e10bf1?auto=format&fit=crop&w=400&q=80',
      gallery: [
        '/images/scout-corner/2026-07-camp.jpg',
        '/images/scout-corner/2026-07-eagle.jpg'
      ],
      galleryFallbacks: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: '2026-06',
      month: 'June',
      year: '2026',
      milestones: ['Court of Honor & Picnic', '2 New Eagle Scouts', 'Sea Base Fundraisers'],
      heroImg: '/images/scout-corner/2026-04-gal1.jpeg',
      heroFallback: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      summary: "June was a month of celebration, advancement, and preparation for exciting summer adventures. Scouts had the opportunity to recognize major achievements, continue working toward their individual goals, and support the troop through several successful fundraising events.\n\nOne of the month's major highlights was the June Court of Honor and annual troop picnic. The Court of Honor recognized Scouts for their hard work, dedication, and accomplishments in advancement, celebrating merit badges, rank advancements, and other achievements earned throughout the year. Following the ceremony, Scouts, families, and leaders gathered for the annual picnic, enjoying an afternoon of fun, games, good food, and fellowship. The event provided an excellent opportunity to celebrate the troop's successes while strengthening the sense of community among troop families. As one Scout shared, \"It's always exciting to see everyone's hard work pay off, and celebrating together at the picnic makes it even more special.\"\n\nThe troop also celebrated a significant milestone as Andrew Tabol and Devyaan Bordoloi were honored at their Eagle Scout Court of Honor. This memorable ceremony recognized their years of dedication, leadership, and service that culminated in earning Scouting's highest rank. Their accomplishments serve as an inspiration to younger Scouts as they continue working toward their own goals. Reflecting on the ceremony, one Scout remarked, \"Seeing two Scouts earn Eagle reminds me that if I keep working hard, I can get there too.\"\n\nWith the arrival of summer, the troop began its summer meeting schedule, placing a greater emphasis on individualized advancement. These meetings gave Scouts the opportunity to focus on their personal goals, complete advancement requirements, and receive one-on-one guidance from troop leaders. This flexible approach allowed each Scout to make meaningful progress at their own pace while continuing to build valuable Scouting skills. One Scout commented, \"I like being able to work on the things I need most because it helps me keep moving forward.\"\n\nThroughout the month, the troop also held multiple restaurant fundraising events to help support Scouts preparing for the upcoming Sea Base adventure. These fundraisers brought together Scouts, families, and members of the community while helping offset the cost of this exciting high-adventure experience. The strong participation and support demonstrated the troop's commitment to helping Scouts achieve memorable opportunities through teamwork and community involvement. As one Scout put it, \"Every fundraiser gets us one step closer to Sea Base, and it's great seeing everyone pitch in to make it happen.\"\n\nOverall, June was a month filled with celebration, personal achievement, and preparation for future adventures. From recognizing advancements and honoring new Eagle Scouts to beginning summer meetings and supporting Sea Base through fundraising, the troop continued to demonstrate the values of leadership, service, and fellowship that define the Scouting program.",
      quote: "Seeing two Scouts earn Eagle reminds me that if I keep working hard, I can get there too.",
      scoutName: "Troop 170 Scout",
      scoutRank: "Court of Honor Attendee",
      scoutImg: '/images/scout-corner/Gabe.jpg',
      scoutFallback: 'https://images.unsplash.com/photo-1536084005850-984fb12170c2?auto=format&fit=crop&w=400&q=80',
      gallery: [
        '/images/scout-corner/2026-04-hero.jpg',
        '/images/scout-corner/2026-04-scout.jpg'
      ],
      galleryFallbacks: [
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: '2026-04',
      month: 'April',
      year: '2026',
      milestones: ['150 Meals Packed', 'Sea Base Fundraiser', 'Merit Badge Push'],
      heroImg: '/images/scout-corner/2026-04-gal1.jpeg',
      heroFallback: 'https://images.unsplash.com/photo-1533240332313-0cb49f471b75?auto=format&fit=crop&w=1200&q=80',
      summary: "April was a meaningful and engaging month for the troop, combining service, skill-building, and preparation for exciting future adventures.\n\nOne of the most impactful events of the month was the troop’s meal-packing service project, where Scouts came together to prepare meals for those in need. This hands-on effort emphasized the importance of giving back to the community and demonstrated how small actions can make a big difference. Scouts worked efficiently as a team, showing dedication and compassion throughout the event. “Being at the meal packing event not only helped us but it helped many people in need. It saved [and changed] people’s lives. Packing meals felt amazing” said Gabe, a Scout present at the event.\n\nAnother highlight was the University of Cooking campout, which gave Scouts the opportunity to expand their culinary skills in a fun and interactive outdoor setting. Patrols planned menus, prepared meals, and explored new cooking techniques beyond the basics. The campout encouraged creativity and teamwork while helping Scouts build confidence in their abilities. It was both an educational and enjoyable experience for everyone involved.\n\nIn addition, the troop made strong progress in fundraising efforts to support the upcoming Sea Base high adventure trip. “Although it may seem like a boring experience, it was interesting and a great way to interact with the community” said Gabe, a Scout present at the event. Through these fundraisers, Scouts showed initiative and commitment toward reaching their goals, working together to make this exciting opportunity possible.\n\nThroughout the month, troop meetings continued to focus on developing important skills and preparing Scouts for future activities and advancement. Many Scouts also continued working toward merit badges, further broadening their knowledge and experiences.\n\nOverall, April was a well-balanced month filled with service, learning, and forward-looking efforts, highlighting the troop’s dedication to teamwork, growth, and adventure.",
      quote: "Being at the meal packing event not only helped us but it helped many people in need. It saved [and changed] people’s lives. Packing meals felt amazing.",
      scoutName: "Gabe",
      scoutRank: "Scout",
      scoutImg: '/images/scout-corner/Gabe.jpg',
      scoutFallback: 'https://images.unsplash.com/photo-1512641406448-6524e5e10bf1?auto=format&fit=crop&w=400&q=80',
      gallery: [
        '/images/scout-corner/2026-04-hero.jpg',
        '/images/scout-corner/2026-04-scout.jpg'
      ],
      galleryFallbacks: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: '2026-03',
      month: 'March',
      year: '2026',
      milestones: ['42 Nights Camping', 'Wilderness Survival', '12 Miles Hiked'],
      heroImg: '/images/scout-corner/2026-03-hero.jpg',
      heroFallback: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      summary: "March was an active and productive month for the troop with lots of adventures, learning, and achievement recognition.\n\nSome of the most notable events were the Cabin and Lean-to Camping Trip at Camp Sequassen where the Scouts could experience outdoor camping life in late winter. This event gave the opportunity to learn useful camping skills, cooperate within patrols, and enjoy the associated with spending time in nature. “It was a very entertaining and unique camp out and we had a lot of fun and learned many skills!” said one of the Scouts who preferred not to be named.\n\nFurthermore, the Court of Honor took place which celebrated all the work done by the members of the troop throughout this month. Scouts were awarded for earning new ranks, completing merit badges, and other achievements during their Scouting journey.\n\nThe month of March saw a number of meetings take place with an emphasis on developing skills and knowledge among the troop. The meetings involved different subjects that helped the Scouts to develop as leaders and increase their outdoorsmanship and readiness.\n\nMoreover, some of the Scouts made good progress in earning merit badges, thereby improving themselves in various fields.\n\nMarch was indeed a very balanced month that included everything from adventure, development, and education.",
      quote: "It was a very entertaining and unique camp out and we had a lot of fun and learned many skills!",
      scoutName: "Anonymous Scout",
      scoutRank: "Troop 170 Member",
      scoutImg: '/images/scout-corner/anonymous.jpg',
      scoutFallback: 'https://images.unsplash.com/photo-1536084005850-984fb12170c2?auto=format&fit=crop&w=400&q=80',
      gallery: [
        '/images/scout-corner/2026-03-gal1.jpg',
        '/images/scout-corner/2026-03-scout.jpg'
      ],
      galleryFallbacks: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=600&q=80'
      ]
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
    { id: 101, name: "First Aid", date: "Saturday, Oct 14", time: "9:00 AM - 1:00 PM", counselor: "Dr. Smith", status: "Open", img: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=800&q=80" },
    { id: 102, name: "Citizenship in the Nation", date: "Monday, Oct 23", time: "6:00 PM - 7:00 PM", counselor: "Mr. Johnson", status: "Open", img: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80" },
    { id: 103, name: "Personal Management", date: "Monday, Nov 6", time: "6:00 PM - 7:00 PM", counselor: "Mrs. Davis", status: "Waitlist", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
    { id: 104, name: "Environmental Science", date: "Saturday, Nov 11", time: "10:00 AM - 3:00 PM", counselor: "Mr. Thompson", status: "Full", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" }
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
    { id: 'scoutCorner', label: 'Scout Corner' },
    { id: 'join', label: 'Join' }
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

            {/* Program Grid */}
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

        {/* --- SCOUT CORNER --- */}
        {currentPage === 'scoutCorner' && (
          <div className="bg-gray-50 pb-32 animate-in fade-in duration-700 min-h-screen">
            <div className="relative pt-32 pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: darkBg }}>
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80" alt="Mountains" className="w-full h-full object-cover opacity-20 blur-sm scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/80 to-[#f9fafb]"></div>
              </div>
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
                  <Flame size={16} className="text-[#BE1E2D]" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">The Historian's Dispatch</span>
                </div>
                <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-lg">
                  Scout Corner
                </h2>
                <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                  A living chronicle of Troop 170's monthly adventures, service projects, and scout reflections.
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative -mt-10 z-20">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] mb-14 flex flex-col md:flex-row items-center gap-8 border border-gray-100 relative z-30">
                <img 
                  src="/images/scout-corner/sheldon.jpg" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80'; }} 
                  alt="Sheldon H." 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-gray-50 shrink-0" 
                />
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">Meet Sheldon H.</h3>
                  <p className="text-[#1D3A6C] font-bold uppercase tracking-widest text-xs mb-4">Troop 170 Historian</p>
                  <p className="text-gray-600 leading-relaxed font-serif text-lg">
                    Tasked with preserving the legacy of Troop 170, Sheldon documents our monthly adventures, high-adventure treks, and service projects. The Scout Corner is his vision—a living digital archive of our journey, told by the scouts who live it.
                  </p>
                </div>
              </div>

              <div className="mb-20">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="w-3 h-3 bg-[#BE1E2D] rounded-full animate-ping"></span>
                  <span className="font-black uppercase tracking-[0.25em] text-xs text-[#BE1E2D]">Latest Dispatch • Featured</span>
                </div>

                <article className="bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden border border-gray-100 group">
                  <div className="relative h-80 sm:h-96 overflow-hidden">
                    <img 
                      src={featuredEntry.heroImg} 
                      onError={(e) => { e.target.onerror = null; e.target.src = featuredEntry.heroFallback; }}
                      alt={`${featuredEntry.month} Adventure`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-md">
                      <Calendar size={16} className="text-[#BE1E2D]" />
                      <span className="font-black uppercase tracking-widest text-xs text-gray-900">{featuredEntry.month} {featuredEntry.year}</span>
                    </div>
                  </div>

                  <div className="p-8 sm:p-12">
                    <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-100">
                      {featuredEntry.milestones.map((stone, i) => (
                        <span key={i} className="text-xs uppercase tracking-wider font-bold bg-blue-50 text-[#1D3A6C] px-3.5 py-1.5 rounded-lg border border-blue-100">
                          {stone}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-10 font-serif text-lg whitespace-pre-wrap first-letter:text-6xl first-letter:font-black first-letter:text-[#1D3A6C] first-letter:mr-2 first-letter:float-left">
                      {featuredEntry.summary}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-8 relative border border-gray-200/80 mb-10">
                      <div className="absolute -top-4 -left-3 w-10 h-10 bg-[#BE1E2D] rounded-full flex items-center justify-center shadow-lg">
                        <Quote size={18} className="text-white" />
                      </div>
                      <p className="text-gray-800 italic font-medium leading-relaxed mb-6 mt-2 relative z-10 text-base sm:text-lg">
                        "{featuredEntry.quote}"
                      </p>
                      <div className="flex items-center space-x-4 border-t border-gray-200/80 pt-4">
                        <img 
                          src={featuredEntry.scoutImg} 
                          onError={(e) => { e.target.onerror = null; e.target.src = featuredEntry.scoutFallback; }}
                          alt={featuredEntry.scoutName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{featuredEntry.scoutName}</p>
                          <p className="text-[#1D3A6C] text-[11px] font-bold uppercase tracking-widest">{featuredEntry.scoutRank}</p>
                        </div>
                      </div>
                    </div>

                    {featuredEntry.gallery?.length > 0 && (
                      <div className="pt-6 border-t border-gray-100">
                        <span className="text-[11px] font-black tracking-widest uppercase text-gray-400 flex items-center mb-4">
                          <ImageIcon size={15} className="mr-2"/> Dispatch Photos
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {featuredEntry.gallery.map((imgSrc, i) => (
                            <div key={i} className="h-56 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-50">
                              <img 
                                src={imgSrc} 
                                onError={(e) => { e.target.onerror = null; e.target.src = featuredEntry.galleryFallbacks[i]; }}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                alt={`Action shot ${i}`} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </div>

              {/* ACCORDION ARCHIVES */}
              <div className="mt-20">
                <div className="border-t border-gray-200 pt-12 mb-8 flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-gray-900">Trail Archives</h4>
                    <p className="text-gray-500 text-sm font-light mt-1">Explore previous months and past troop recaps.</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full">
                    {pastEntries.length} Past Dispatches
                  </span>
                </div>

                <div className="space-y-4">
                  {pastEntries.map(entry => {
                    const isOpen = openArchiveId === entry.id;
                    return (
                      <div 
                        key={entry.id} 
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:border-gray-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleArchive(entry.id)}
                          className="w-full p-6 sm:p-7 flex items-center justify-between text-left transition-colors hover:bg-gray-50/70"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1D3A6C] flex items-center justify-center font-black">
                                <Calendar size={18} />
                              </div>
                              <span className="text-xl font-black uppercase tracking-tight text-gray-900">
                                {entry.month} {entry.year}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {entry.milestones.map((stone, i) => (
                                <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                  {stone}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="ml-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                            <svg 
                              className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-gray-100 animate-in fade-in duration-300">
                            <div className="relative h-64 rounded-xl overflow-hidden mb-8 mt-4 border border-gray-100">
                              <img 
                                src={entry.heroImg} 
                                onError={(e) => { e.target.onerror = null; e.target.src = entry.heroFallback; }}
                                alt={`${entry.month} Adventure`} 
                                className="w-full h-full object-cover" 
                              />
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-8 font-serif text-base sm:text-lg whitespace-pre-wrap">
                              {entry.summary}
                            </p>

                            <div className="bg-gray-50 rounded-xl p-6 relative border border-gray-200/80 mb-6">
                              <p className="text-gray-800 italic font-medium leading-relaxed mb-4 text-sm sm:text-base">
                                "{entry.quote}"
                              </p>
                              <div className="flex items-center space-x-3 border-t border-gray-200 pt-3">
                                <img 
                                  src={entry.scoutImg} 
                                  onError={(e) => { e.target.onerror = null; e.target.src = entry.scoutFallback; }}
                                  alt={entry.scoutName} 
                                  className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" 
                                />
                                <div>
                                  <p className="font-black text-gray-900 text-xs uppercase tracking-tight">{entry.scoutName}</p>
                                  <p className="text-[#1D3A6C] text-[10px] font-bold uppercase tracking-widest">{entry.scoutRank}</p>
                                </div>
                              </div>
                            </div>

                            {entry.gallery?.length > 0 && (
                              <div className="pt-4 border-t border-gray-100">
                                <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 flex items-center mb-3">
                                  <ImageIcon size={13} className="mr-1.5"/> Archive Gallery
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {entry.gallery.map((imgSrc, i) => (
                                    <div key={i} className="h-44 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                      <img 
                                        src={imgSrc} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = entry.galleryFallbacks[i]; }}
                                        className="w-full h-full object-cover" 
                                        alt={`Archive shot ${i}`} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

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
            <div className="bg-[#0B0F19] text-white py-32 lg:py-60 px-6 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-30"><img src="/images/join.jpg" className="w-full h-full object-cover" alt="Campfire" /></div>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F19]"></div>
               <h2 className="relative z-10 text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">Start The Trail</h2>
               <p className="relative z-10 text-lg font-light text-gray-300 max-w-2xl mx-auto">Boys and girls ages 11-17 are welcome to join year-round.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 relative z-20 mb-24">
               <div className="bg-white grid grid-cols-1 lg:grid-cols-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-none">
                 
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

        {/* --- MEMBER PORTAL --- */}
        {currentPage === 'portal' && (
          <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
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
              <div className="pb-32">
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
                
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                   {/* SCOUT DOLLARS PORTAL CARD */}
                   <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-[#1D3A6C] mb-6 shadow-sm"><CreditCard size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Scout Dollars</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Check live family balances and leader transaction entry.</p>
                      </div>
                      <button onClick={() => { setCurrentPage('scoutDollars'); setParentAccount(null); setParentError(''); }} className="flex items-center space-x-2 text-[#1D3A6C] font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform text-left">
                        <span>Access Bank</span><ChevronRight size={14}/>
                      </button>
                   </div>
                   
                   <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-orange-600 mb-6 shadow-sm"><Utensils size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">University of Cooking</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Troop cookbook and University of Cooking planning.</p>
                      </div>
                      <a href="https://sites.google.com/view/troop170universityofcooking/university-of-cooking" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-orange-600 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
                        <span>Open Site</span><ExternalLink size={14}/>
                      </a>
                   </div>
                   
                   <div className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group rounded-none">
                      <div>
                         <div className="w-12 h-12 bg-white flex items-center justify-center text-indigo-600 mb-6 shadow-sm"><BookOpen size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Family Handbook</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-8">Information for scouts and families on how the troop works.</p>
                      </div>
                      <a href="https://drive.google.com/file/d/1HJXppDP_Hl7XXf9lfFr0HMBWDXLYGnLi/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
                        <span>View Document</span><ExternalLink size={14}/>
                      </a>
                   </div>

                   <div className="group relative bg-[#161B22] rounded-3xl p-8 border border-white/5 hover:border-[#BE1E2D]/50 transition-all duration-500 overflow-hidden lg:col-span-2">
                     <div className="absolute -right-8 -top-8 text-white/5 group-hover:text-[#BE1E2D]/10 transition-colors duration-500 pointer-events-none">
                       <BookOpen size={160} />
                     </div>

                     <div className="relative z-10">
                       <div className="w-12 h-12 bg-[#BE1E2D]/10 rounded-xl flex items-center justify-center text-[#BE1E2D] mb-6">
                         <BookOpen size={24} />
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-3">Scout Life Magazine</h3>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
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

        {/* --- DYNAMIC ROOM: SCOUT DOLLARS (BANKING CARD & LEADER TRANSACTION SYSTEM) --- */}
        {currentPage === 'scoutDollars' && (
          <div className="bg-gray-50 min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="bg-[#050B14] py-20 px-6 text-center shadow-md relative overflow-hidden">
               <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                 <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-none mb-4 border border-white/10">
                    <CreditCard size={14} className="text-green-400" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-green-400">Troop 170 Financial Reserve</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">Scout Dollar Bank</h2>
                 <button onClick={() => setCurrentPage('portal')} className="text-gray-400 hover:text-white uppercase font-black tracking-widest text-[10px] transition-colors">← Return to Vault</button>

                 {/* Role Switcher Tabs */}
                 <div className="flex mt-8 border border-white/10 bg-white/5 p-1 rounded-none">
                    <button 
                      onClick={() => setScoutDollarMode('parent')} 
                      className={`px-6 py-2.5 font-black uppercase tracking-wider text-xs transition-colors rounded-none ${scoutDollarMode === 'parent' ? 'bg-white text-gray-900 shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      Family Account Card
                    </button>
                    <button 
                      onClick={() => setScoutDollarMode('leader')} 
                      className={`px-6 py-2.5 font-black uppercase tracking-wider text-xs transition-colors rounded-none flex items-center space-x-1.5 ${scoutDollarMode === 'leader' ? 'bg-[#BE1E2D] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Shield size={14} />
                      <span>Leader Transaction Hub</span>
                    </button>
                 </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
              
              {/* =========================================
                  PARENT / SCOUT MOBILE BANKING VIEW
                 ========================================= */}
              {scoutDollarMode === 'parent' && (
                <div>
                  {/* Account Login Form */}
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

                  {/* BANKING CARD CONTAINER */}
                  {parentAccount && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                      
                      {/* Mobile Banking Card (Fintech Gradient Card) */}
                      <div className="relative overflow-hidden bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364] text-white p-8 md:p-10 shadow-2xl rounded-2xl border border-white/10">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col justify-between min-h-[220px]">
                          
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
                      </div>

                      {/* Transaction Feed */}
                      <div className="bg-white shadow-xl border border-gray-100 p-8 rounded-none">
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

              {/* =========================================
                  LEADER TRANSACTION FORM (ADMIN)
                 ========================================= */}
              {scoutDollarMode === 'leader' && (
                <div className="bg-white shadow-2xl border-t-8 border-[#BE1E2D] p-8 md:p-10 rounded-none animate-in fade-in duration-300">
                  
                  {!leaderAuthUnlocked ? (
                    <div className="max-w-md mx-auto text-center py-6">
                      <div className="w-16 h-16 bg-red-50 text-[#BE1E2D] flex items-center justify-center mx-auto mb-4">
                        <Lock size={30} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">Leader Authorization</h3>
                      <p className="text-gray-500 text-xs mb-6">Enter leader gate key to log withdrawals and credits.</p>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (leaderPassInput.trim() === LEADER_PORTAL_PASSCODE) {
                          setLeaderAuthUnlocked(true);
                          setLeaderAuthError(false);
                        } else {
                          setLeaderAuthError(true);
                        }
                      }}>
                        <input 
                          type="password" 
                          placeholder="Leader Key"
                          value={leaderPassInput}
                          onChange={(e) => setLeaderPassInput(e.target.value)}
                          className="w-full p-4 bg-gray-50 border border-gray-200 text-center font-bold tracking-widest text-lg focus:border-[#BE1E2D] outline-none mb-4"
                        />
                        {leaderAuthError && <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-4">Incorrect Passcode</p>}
                        <button type="submit" className="w-full p-4 bg-[#BE1E2D] text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors">
                          Access Leader Ledger
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div>
                          <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#BE1E2D] mb-1">
                            <ShieldCheck size={14} /> <span>Leader Authorized Session</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Record Transaction</h3>
                        </div>
                        <button 
                          onClick={() => { setLeaderAuthUnlocked(false); setLeaderPassInput(''); }} 
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
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Leader Email (Audit Identity)</label>
                            <input 
                              required 
                              type="email" 
                              value={leaderEmail} 
                              onChange={(e) => setLeaderEmail(e.target.value)}
                              placeholder="scoutmaster@troop170.org" 
                              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-[#1D3A6C] outline-none"
                            />
                          </div>
                        </div>

                        {/* Transaction Type Radio Selector */}
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

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050B14] text-white pt-24 pb-12 px-6 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
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

          <div>
             <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-6 text-[#BE1E2D]">Navigation</h4>
             <ul className="space-y-4">
               {navLinks.map(page => (
                 <li key={page.id} className="hover:text-white text-gray-400 cursor-pointer transition-colors uppercase font-bold tracking-wider text-xs" onClick={() => { setCurrentPage(page.id); window.scrollTo(0,0); }}>{page.label}</li>
               ))}
               <li><a href="https://venmo.com/Troop170Unionville" target="_blank" rel="noopener noreferrer" className="text-[#008CFF] hover:underline uppercase font-bold tracking-wider text-xs">Sustaining Fund</a></li>
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
                 <Phone className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="leading-tight">860.352.5471</p>
               </li>
               <li className="flex items-start space-x-3">
                 <Mail className="text-[#BE1E2D] shrink-0 mt-0.5" size={16}/>
                 <p className="break-all leading-tight">bsatroop170unionville<br/>@gmail.com</p>
               </li>
             </ul>
          </div>

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
          <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" onClick={() => setSelectedBadge(null)}></div>
          
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
