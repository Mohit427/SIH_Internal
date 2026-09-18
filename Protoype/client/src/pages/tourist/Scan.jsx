import { useState } from "react";

export default function Scan() {
  const [view, setView] = useState("scanning"); // scanning | verified | unregistered

  const doScan = () => {
    setView("scanning");
    setTimeout(() => setView("verified"), 700);
  };

  if (view === "scanning") {
    return (
      <div className="tw-scan-dark">
        <div className="tw-scan-intro">
          <div className="tw-scan-title">Trust Rail</div>
          <div className="tw-scan-subtitle">
            Scan a guide, cab or shop QR to check registry status and fair
            price.
          </div>
        </div>
        <div className="tw-viewfinder-wrap">
          <button className="tw-viewfinder" onClick={doScan} aria-label="Simulate scan">
            <span className="tw-corner tw-corner-tl" />
            <span className="tw-corner tw-corner-tr" />
            <span className="tw-corner tw-corner-bl" />
            <span className="tw-corner tw-corner-br" />
            <span className="tw-scanline" />
          </button>
        </div>
        <div className="tw-scan-footer">
          <div className="tw-scan-hint">TAP THE FRAME TO SIMULATE A SCAN</div>
          <button className="tw-btn-white-block" onClick={doScan}>
            Enter code manually
          </button>
          <div className="tw-scan-offline">Works offline · last registry sync 12 min ago</div>
        </div>
      </div>
    );
  }

  if (view === "verified") {
    return (
      <div className="tw-scan-result">
        <div className="tw-vendor-card">
          <div className="tw-vendor-badge-row tw-vendor-badge-verified">
            <span className="tw-vendor-check">✓</span>
            VERIFIED · STATE TOURISM REGISTRY
          </div>
          <div className="tw-vendor-main">
            <div className="tw-vendor-photo">PHOTO</div>
            <div className="tw-vendor-info">
              <div className="tw-vendor-name">Rajesh Kumhar</div>
              <div className="tw-vendor-desc">
                Approved heritage guide · Hindi, English, French
              </div>
              <div className="tw-vendor-tags">
                <span className="tw-tag">★ 4.8 · 612 trips</span>
                <span className="tw-tag">9 yrs</span>
              </div>
            </div>
          </div>
          <div className="tw-vendor-meta-grid">
            <div>
              <div className="tw-meta-label">LICENCE NO.</div>
              <div className="tw-meta-value">RTG/RJ/17-4419</div>
            </div>
            <div>
              <div className="tw-meta-label">STATUS</div>
              <div className="tw-meta-value tw-meta-good">Valid → 31 Mar 27</div>
            </div>
          </div>
          <div className="tw-price-block">
            <div className="tw-price-row">
              <span className="tw-price-label">FAIR PRICE · HALF-DAY GUIDE</span>
              <span className="tw-price-amount">₹400–600</span>
            </div>
            <div className="tw-price-track">
              <span className="tw-price-fill" style={{ left: "22%", width: "36%" }} />
              <span className="tw-price-marker" style={{ left: "50%" }} />
              <span className="tw-price-quote" style={{ left: "50%" }}>
                QUOTED ₹550
              </span>
            </div>
            <div className="tw-price-range">
              <span>₹200</span>
              <span>₹1,000+</span>
            </div>
            <div className="tw-price-note tw-price-note-good">
              Within the fair range for Amber Fort in peak season.
            </div>
          </div>
        </div>
        <div className="tw-scan-actions">
          <button className="tw-btn-outline" onClick={() => setView("unregistered")}>
            Unregistered example
          </button>
          <button className="tw-btn-navy" onClick={doScan}>
            Scan again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-scan-result">
      <div className="tw-vendor-card tw-vendor-card-warn">
        <div className="tw-vendor-badge-row tw-vendor-badge-warn">
          <span className="tw-vendor-warn">!</span>
          NOT IN THE REGISTRY
        </div>
        <div className="tw-vendor-main tw-vendor-main-warn">
          <div className="tw-vendor-name">"Pink City Tours &amp; Cabs"</div>
          <div className="tw-vendor-desc">
            This QR does not match any licensed guide, cab or shop. No
            licence, insurance or complaint history exists.
          </div>
          <div className="tw-vendor-meta-grid">
            <div>
              <div className="tw-meta-label">LICENCE NO.</div>
              <div className="tw-meta-value tw-meta-bad">No record</div>
            </div>
            <div>
              <div className="tw-meta-label">STATUS</div>
              <div className="tw-meta-value tw-meta-bad">Unverified</div>
            </div>
          </div>
        </div>
        <div className="tw-price-block">
          <div className="tw-price-row">
            <span className="tw-price-label">QUOTED VS FAIR RANGE</span>
            <span className="tw-price-amount tw-price-amount-bad">₹1,200</span>
          </div>
          <div className="tw-price-track">
            <span className="tw-price-fill" style={{ left: "14%", width: "26%" }} />
            <span className="tw-price-marker tw-price-marker-bad" style={{ left: "84%" }} />
            <span className="tw-price-quote tw-price-quote-bad" style={{ left: "100%" }}>
              2.4× FAIR
            </span>
          </div>
          <div className="tw-price-range">
            <span>₹200</span>
            <span>₹1,400+</span>
          </div>
        </div>
      </div>
      <div className="tw-scan-actions">
        <button className="tw-btn-outline" onClick={() => setView("verified")}>
          Verified example
        </button>
        <button className="tw-btn-saffron-solid" onClick={doScan}>
          Report this QR
        </button>
      </div>
      <div className="tw-scan-note">
        Reports go to the district tourism officer. Your name is never shared
        with the vendor.
      </div>
    </div>
  );
}
