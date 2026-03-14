import React from "react";
import { Download } from "lucide-react";

interface ItineraryPDFExportProps {
  itineraryData: any;
  tripData: any;
}

/* ── helper: pick emoji for activity ── */
function activityEmoji(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("trek") || l.includes("hike")) return "🥾";
  if (l.includes("breakfast") || l.includes("cafe") || l.includes("coffee"))
    return "☕";
  if (
    l.includes("lunch") ||
    l.includes("dinner") ||
    l.includes("food") ||
    l.includes("restaurant")
  )
    return "🍽️";
  if (l.includes("hotel") || l.includes("check-in") || l.includes("stay") || l.includes("resort"))
    return "🏨";
  if (
    l.includes("temple") ||
    l.includes("museum") ||
    l.includes("fort") ||
    l.includes("palace")
  )
    return "🏛️";
  if (l.includes("market") || l.includes("shop")) return "🛍️";
  if (
    l.includes("viewpoint") ||
    l.includes("valley") ||
    l.includes("lake") ||
    l.includes("nature") ||
    l.includes("garden")
  )
    return "🌿";
  if (
    l.includes("adventure") ||
    l.includes("river") ||
    l.includes("rafting") ||
    l.includes("paraglid") ||
    l.includes("zip")
  )
    return "⚡";
  if (l.includes("beach") || l.includes("sea") || l.includes("ocean"))
    return "🏖️";
  if (
    l.includes("travel") ||
    l.includes("drive") ||
    l.includes("road") ||
    l.includes("journey") ||
    l.includes("departure") ||
    l.includes("arrival")
  )
    return "🚗";
  if (l.includes("photo")) return "📸";
  if (l.includes("sunset") || l.includes("sunrise")) return "🌅";
  if (l.includes("waterfall")) return "💧";
  return "📍";
}

