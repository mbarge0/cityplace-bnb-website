// Netlify Forms event: fires after a verified submission is saved.
// Named submission-created so the /buy deal-room form can keep
// data-netlify="true" and still land on /buy/thanks/. Always return 200 so a
// Resend miss cannot bounce the saved lead.

const fs = require("fs");
const path = require("path");

const FORM_NAME = "deal-room-request";
const SUBJECT = "CityPlace bnb: financial and operations summaries (Dallas, TX)";
const BUY_URL = "https://cityplacebnb.com/buy";

const PDFS = [
  {
    file: "cityplace-financial-summary.pdf",
    filename: "CityPlace-bnb-financial-summary.pdf",
  },
  {
    file: "cityplace-operations-summary.pdf",
    filename: "CityPlace-bnb-operations-summary.pdf",
  },
];

function ok(reason) {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok", reason: reason || "ok" }),
  };
}

function parseBody(event) {
  if (!event || event.body == null) return {};
  let body = event.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.error("submission-created: body was not JSON");
      return {};
    }
  }
  return body && typeof body === "object" ? body : {};
}

function submissionFrom(body) {
  const payload = body.payload && typeof body.payload === "object" ? body.payload : body;
  const data = payload.data && typeof payload.data === "object" ? payload.data : payload;
  const formName = String(
    payload.form_name || data["form-name"] || data.form_name || ""
  ).trim();
  return { payload, data, formName };
}

function field(data, key) {
  const v = data[key];
  if (v == null) return "";
  return String(v).trim();
}

function isValidEmail(email) {
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function pdfCandidates(filename) {
  return [
    path.join(__dirname, "cityplace-package", filename),
    path.join(__dirname, "..", "cityplace-package", filename),
    path.join(process.cwd(), "netlify", "functions", "cityplace-package", filename),
    path.join(process.cwd(), "cityplace-package", filename),
  ];
}

function readPdf(filename) {
  const tried = pdfCandidates(filename);
  for (const p of tried) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p);
    } catch (err) {
      // keep looking
    }
  }
  console.error("submission-created: missing PDF", filename, "looked in", tried);
  return null;
}

