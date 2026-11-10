import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package, MapPin, Printer, RefreshCw, CheckCircle,
  AlertTriangle, Users, Phone, Mail, ClipboardList,
  CheckSquare, Square, Sparkles, Search, ExternalLink,
  ArrowLeft, X
} from 'lucide-react';

// Live read-only Google Apps Script endpoint (returns sanitized non-financial order JSON)
const WREATH_API_URL =
  'https://script.google.com/macros/s/AKfycbzCynuJmNFE8m19REtdu1J5YM5m3C5RPtr5fOf9qBSSzak9lsISXJq5HK2KWQMCw1u2/exec';

const escapeHtml = (str) =>
  String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m]));

const toSafeQty = (val) => {
  const num = parseInt(val, 10);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

// Normalize Scout key so minor trailing periods ("Gabriel C" vs "Gabriel C.") group together cleanly
const getScoutGroupKey = (name) =>
  String(name || '')
    .replace(/\.+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const choosePreferredScoutLabel = (existing, candidate) => {
  if (!existing) return candidate;
  // Prefer the version with a trailing initial period (e.g., "Gabriel C." over "Gabriel C")
  if (!existing.endsWith('.') && candidate.endsWith('.')) return candidate;
  return existing;
};

const formatOrderItemsList = (order) => {
  const items = [];
  if (order.wreath24Undec > 0) items.push({ label: '24" Undecorated (Plain)', qty: order.wreath24Undec, decorated: false });
  if (order.wreath24Dec > 0) items.push({ label: '24" Decorated', qty: order.wreath24Dec, decorated: true });
  if (order.wreath30Undec > 0) items.push({ label: '30" Undecorated (Plain)', qty: order.wreath30Undec, decorated: false });
  if (order.wreath30Dec > 0) items.push({ label: '30" Decorated', qty: order.wreath30Dec, decorated: true });
  if (order.wreath40Undec > 0) items.push({ label: '40" Undecorated (Plain)', qty: order.wreath40Undec, decorated: false });
  if (order.wreath40Dec > 0) items.push({ label: '40" Decorated', qty: order.wreath40Dec, decorated: true });
  return items;
};

export default function WreathDistribution({ onReturnToPortal }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [wrongTabNotice, setWrongTabNotice] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedScoutKey, setSelectedScoutKey] = useState('');
  const [scoutSearch, setScoutSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [checkedStatus, setCheckedStatus] = useState({});

  const loadWreathOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    setWrongTabNotice(false);

    try {
      const res = await fetch(WREATH_API_URL, {
        method: 'GET',
        cache: 'no-store',
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Wreath Apps Script endpoint returned an HTML error or needs re-deployment.');
      }

      if (data.needsTabSelection) {
        setWrongTabNotice(true);
        setOrders([]);
        return;
      }

      // Guard against the old single-scout Scout_Pick_List summary view returning misaligned columns
      if (
        data.sheetName === 'Scout_Pick_List' &&
        Array.isArray(data.orders) &&
        data.orders.length > 0 &&
        data.orders.every((o) => !o.customerName || o.customerName === 'Customer')
      ) {
        setWrongTabNotice(true);
        setOrders([]);
        return;
      }

      if (!data.success) {
        throw new Error(data.error || 'Unable to load wreath distribution sheet.');
      }

      // Strictly whitelist non-financial logistics fields only
      const cleanOrders = (data.orders || [])
        .map((raw, idx) => {
          const w24u = toSafeQty(raw.wreath24Undec);
          const w24d = toSafeQty(raw.wreath24Dec);
          const w30u = toSafeQty(raw.wreath30Undec);
          const w30d = toSafeQty(raw.wreath30Dec);
          const w40u = toSafeQty(raw.wreath40Undec);
          const w40d = toSafeQty(raw.wreath40Dec);

          const totalUndecorated = w24u + w30u + w40u;
          const totalDecorated = w24d + w30d + w40d;
          const totalWreaths = totalUndecorated + totalDecorated;

          const scoutRaw = String(raw.scoutName || '').replace(/\s+/g, ' ').trim();
          return {
            uid: `row-${raw.rowNumber || idx + 1}`,
            rowNumber: raw.rowNumber || idx + 1,
            orderId: String(raw.orderId || '').trim(),
            scoutName: scoutRaw || 'General Troop 170 Fund',
            customerName: String(raw.customerName || '').trim(),
            address: String(raw.address || '').trim(),
            phone: String(raw.phone || '').trim(),
            email: String(raw.email || '').trim(),
            deliveryNotes: String(raw.deliveryNotes || '').trim(),
            wreath24Undec: w24u,
            wreath24Dec: w24d,
            wreath30Undec: w30u,
            wreath30Dec: w30d,
            wreath40Undec: w40u,
            wreath40Dec: w40d,
            totalUndecorated,
            totalDecorated,
            totalWreaths,
          };
        })
        .filter((o) => o.totalWreaths > 0);

      setOrders(cleanOrders);
      setLastUpdated(data.updatedAt || new Date().toISOString());
    } catch (err) {
      setError(err.message || 'Failed to connect to the wreath spreadsheet.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWreathOrders(false);
  }, [loadWreathOrders]);

  // Build normalized list of Scouts
  const scoutDirectory = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const key = getScoutGroupKey(order.scoutName);
      const current = map.get(key) || {
        key,
        label: order.scoutName,
        orderCount: 0,
        wreathCount: 0,
      };
      current.label = choosePreferredScoutLabel(current.label, order.scoutName);
      current.orderCount += 1;
      current.wreathCount += order.totalWreaths;
      map.set(key, current);
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [orders]);

  const filteredScouts = useMemo(() => {
    const q = scoutSearch.trim().toLowerCase();
    if (!q) return scoutDirectory;
    return scoutDirectory.filter((s) => s.label.toLowerCase().includes(q));
  }, [scoutDirectory, scoutSearch]);

  const selectedScoutObj = useMemo(
    () => scoutDirectory.find((s) => s.key === selectedScoutKey) || null,
    [scoutDirectory, selectedScoutKey]
  );

  const scoutOrders = useMemo(() => {
    if (!selectedScoutKey) return [];
    return orders.filter((o) => getScoutGroupKey(o.scoutName) === selectedScoutKey);
  }, [orders, selectedScoutKey]);

  const displayedOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return scoutOrders;
    return scoutOrders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
    );
  }, [scoutOrders, orderSearch]);

  // Compute complete Scout Pick List + Decorating Supplies Totals
  const totals = useMemo(() => {
    return scoutOrders.reduce(
      (acc, o) => {
        acc.w24Undec += o.wreath24Undec;
        acc.w24Dec += o.wreath24Dec;
        acc.w30Undec += o.wreath30Undec;
        acc.w30Dec += o.wreath30Dec;
        acc.w40Undec += o.wreath40Undec;
        acc.w40Dec += o.wreath40Dec;
        acc.totalUndecorated += o.totalUndecorated;
        acc.totalDecorated += o.totalDecorated;
        acc.totalWreaths += o.totalWreaths;
        return acc;
      },
      {
        w24Undec: 0,
        w24Dec: 0,
        w30Undec: 0,
        w30Dec: 0,
        w40Undec: 0,
        w40Dec: 0,
        totalUndecorated: 0,
        totalDecorated: 0,
        totalWreaths: 0,
      }
    );
  }, [scoutOrders]);

  const decoratingKit = useMemo(() => {
    const redBows = totals.totalDecorated;
    const smallCones = totals.w24Dec * 5;
    const largeCones30 = totals.w30Dec * 5;
    const largeConeClusters40 = totals.w40Dec * 5;
    const largeCones40 = largeConeClusters40 * 3;
    const totalLargeCones = largeCones30 + largeCones40;
    return {
      redBows,
      smallCones,
      largeCones30,
      largeConeClusters40,
      largeCones40,
      totalLargeCones,
    };
  }, [totals]);

  const toggleOrderCheck = (uid, field) => {
    setCheckedStatus((prev) => ({
      ...prev,
      [uid]: {
        ...(prev[uid] || {}),
        [field]: !(prev[uid] && prev[uid][field]),
      },
    }));
  };

  const deliveredCount = useMemo(
    () => scoutOrders.filter((o) => checkedStatus[o.uid]?.delivered).length,
    [scoutOrders, checkedStatus]
  );

  // Clean, XSS-safe Printable Packet Generator (zero financial fields)
  const handlePrintPacket = (includePickSummary = true, targetOrders = scoutOrders) => {
    if (!selectedScoutObj || targetOrders.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups in your browser to print your Scout wreath pick list and delivery sheets.');
      return;
    }

    try {
      printWindow.opener = null;
    } catch (_) {}

    const safeScout = escapeHtml(selectedScoutObj.label);
    const printedDate = escapeHtml(new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }));

    const pickListSection = includePickSummary
      ? `
      <div class="section">
        <div class="pickup-banner">
          <strong>PICKUP LOCATION:</strong> Scoutmaster Vallario's House
          <span class="badge-count">${totals.totalWreaths} Total Wreaths • ${totals.totalUndecorated} Undecorated / ${totals.totalDecorated} Decorated</span>
        </div>

        <h2>1. Wreath Pickup Count (Scoutmaster Vallario's House)</h2>
        <table>
          <thead>
            <tr>
              <th>Wreath Size</th>
              <th class="num">Undecorated (Plain)</th>
              <th class="num">Decorated</th>
              <th class="num">Size Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>24" Balsam Wreath</strong></td>
              <td class="num">${totals.w24Undec}</td>
              <td class="num">${totals.w24Dec}</td>
              <td class="num"><strong>${totals.w24Undec + totals.w24Dec}</strong></td>
            </tr>
            <tr>
              <td><strong>30" Balsam Wreath</strong></td>
              <td class="num">${totals.w30Undec}</td>
              <td class="num">${totals.w30Dec}</td>
              <td class="num"><strong>${totals.w30Undec + totals.w30Dec}</strong></td>
            </tr>
            <tr>
              <td><strong>40" Estate Wreath</strong></td>
              <td class="num">${totals.w40Undec}</td>
              <td class="num">${totals.w40Dec}</td>
              <td class="num"><strong>${totals.w40Undec + totals.w40Dec}</strong></td>
            </tr>
            <tr class="total-row">
              <td><strong>TOTAL TO PICK UP</strong></td>
              <td class="num"><strong>${totals.totalUndecorated}</strong></td>
              <td class="num"><strong>${totals.totalDecorated}</strong></td>
              <td class="num"><strong>${totals.totalWreaths}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2>2. Decorating Supplies Pickup &amp; Assembly Guide</h2>
        ${
          totals.totalDecorated === 0
            ? '<p class="note-box">No decorating supplies required — all wreaths for this Scout are undecorated.</p>'
            : `
            <div class="supplies-grid">
              <div class="supply-box">
                <div class="supply-label">Red Bows</div>
                <div class="supply-val">${decoratingKit.redBows}</div>
                <div class="supply-sub">1 bow per decorated wreath (${totals.totalDecorated} total)</div>
              </div>
              <div class="supply-box">
                <div class="supply-label">Small Cones (for 24")</div>
                <div class="supply-val">${decoratingKit.smallCones}</div>
                <div class="supply-sub">${totals.w24Dec} × 24" Dec (5 small cones each)</div>
              </div>
              <div class="supply-box">
                <div class="supply-label">Large Cones (for 30" &amp; 40")</div>
                <div class="supply-val">${decoratingKit.totalLargeCones}</div>
                <div class="supply-sub">${totals.w30Dec} × 30" (5 ea = ${decoratingKit.largeCones30}) + ${totals.w40Dec} × 40" (5 clusters of 3 = ${decoratingKit.largeCones40})</div>
              </div>
            </div>
            <div class="guide-box">
              <strong>Decorating Instructions:</strong>
              <ul>
                <li><strong>24" Decorated (${totals.w24Dec}):</strong> Attach 1 red bow and space <strong>5 small cones</strong> evenly around the wreath.</li>
                <li><strong>30" Decorated (${totals.w30Dec}):</strong> Attach 1 red bow and space <strong>5 large cones</strong> evenly around the wreath.</li>
                <li><strong>40" Decorated (${totals.w40Dec}):</strong> Attach 1 red bow and space <strong>5 clusters of 3 large cones</strong> (15 large cones total) evenly around the wreath.</li>
              </ul>
            </div>
            `
        }
      </div>
      <div class="page-break"></div>
      `
      : '';

    const deliveryRowsHtml = targetOrders
      .map((order, idx) => {
        const itemsHtml = formatOrderItemsList(order)
          .map(
            (it) =>
              `<span class="item-pill ${it.decorated ? 'pill-dec' : 'pill-plain'}">${it.qty} × ${escapeHtml(it.label)}</span>`
          )
          .join(' ');

        return `
        <div class="order-card">
          <div class="order-top">
            <div>
              <span class="stop-num">STOP #${idx + 1}</span>
              <strong class="cust-name">${escapeHtml(order.customerName || 'Customer')}</strong>
            </div>
            <div class="check-boxes">
              <span>&#9744; Packed</span>
              <span>&#9744; Decorated</span>
              <span>&#9744; Delivered</span>
            </div>
          </div>
          <div class="order-body">
            <div class="order-col">
              <div><strong>Delivery Address:</strong> ${escapeHtml(order.address || 'No address listed — check with Scout/family')}</div>
              <div class="contact-line">
                ${order.phone ? `<span><strong>Phone:</strong> ${escapeHtml(order.phone)}</span>` : ''}
                ${order.email ? `<span><strong>Email:</strong> ${escapeHtml(order.email)}</span>` : ''}
              </div>
              ${order.deliveryNotes ? `<div class="notes-line"><strong>Notes:</strong> ${escapeHtml(order.deliveryNotes)}</div>` : ''}
            </div>
            <div class="order-items">
              <div class="items-label">Wreaths (${order.totalWreaths} Total):</div>
              <div>${itemsHtml}</div>
            </div>
          </div>
        </div>`;
      })
      .join('');

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Troop 170 Wreath Distribution - ${safeScout}</title>
    <style>
      @page { size: letter portrait; margin: 0.45in; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 0; font-size: 12px; line-height: 1.4; }
      .header { border-bottom: 3px solid #143d23; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
      .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 0.02em; color: #143d23; }
      .header .meta { text-align: right; font-size: 11px; color: #4b5563; }
      h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #1D3A6C; margin: 16px 0 8px; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; }
      .pickup-banner { background: #ecfdf5; border: 1.5px solid #143d23; padding: 10px 12px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
      .badge-count { font-weight: 800; color: #143d23; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th, td { border: 1px solid #d1d5db; padding: 7px 10px; text-align: left; }
      th { background: #f3f4f6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
      .num { text-align: center; width: 18%; }
      .total-row { background: #f0fdf4; }
      .supplies-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; }
      .supply-box { border: 1.5px solid #111827; padding: 10px; text-align: center; }
      .supply-label { font-size: 10px; text-transform: uppercase; font-weight: 800; color: #4b5563; }
      .supply-val { font-size: 24px; font-weight: 900; color: #143d23; margin: 2px 0; }
      .supply-sub { font-size: 10px; color: #374151; }
      .guide-box { border: 1px solid #d1d5db; background: #f9fafb; padding: 10px 14px; font-size: 11px; }
      .guide-box ul { margin: 6px 0 0; padding-left: 18px; }
      .guide-box li { margin-bottom: 3px; }
      .note-box { border: 1px solid #d1d5db; padding: 10px; background: #f9fafb; }
      .page-break { page-break-after: always; }
      .order-card { border: 1.5px solid #374151; padding: 10px 12px; margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
      .order-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 6px; }
      .stop-num { background: #143d23; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; margin-right: 8px; }
      .cust-name { font-size: 14px; }
      .check-boxes { font-size: 11px; font-weight: 700; display: flex; gap: 10px; }
      .order-body { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
      .order-col { flex: 1.4; }
      .contact-line { margin-top: 4px; display: flex; flex-wrap: wrap; gap: 14px; font-size: 11px; color: #374151; }
      .notes-line { margin-top: 4px; font-size: 11px; background: #fef3c7; padding: 3px 6px; }
      .order-items { flex: 1; text-align: right; }
      .items-label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #4b5563; margin-bottom: 4px; }
      .item-pill { display: inline-block; padding: 3px 7px; font-size: 11px; font-weight: 800; border: 1px solid #111827; margin: 2px 0 2px 4px; }
      .pill-dec { background: #fef2f2; border-color: #991b1b; color: #7f1d1d; }
      .pill-plain { background: #ecfdf5; border-color: #14532d; color: #14532d; }
      .footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>Troop 170 • Wreath Distribution</h1>
        <div><strong>Scout:</strong> ${safeScout} &nbsp;|&nbsp; <strong>Delivery Orders:</strong> ${targetOrders.length}</div>
      </div>
      <div class="meta">
        Printed: ${printedDate}<br/>
        Non-Financial Logistics Sheet Only
      </div>
    </div>

    ${pickListSection}

    <h2>${includePickSummary ? '3. ' : ''}Customer Delivery Orders (${targetOrders.length})</h2>
    ${deliveryRowsHtml}

    <div class="footer">Scouting America Troop 170 • Farmington / Unionville, CT • Pickup from Scoutmaster Vallario's House</div>
  </body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (_) {}
    }, 250);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 sm:pb-32">
      {/* HEADER */}
      <div className="bg-[#050B14] py-14 sm:py-20 px-4 text-center shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-emerald-800 rounded-full blur-[160px] opacity-25 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 mb-4">
            <Package size={12} className="text-emerald-400" />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-300">
              Pickup • Decorating • Delivery Logistics
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-3 uppercase">
            Wreath Distribution
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mb-6 font-light">
            Select your Scout name to view what to pick up from Scoutmaster Vallario&apos;s house, exact decorating supplies, and printable customer delivery sheets. No financial data is displayed.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <button
              onClick={onReturnToPortal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Dashboard</span>
            </button>
            <button
              onClick={() => loadWreathOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Syncing Sheet...' : 'Refresh Live Orders'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-6 sm:space-y-8">
        {/* LOADING */}
        {loading && (
          <div className="bg-white p-10 shadow-xl border-t-4 border-emerald-700 text-center">
            <RefreshCw size={28} className="mx-auto text-emerald-700 animate-spin mb-3" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-700">
              Loading Live Scout Wreath Pick Lists...
            </p>
          </div>
        )}

        {/* SETUP NOTICE IF APPS SCRIPT STILL SERVES SINGLE-SCOUT TAB */}
        {!loading && wrongTabNotice && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 sm:p-8 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-amber-950 mb-1">
                  Master Orders Tab Deployment Needed
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  The spreadsheet endpoint is currently pointing at the single-scout{' '}
                  <code className="font-mono bg-amber-100 px-1.5 py-0.5">Scout_Pick_List</code> tab. Once your Google Apps Script Web App is deployed with the Master Orders version (scanning the full orders tab and stripping all financial columns), every Scout&apos;s live pick list will load here automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-[#BE1E2D] p-6 shadow-lg flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-[#BE1E2D] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-red-900 mb-1">
                  Could Not Load Spreadsheet Data
                </h3>
                <p className="text-xs text-red-800">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadWreathOrders(true)}
              className="px-4 py-2 bg-[#BE1E2D] text-white text-[10px] font-black uppercase tracking-widest shrink-0 hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* SCOUT SELECTOR */}
        {!loading && !error && !wrongTabNotice && (
          <div className="bg-white p-6 sm:p-8 shadow-xl border-t-4 border-[#143d23]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 block mb-1">
                  Step 1 • Select Your Scout
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">
                  Scout &amp; Family Pick List Lookup
                </h3>
              </div>
              {lastUpdated && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Synced {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {scoutDirectory.length} Scouts • {orders.length} Orders
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                  Filter Scout Name
                </label>
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={scoutSearch}
                    onChange={(e) => setScoutSearch(e.target.value)}
                    placeholder="Type Scout name..."
                    className="w-full pl-10 pr-9 py-3 bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 focus:border-[#143d23] outline-none"
                  />
                  {scoutSearch && (
                    <button
                      type="button"
                      onClick={() => setScoutSearch('')}
                      aria-label="Clear Scout filter"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="md:col-span-7">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                  Choose Selling Scout ({filteredScouts.length} Matching)
                </label>
                <select
                  value={selectedScoutKey}
                  onChange={(e) => {
                    setSelectedScoutKey(e.target.value);
                    setOrderSearch('');
                  }}
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-sm font-black text-gray-900 focus:border-[#143d23] outline-none"
                >
                  <option value="">-- Select Scout Name to Generate Pick List --</option>
                  {filteredScouts.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} — {s.wreathCount} Wreath{s.wreathCount === 1 ? '' : 's'} ({s.orderCount} Order{s.orderCount === 1 ? '' : 's'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedScoutKey && scoutDirectory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Quick Select Scout:
                </p>
                <div className="flex flex-wrap gap-2">
                  {filteredScouts.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setSelectedScoutKey(s.key);
                        setOrderSearch('');
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-[#143d23] text-[#143d23] hover:text-white border border-emerald-200 text-xs font-bold transition-colors"
                    >
                      {s.label} <span className="opacity-70">({s.wreathCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SELECTED SCOUT PICK LIST + DECORATING KIT + DELIVERY ORDERS */}
        {!loading && !error && selectedScoutObj && (
          <>
            {/* PICKUP SUMMARY BANNER & PRINT ACTIONS */}
            <div className="bg-white p-6 sm:p-8 shadow-xl border-l-4 border-[#143d23]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-[#143d23] text-[10px] font-black uppercase tracking-widest mb-2">
                    <MapPin size={12} />
                    <span>Pickup Location: Scoutmaster Vallario&apos;s House</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
                    Pick List: {selectedScoutObj.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handlePrintPacket(true, scoutOrders)}
                    className="inline-flex items-center space-x-2 px-5 py-3 bg-[#143d23] hover:bg-black text-white text-[11px] font-black uppercase tracking-widest transition-colors shadow-md"
                  >
                    <Printer size={15} />
                    <span>Print Pick List + Delivery Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrintPacket(false, scoutOrders)}
                    className="inline-flex items-center space-x-2 px-5 py-3 bg-[#1D3A6C] hover:bg-black text-white text-[11px] font-black uppercase tracking-widest transition-colors shadow-md"
                  >
                    <ClipboardList size={15} />
                    <span>Print Delivery Slips Only</span>
                  </button>
                </div>
              </div>

              {/* TOP KPI TOTALS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Total Wreaths
                  </div>
                  <div className="text-3xl font-black text-gray-900 mt-1">{totals.totalWreaths}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">To pick up total</div>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                    Undecorated (Plain)
                  </div>
                  <div className="text-3xl font-black text-emerald-900 mt-1">{totals.totalUndecorated}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">No decorating kit needed</div>
                </div>
                <div className="bg-red-50/70 border border-red-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#BE1E2D]">
                    Decorated Wreaths
                  </div>
                  <div className="text-3xl font-black text-[#BE1E2D] mt-1">{totals.totalDecorated}</div>
                  <div className="text-[11px] text-red-800 mt-0.5">Need bows &amp; cones below</div>
                </div>
                <div className="bg-blue-50/70 border border-blue-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1D3A6C]">
                    Delivery Stops
                  </div>
                  <div className="text-3xl font-black text-[#1D3A6C] mt-1">{scoutOrders.length}</div>
                  <div className="text-[11px] text-blue-800 mt-0.5">
                    {deliveredCount} of {scoutOrders.length} checked off
                  </div>
                </div>
              </div>

              {/* SIZE BREAKDOWN & DECORATING SUPPLIES SIDE-BY-SIDE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SIZE TABLE */}
                <div className="lg:col-span-6 border border-gray-200 overflow-x-auto">
                  <div className="bg-gray-900 text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest">
                    Wreaths to Pick Up at Scoutmaster Vallario&apos;s House
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-500">
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-3 text-center">Undecorated</th>
                        <th className="py-3 px-3 text-center">Decorated</th>
                        <th className="py-3 px-4 text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-900">24&quot; Balsam Wreath</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-800">{totals.w24Undec}</td>
                        <td className="py-3 px-3 text-center font-bold text-[#BE1E2D]">{totals.w24Dec}</td>
                        <td className="py-3 px-4 text-center font-black text-gray-900">{totals.w24Undec + totals.w24Dec}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-900">30&quot; Balsam Wreath</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-800">{totals.w30Undec}</td>
                        <td className="py-3 px-3 text-center font-bold text-[#BE1E2D]">{totals.w30Dec}</td>
                        <td className="py-3 px-4 text-center font-black text-gray-900">{totals.w30Undec + totals.w30Dec}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-900">40&quot; Estate Wreath</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-800">{totals.w40Undec}</td>
                        <td className="py-3 px-3 text-center font-bold text-[#BE1E2D]">{totals.w40Dec}</td>
                        <td className="py-3 px-4 text-center font-black text-gray-900">{totals.w40Undec + totals.w40Dec}</td>
                      </tr>
                      <tr className="bg-emerald-50 font-black">
                        <td className="py-3 px-4 uppercase text-xs tracking-wider text-gray-900">Grand Total</td>
                        <td className="py-3 px-3 text-center text-emerald-900">{totals.totalUndecorated}</td>
                        <td className="py-3 px-3 text-center text-[#BE1E2D]">{totals.totalDecorated}</td>
                        <td className="py-3 px-4 text-center text-gray-950">{totals.totalWreaths}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* DECORATING SUPPLIES KIT */}
                <div className="lg:col-span-6 border border-red-200 bg-red-50/30 flex flex-col justify-between">
                  <div>
                    <div className="bg-[#BE1E2D] text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                      <Sparkles size={13} />
                      <span>Decorating Supplies Kit to Pick Up</span>
                    </div>

                    {totals.totalDecorated === 0 ? (
                      <div className="p-6 text-sm text-gray-600">
                        This Scout only has <strong>undecorated</strong> wreaths, so <strong>0 bows and 0 cones</strong> are needed.
                      </div>
                    ) : (
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white border border-red-100 p-3 text-center shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                              Red Bows
                            </div>
                            <div className="text-2xl font-black text-[#BE1E2D] mt-0.5">
                              {decoratingKit.redBows}
                            </div>
                            <div className="text-[10px] text-gray-500">1 per decorated wreath</div>
                          </div>
                          <div className="bg-white border border-amber-200 p-3 text-center shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                              Small Cones
                            </div>
                            <div className="text-2xl font-black text-amber-800 mt-0.5">
                              {decoratingKit.smallCones}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {totals.w24Dec} × 24&quot; Dec (5 ea)
                            </div>
                          </div>
                          <div className="bg-white border border-amber-200 p-3 text-center shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                              Large Cones
                            </div>
                            <div className="text-2xl font-black text-amber-900 mt-0.5">
                              {decoratingKit.totalLargeCones}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              30&quot;: {decoratingKit.largeCones30} • 40&quot;: {decoratingKit.largeCones40}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 p-3.5 text-xs text-gray-700 space-y-1.5">
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">
                            How to Decorate Each Size:
                          </div>
                          <div>
                            <strong>• 24&quot; Decorated ({totals.w24Dec}):</strong> 1 Red Bow + <strong>5 Small Cones</strong> spaced around the wreath.
                          </div>
                          <div>
                            <strong>• 30&quot; Decorated ({totals.w30Dec}):</strong> 1 Red Bow + <strong>5 Large Cones</strong> spaced around the wreath.
                          </div>
                          <div>
                            <strong>• 40&quot; Decorated ({totals.w40Dec}):</strong> 1 Red Bow + <strong>5 Clusters of 3 Large Cones</strong> (15 large cones total) around the wreath.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DELIVERY ORDERS LIST */}
            <div className="bg-white p-6 sm:p-8 shadow-xl border-t-4 border-[#1D3A6C]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D3A6C] block mb-1">
                    Step 2 • Delivery Drop-Off Orders (No Financial Info Shown)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 flex items-center space-x-2">
                    <Users size={20} className="text-[#1D3A6C]" />
                    <span>Customer Delivery List ({displayedOrders.length})</span>
                  </h3>
                </div>

                <div className="relative w-full md:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search customer or street..."
                    className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#1D3A6C] outline-none"
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch('')}
                      aria-label="Clear order search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {displayedOrders.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No delivery orders match your current search.
                </p>
              ) : (
                <div className="space-y-4">
                  {displayedOrders.map((order, idx) => {
                    const status = checkedStatus[order.uid] || {};
                    const items = formatOrderItemsList(order);
                    const mapsUrl = order.address
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`
                      : '';

                    return (
                      <div
                        key={order.uid}
                        className={`border transition-colors p-4 sm:p-6 ${
                          status.delivered
                            ? 'bg-emerald-50/40 border-emerald-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* LEFT: CUSTOMER + ADDRESS */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#1D3A6C] text-white text-[10px] font-black uppercase tracking-wider">
                                Stop #{idx + 1}
                              </span>
                              <h4 className="text-base sm:text-lg font-black text-gray-900">
                                {order.customerName || 'Customer'}
                              </h4>
                              {status.delivered && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                  <CheckCircle size={11} />
                                  <span>Delivered</span>
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-start gap-2 text-xs sm:text-sm text-gray-800 font-semibold">
                              <MapPin size={15} className="text-[#BE1E2D] shrink-0 mt-0.5" />
                              <span>{order.address || 'No street address entered — verify with customer'}</span>
                              {mapsUrl && (
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-[#1D3A6C] hover:underline ml-1"
                                >
                                  <span>Maps</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              {order.phone && (
                                <a
                                  href={`tel:${order.phone.replace(/[^0-9+]/g, '')}`}
                                  className="inline-flex items-center space-x-1.5 hover:text-gray-900"
                                >
                                  <Phone size={12} />
                                  <span>{order.phone}</span>
                                </a>
                              )}
                              {order.email && (
                                <span className="inline-flex items-center space-x-1.5">
                                  <Mail size={12} />
                                  <span>{order.email}</span>
                                </span>
                              )}
                            </div>

                            {order.deliveryNotes && (
                              <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 inline-block">
                                <strong>Delivery Note:</strong> {order.deliveryNotes}
                              </div>
                            )}
                          </div>

                          {/* RIGHT: ITEMIZED WREATHS & CHECKBOXES */}
                          <div className="flex flex-col lg:items-end justify-between gap-3 shrink-0">
                            <div className="flex flex-wrap lg:justify-end gap-2">
                              {items.map((item) => (
                                <span
                                  key={item.label}
                                  className={`px-3 py-1.5 text-xs font-black border ${
                                    item.decorated
                                      ? 'bg-red-50 text-[#BE1E2D] border-red-200'
                                      : 'bg-emerald-50 text-[#143d23] border-emerald-200'
                                  }`}
                                >
                                  {item.qty} × {item.label}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <button
                                type="button"
                                onClick={() => toggleOrderCheck(order.uid, 'packed')}
                                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border transition-colors ${
                                  status.packed
                                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {status.packed ? <CheckSquare size={13} /> : <Square size={13} />}
                                <span>Picked Up / Ready</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleOrderCheck(order.uid, 'delivered')}
                                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border transition-colors ${
                                  status.delivered
                                    ? 'bg-emerald-700 border-emerald-700 text-white'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {status.delivered ? <CheckSquare size={13} /> : <Square size={13} />}
                                <span>Delivered</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
