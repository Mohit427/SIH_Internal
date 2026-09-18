import { useState } from "react";

export default function IdCard() {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="tw-idcard-screen">
      <div className="tw-idcard">
        <div className="tw-idcard-top">
          <div>
            <div className="tw-idcard-eyebrow">DIGITAL TOURIST ID</div>
            <div className="tw-idcard-registry">NATIONAL TOURIST REGISTRY · IN</div>
          </div>
          <span className="tw-idcard-verified">
            <span className="tw-idcard-check">✓</span>
            VERIFIED
          </span>
        </div>

        <div className="tw-idcard-main">
          <div className="tw-idcard-photo">PHOTO</div>
          <div className="tw-idcard-info">
            <div className="tw-idcard-name">Aditi Sharma</div>
            <div className="tw-idcard-meta">IND · F · 12 Apr 1997</div>
            <div className="tw-idcard-docno-label">TOURIST ID NO.</div>
            <div className="tw-idcard-docno-row">
              <span className="tw-idcard-docno">{reveal ? "YS-2026-00842" : "•• •••• 0842"}</span>
              <button className="tw-idcard-reveal" onClick={() => setReveal((r) => !r)}>
                {reveal ? "HIDE" : "REVEAL"}
              </button>
            </div>
          </div>
        </div>

        <div className="tw-idcard-grid">
          <div>
            <div className="tw-idcard-grid-label">VISA</div>
            <div className="tw-idcard-grid-value">e-Tourist · 30d</div>
          </div>
          <div>
            <div className="tw-idcard-grid-label">VALID TO</div>
            <div className="tw-idcard-grid-value">14 Sep 2026</div>
          </div>
        </div>
      </div>

      <div className="tw-idcard-offline">
        <div className="tw-idcard-offline-code" />
        <div>
          <div className="tw-idcard-offline-title">Offline verification code</div>
          <div className="tw-idcard-offline-text">
            Show this to police or hotel staff. Rotates every 60s — no data
            leaves your phone.
          </div>
        </div>
      </div>

      <div className="tw-idcard-list">
        <div className="tw-idcard-list-row">
          <span className="tw-idcard-list-icon tw-idcard-list-icon-ok">✓</span>
          <span className="tw-idcard-list-text">Emergency medical profile</span>
          <span className="tw-idcard-list-tag">SHARED</span>
        </div>
        <div className="tw-idcard-list-row">
          <span className="tw-idcard-list-icon tw-idcard-list-icon-ok">✓</span>
          <span className="tw-idcard-list-text">Travel insurance · Axa 8841</span>
          <span className="tw-idcard-list-tag">ACTIVE</span>
        </div>
        <div className="tw-idcard-list-row">
          <span className="tw-idcard-list-icon tw-idcard-list-icon-warn">!</span>
          <span className="tw-idcard-list-text">Restricted-area permit (Ladakh)</span>
          <span className="tw-idcard-list-tag tw-idcard-list-tag-warn">ADD</span>
        </div>
      </div>

      <div className="tw-idcard-footnote">
        Document data stays encrypted on device. Only your name, photo and
        verification status are shared when scanned.
      </div>
    </div>
  );
}