function loadAttachments() {
  const attachments = [];
  for (const spec of PDFS) {
    const buf = readPdf(spec.file);
    if (!buf || !buf.length) return null;
    attachments.push({
      filename: spec.filename,
      content: buf.toString("base64"),
      content_type: "application/pdf",
    });
  }
  return attachments;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead) {
  const nameLine = lead.name ? lead.name : "there";
  const extras = [
    lead.phone && "Phone: " + lead.phone,
    lead.buyerType && "Buying as: " + lead.buyerType,
    lead.proofOfFunds && "Proof of funds: " + lead.proofOfFunds,
    lead.timeline && "Timeline: " + lead.timeline,
    lead.message && "Note: " + lead.message,
  ].filter(Boolean);

  const extraText = extras.length
    ? "\nWhat you submitted:\n" + extras.join("\n") + "\n"
    : "";

  const text = [
    "Thanks for requesting the deal room on CityPlace bnb, " + nameLine + ".",
    "",
    "3604 San Jacinto St, Dallas, TX 75204. Ten renovated 1BR/1BA extended-stay suites with full kitchens, a two-minute walk from Baylor University Medical Center. T12 through June 2026: $307,946 revenue, $176,844 NOI, on roughly four years of operating history. The operation runs remotely on about five hours a week, and it transfers with the building.",
    "",
    "This offering is unpriced. Buyers are invited to submit their own valuation.",
    "",
    "Attached (two PDFs):",
    "1. Financial summary. T12 revenue, expense detail, both underwritings (STR actuals and multifamily-normalized), a cap-rate reference table, the 2025 appraisals and the 2026 assessed value.",
    "2. Operations summary. The operating stack that transfers, channel mix, demand drivers, the regulatory picture, and exactly what is included in a sale.",
    "",
    "CityPlace bnb is offered through the owner's listing arrangements and is listed with Marcus & Millichap. I hold a Texas real estate license. Please copy the listing broker on any offer or further diligence so we stay inside the listing.",
    "",
    "The deal room goes further than the attachments: reservation-level earnings broken out by channel, roughly four years of monthly P&L, both June 2025 appraisals in full, the lender term sheet, the systems documentation, and 2026 tax records. Access is granted to qualified buyers after a short introductory call.",
    extraText,
    "Next step: reply with a couple of windows that work for a call, and whether you would want to tour in person in Dallas or on live video through the building. Deal-room access and the tour are booked from there.",
    "",
    "An institutional lender term sheet has been obtained at 75% LTV, with 80% available at a DSCR of 1.15 or better. Lender name and full terms are in the deal room. That is subject to underwriting and appraisal; it is not a pre-approval or a commitment.",
    "",
    "Matt Barge",
    "Prestige Rental LLC",
    "Texas real estate license holder",
    BUY_URL,
    "",
    "This email is not a solicitation to the public and is sent only because you asked for the package. Figures are owner-provided and verifiable in diligence; please verify independently. Financing descriptions reflect an obtained term sheet, subject to underwriting and appraisal, not guaranteed and not pre-approved.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const extraHtml = extras.length
    ? "<p style=\"margin:1.2em 0 0;color:#595b66;font-size:14px\"><strong>What you submitted</strong><br>" +
      extras.map(escapeHtml).join("<br>") +
      "</p>"
    : "";

  const html = [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;color:#17171e;line-height:1.55;max-width:640px">',
    "<p>Thanks for requesting the deal room on CityPlace bnb, " + escapeHtml(nameLine) + ".</p>",
    "<p>3604 San Jacinto St, Dallas, TX 75204. Ten renovated 1BR/1BA extended-stay suites with full kitchens, a two-minute walk from Baylor University Medical Center. T12 through June 2026: <strong>$307,946</strong> revenue, <strong>$176,844</strong> NOI, on roughly four years of operating history. The operation runs remotely on about five hours a week, and it transfers with the building.</p>",
    '<p style="background:#f1eee6;border-left:3px solid #66407f;padding:.7em 1em;margin:1.2em 0"><strong>This offering is unpriced.</strong> Buyers are invited to submit their own valuation.</p>',
    "<p><strong>Attached (two PDFs):</strong></p>",
    "<ol>",
    "<li><strong>Financial summary.</strong> T12 revenue, expense detail, both underwritings (STR actuals and multifamily-normalized), a cap-rate reference table, the 2025 appraisals and the 2026 assessed value.</li>",
    "<li><strong>Operations summary.</strong> The operating stack that transfers, channel mix, demand drivers, the regulatory picture, and exactly what is included in a sale.</li>",
    "</ol>",
    "<p>CityPlace bnb is offered through the owner&rsquo;s listing arrangements and is listed with Marcus &amp; Millichap. I hold a Texas real estate license. Please copy the listing broker on any offer or further diligence so we stay inside the listing.</p>",
    "<p><strong>The deal room goes further than the attachments:</strong> reservation-level earnings broken out by channel, roughly four years of monthly P&amp;L, both June 2025 appraisals in full, the lender term sheet, the systems documentation, and 2026 tax records. Access is granted to qualified buyers after a short introductory call.</p>",
    extraHtml,
    "<p><strong>Next step:</strong> reply with a couple of windows that work for a call, and whether you would want to tour in person in Dallas or on live video through the building. Deal-room access and the tour are booked from there.</p>",
    "<p>An institutional lender term sheet has been obtained at 75% LTV, with 80% available at a DSCR of 1.15 or better. Lender name and full terms are in the deal room. That is subject to underwriting and appraisal; it is not a pre-approval or a commitment.</p>",
    "<p>Matt Barge<br>Prestige Rental LLC<br>Texas real estate license holder<br>",
    '<a href="' + BUY_URL + '" style="color:#66407f">' + BUY_URL + "</a></p>",
    '<p style="font-size:12px;color:#8a8593">This email is not a solicitation to the public and is sent only because you asked for the package. Figures are owner-provided and verifiable in diligence; please verify independently. Financing descriptions reflect an obtained term sheet, subject to underwriting and appraisal, not guaranteed and not pre-approved.</p>',
    "</div>",
  ].join("");

  return { text, html };
}

async function sendResend(apiKey, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

exports.handler = async (event) => {
  try {
    const body = parseBody(event);
    const { data, formName } = submissionFrom(body);

    if (formName !== FORM_NAME) {
      console.log("submission-created: skip form", formName || "(none)");
      return ok("skipped-form");
    }

    if (field(data, "bot-field")) {
      console.log("submission-created: skip honeypot");
      return ok("honeypot");
    }

    const lead = {
      name: field(data, "name"),
      email: field(data, "email"),
      phone: field(data, "phone"),
      buyerType: field(data, "buyer-type"),
      proofOfFunds: field(data, "proof-of-funds"),
      timeline: field(data, "timeline"),
      message: field(data, "message"),
    };

    if (!isValidEmail(lead.email)) {
      console.log("submission-created: invalid buyer email, not sending package");
      return ok("invalid-email");
    }

    const apiKey = (process.env.RESEND_API_KEY || "").trim();
    const from = (process.env.PACKAGE_FROM_EMAIL || "").trim();
    const notify = (process.env.PACKAGE_NOTIFY_EMAIL || "").trim();

    if (!apiKey) {
      console.error("submission-created: RESEND_API_KEY missing; lead saved, package not sent");
      return ok("missing-resend-key");
    }
    if (!from) {
      console.error("submission-created: PACKAGE_FROM_EMAIL missing; lead saved, package not sent");
      return ok("missing-from");
    }

    const attachments = loadAttachments();
    if (!attachments) {
      console.error("submission-created: PDFs not bundled; lead saved, package not sent");
      return ok("missing-pdfs");
    }

    const { text, html } = buildEmail(lead);
    const emailPayload = {
      from: from,
      to: [lead.email],
      subject: SUBJECT,
      html: html,
      text: text,
      attachments: attachments,
    };

    if (notify && isValidEmail(notify) && notify.toLowerCase() !== lead.email.toLowerCase()) {
      emailPayload.bcc = [notify];
      emailPayload.reply_to = notify;
    }

    let result = await sendResend(apiKey, emailPayload);
    if (!result.ok && emailPayload.bcc) {
      console.error("submission-created: send with BCC failed", result.status, result.text);
      delete emailPayload.bcc;
      result = await sendResend(apiKey, emailPayload);
    }

    if (!result.ok) {
      console.error("submission-created: Resend error", result.status, result.text);
      return ok("resend-error");
    }

    console.log("submission-created: package sent");
    return ok("sent");
  } catch (err) {
    console.error("submission-created: unexpected error", err && err.message);
    return ok("error");
  }
};