export function ItineraryPDFExport({
  itineraryData,
  tripData,
}: ItineraryPDFExportProps) {
  const generatePDF = () => {
    if (!itineraryData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download the PDF");
      return;
    }

    const travelType = tripData?.travelType
      ? tripData.travelType.charAt(0).toUpperCase() + tripData.travelType.slice(1)
      : "";

    const tripTitle = `Your ${itineraryData.destination || ""} ${travelType === "Couple" ? "Getaway" : travelType === "Solo" ? "Solo Journey" : "Adventure"}`;

    const dateStr = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    /* ── budget bars ── */
    const budgetEntries = itineraryData.budgetBreakdown
      ? Object.entries(itineraryData.budgetBreakdown)
      : [];
    const budgetNums = budgetEntries.map(([k, v]) => ({
      key: k,
      value: v as string,
      num: parseInt(String(v).replace(/[^\d]/g, ""), 10) || 0,
    }));
    const budgetTotal = budgetNums.reduce((s, n) => s + n.num, 0) || 1;
    const budgetBars = budgetNums.map((n) => ({
      ...n,
      pct: Math.round((n.num / budgetTotal) * 100),
    }));

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${itineraryData.destination || "Travel"} Itinerary — Velosta</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; background: #fff; line-height: 1.6; }

  .cover {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 60px 40px;
    background: linear-gradient(160deg, #FFF8F0 0%, #FFF1E0 50%, #FDEBD0 100%);
    page-break-after: always;
  }
  .cover-icon { font-size: 48px; margin-bottom: 20px; }
  .cover h1 { font-size: 36px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin-bottom: 8px; }
  .cover .subtitle { font-size: 16px; color: #666; margin-bottom: 32px; }
  .cover-meta { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }
  .cover-chip { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: white; border-radius: 100px; font-size: 13px; font-weight: 500; color: #444; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .cover-summary { max-width: 560px; font-size: 14px; color: #555; line-height: 1.8; text-align: center; padding: 24px; background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .cover-footer { margin-top: 40px; font-size: 11px; color: #aaa; }
  .brand { color: #DA880F; font-weight: 700; }

  .page { padding: 40px; }
  .section-title { font-size: 20px; font-weight: 700; color: #1a1a2e; margin: 32px 0 16px 0; display: flex; align-items: center; gap: 8px; }

  .budget-card { background: #FAFAFA; border: 1px solid #eee; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
  .budget-row { margin-bottom: 14px; }
  .budget-row-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .budget-label { font-size: 13px; color: #555; text-transform: capitalize; }
  .budget-amount { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  .budget-bar-bg { height: 8px; background: #EDEDED; border-radius: 100px; overflow: hidden; }
  .budget-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #E8A040, #DA880F); }
  .budget-pct { font-size: 10px; color: #999; margin-top: 2px; }
  .budget-total { display: flex; justify-content: space-between; padding-top: 14px; border-top: 2px solid #eee; margin-top: 8px; }
  .budget-total span:first-child { font-size: 14px; font-weight: 600; color: #555; }
  .budget-total span:last-child { font-size: 14px; font-weight: 700; color: #DA880F; }

  .day-card { margin-bottom: 28px; page-break-inside: avoid; }
  .day-header-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .day-badge { width: 44px; height: 44px; background: linear-gradient(135deg, #E8A040, #DA880F); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .day-title { font-size: 16px; font-weight: 700; color: #1a1a2e; }
  .day-theme { font-size: 12px; color: #DA880F; font-weight: 500; margin-top: 1px; }
  .day-cost-badge { margin-left: auto; font-size: 11px; font-weight: 600; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 100px; }
  .day-content { margin-left: 56px; background: #FAFAFA; border: 1px solid #eee; border-radius: 16px; overflow: hidden; }

  .activity { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
  .activity:last-of-type { border-bottom: none; }
  .act-icon-col { width: 50px; text-align: center; flex-shrink: 0; }
  .act-emoji { font-size: 18px; display: block; margin-bottom: 2px; }
  .act-time { font-size: 10px; color: #999; font-weight: 500; }
  .act-details { flex: 1; }
  .act-name { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  .act-desc { font-size: 12px; color: #666; margin-top: 3px; line-height: 1.6; }
  .act-tags { display: flex; gap: 12px; margin-top: 6px; }
  .act-tag { font-size: 10px; color: #888; display: flex; align-items: center; gap: 3px; }
  .act-tag.price { color: #DA880F; font-weight: 500; }

  .day-footer { padding: 14px 20px; background: #f5f5f5; border-top: 1px solid #eee; }
  .footer-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 11px; color: #555; line-height: 1.5; }
  .footer-row:last-child { margin-bottom: 0; }
  .footer-icon { flex-shrink: 0; font-size: 13px; margin-top: 1px; }
  .footer-label { font-weight: 600; color: #444; }

  .expense-card { background: #FAFAFA; border: 1px solid #eee; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .expense-cat { margin-bottom: 16px; }
  .expense-cat-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .expense-cat-name { font-size: 13px; font-weight: 600; color: #444; text-transform: capitalize; }
  .expense-cat-amount { font-size: 13px; font-weight: 600; color: #DA880F; }
  .expense-detail { font-size: 11px; color: #777; padding-left: 12px; border-left: 2px solid #eee; margin-top: 4px; margin-bottom: 3px; line-height: 1.5; }
  .totals-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
  .total-box { padding: 16px; border-radius: 12px; text-align: center; }
  .total-box.per-person { background: #FFF6EE; border: 1px solid rgba(218,136,15,0.2); }
  .total-box.group { background: #DA880F; color: white; }
  .total-box .total-label { font-size: 11px; opacity: 0.7; margin-bottom: 4px; }
  .total-box .total-value { font-size: 20px; font-weight: 700; }

  .tips-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
  .tips-card.local { background: #eff6ff; border-color: #bfdbfe; }
  .tips-card h3 { font-size: 14px; font-weight: 600; color: #166534; margin-bottom: 10px; }
  .tips-card.local h3 { color: #1e40af; }
  .tip-item { font-size: 12px; color: #444; margin-bottom: 6px; line-height: 1.6; display: flex; gap: 6px; }
  .tip-item span:first-child { flex-shrink: 0; }

  .final-total { background: linear-gradient(135deg, #DA880F, #c9770b); color: white; text-align: center; padding: 28px; border-radius: 16px; margin-top: 24px; }
  .final-total .ft-label { font-size: 13px; opacity: 0.85; margin-bottom: 6px; }
  .final-total .ft-value { font-size: 32px; font-weight: 800; }
  .velosta-footer { text-align: center; padding: 32px 0 16px; font-size: 11px; color: #bbb; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cover { page-break-after: always; }
    .day-card { page-break-inside: avoid; }
    @page { margin: 0.8cm; }
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-icon">✈️</div>
  <h1>${tripTitle}</h1>
  <p class="subtitle">${itineraryData.destination || ""} ${itineraryData.duration ? "· " + itineraryData.duration : ""}</p>
  <div class="cover-meta">
    ${itineraryData.duration ? '<span class="cover-chip">📅 ' + itineraryData.duration + "</span>" : ""}
    ${travelType ? '<span class="cover-chip">👥 ' + travelType + " Trip</span>" : ""}
    ${itineraryData.totalEstimatedCost ? '<span class="cover-chip">💰 ' + itineraryData.totalEstimatedCost + "</span>" : ""}
    ${tripData?.travelers ? '<span class="cover-chip">🧑 ' + tripData.travelers.adults + " Adult" + (tripData.travelers.adults > 1 ? "s" : "") + (tripData.travelers.children ? ", " + tripData.travelers.children + " Child" + (tripData.travelers.children > 1 ? "ren" : "") : "") + "</span>" : ""}
  </div>
  ${itineraryData.summary ? '<div class="cover-summary">' + itineraryData.summary + "</div>" : ""}
  <p class="cover-footer">Generated on ${dateStr} · Powered by <span class="brand">Velosta AI</span></p>
</div>

<!-- ITINERARY -->
<div class="page">

  ${budgetBars.length > 0 ? `
  <div class="section-title">💰 Where Your Money Goes</div>
  <div class="budget-card">
    ${budgetBars.map((b) => `
    <div class="budget-row">
      <div class="budget-row-header"><span class="budget-label">${b.key}</span><span class="budget-amount">${b.value}</span></div>
      <div class="budget-bar-bg"><div class="budget-bar-fill" style="width:${b.pct}%"></div></div>
      <div class="budget-pct">${b.pct}%</div>
    </div>`).join("")}
    ${itineraryData.totalBudget ? `<div class="budget-total"><span>Total Budget</span><span>${itineraryData.totalBudget}</span></div>` : ""}
  </div>` : ""}

  <div class="section-title">📅 Day-by-Day Itinerary</div>

  ${(itineraryData.itineraryTable || []).map((day: any, idx: number) => `
  <div class="day-card">
    <div class="day-header-row">
      <div class="day-badge">D${day.day || idx + 1}</div>
      <div>
        <div class="day-title">Day ${day.day || idx + 1}</div>
        ${day.theme ? '<div class="day-theme">🧭 ' + day.theme + "</div>" : ""}
      </div>
      ${day.dailyCost ? '<div class="day-cost-badge">' + day.dailyCost + "</div>" : ""}
    </div>
    <div class="day-content">
      ${(day.rows || []).map((act: any) => `
      <div class="activity">
        <div class="act-icon-col">
          <span class="act-emoji">${activityEmoji(act.activity || "")}</span>
          <span class="act-time">${act.time || ""}</span>
        </div>
        <div class="act-details">
          <div class="act-name">${act.activity || ""}</div>
          ${act.description ? '<div class="act-desc">' + act.description + "</div>" : ""}
          <div class="act-tags">
            ${act.distance ? '<span class="act-tag">→ ' + act.distance + "</span>" : ""}
            ${act.pricing ? '<span class="act-tag price">₹ ' + act.pricing + "</span>" : ""}
          </div>
        </div>
      </div>`).join("")}
      ${day.meals || day.accommodation ? `
      <div class="day-footer">
        ${day.meals ? `
        <div class="footer-row"><span class="footer-icon">🍽️</span><div>
          ${day.meals.breakfast ? "<div><span class='footer-label'>Breakfast:</span> " + day.meals.breakfast + "</div>" : ""}
          ${day.meals.lunch ? "<div><span class='footer-label'>Lunch:</span> " + day.meals.lunch + "</div>" : ""}
          ${day.meals.dinner ? "<div><span class='footer-label'>Dinner:</span> " + day.meals.dinner + "</div>" : ""}
        </div></div>` : ""}
        ${day.accommodation ? `<div class="footer-row"><span class="footer-icon">🏨</span><div><span class="footer-label">Stay:</span> ${day.accommodation}</div></div>` : ""}
      </div>` : ""}
    </div>
  </div>`).join("")}

  ${itineraryData.expenseSummary?.perPersonBreakdown ? `
  <div class="section-title">📊 Expense Breakdown</div>
  <div class="expense-card">
    ${Object.entries(itineraryData.expenseSummary.perPersonBreakdown).map(([cat, data]: [string, any]) => `
    <div class="expense-cat">
      <div class="expense-cat-header"><span class="expense-cat-name">${cat}</span><span class="expense-cat-amount">${data.amount}</span></div>
      ${data.details?.length ? data.details.map((d: string) => '<div class="expense-detail">' + d + "</div>").join("") : ""}
    </div>`).join("")}
    <div class="totals-row">
      ${itineraryData.expenseSummary.totalPerPerson ? '<div class="total-box per-person"><div class="total-label">Per Person</div><div class="total-value">' + itineraryData.expenseSummary.totalPerPerson + "</div></div>" : ""}
      ${itineraryData.expenseSummary.totalForGroup ? '<div class="total-box group"><div class="total-label">Group Total</div><div class="total-value">' + itineraryData.expenseSummary.totalForGroup + "</div></div>" : ""}
    </div>
  </div>` : ""}

  ${itineraryData.expenseSummary?.costSavingTips?.length ? `
  <div class="tips-card"><h3>💡 Cost Saving Tips</h3>
    ${itineraryData.expenseSummary.costSavingTips.map((t: string) => '<div class="tip-item"><span>✅</span><span>' + t + "</span></div>").join("")}
  </div>` : ""}

  ${itineraryData.localTips?.length ? `
  <div class="tips-card local"><h3>📌 Local Tips & Recommendations</h3>
    ${itineraryData.localTips.map((t: string) => '<div class="tip-item"><span>📍</span><span>' + t + "</span></div>").join("")}
  </div>` : ""}

  ${itineraryData.totalEstimatedCost ? `
  <div class="final-total">
    <div class="ft-label">Total Estimated Trip Cost</div>
    <div class="ft-value">${itineraryData.totalEstimatedCost}</div>
  </div>` : ""}

  <div class="velosta-footer">Made with ❤️ by <span class="brand">Velosta AI</span> · velosta.in</div>
</div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => printWindow.print(), 300);
    };
  };

  return (
    <button
      onClick={generatePDF}
      disabled={!itineraryData}
      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors disabled:opacity-50"
    >
      <Download className="w-3 h-3" />
      PDF
    </button>
  );
}
