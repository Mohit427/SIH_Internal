import { useNavigate } from "react-router-dom";

export default function Bystander() {
  const navigate = useNavigate();

  return (
    <div className="tw-bystander">
      <div className="tw-bystander-header">
        <div className="tw-bystander-eyebrow">EMERGENCY · आपातकाल</div>
        <div className="tw-bystander-title">THIS PERSON NEEDS HELP</div>
        <div className="tw-bystander-title-hi">इस व्यक्ति को मदद चाहिए</div>
      </div>

      <div className="tw-bystander-body">
        <a href="tel:112" className="tw-bystander-call">
          CALL 112
        </a>

        <div className="tw-bystander-facts">
          <div className="tw-bystander-fact">
            <div className="tw-bystander-fact-label">BLOOD GROUP</div>
            <div className="tw-bystander-fact-value">B positive</div>
          </div>
          <div className="tw-bystander-fact">
            <div className="tw-bystander-fact-label">ALLERGIES</div>
            <div className="tw-bystander-fact-value tw-bystander-fact-saffron">Peanuts</div>
          </div>
          <div className="tw-bystander-fact">
            <div className="tw-bystander-fact-label">CONDITION</div>
            <div className="tw-bystander-fact-value">Asthma — inhaler in left bag pocket</div>
          </div>
          <div className="tw-bystander-fact">
            <div className="tw-bystander-fact-label">NAME · NATIONALITY</div>
            <div className="tw-bystander-fact-value">Aditi Sharma · India</div>
          </div>
        </div>

        <div className="tw-bystander-location">
          <div className="tw-bystander-location-label">LIVE LOCATION SENT TO POLICE</div>
          <div className="tw-bystander-location-value">Amber Fort, Gate 1 · unit 4 min away</div>
        </div>
      </div>

      <button className="tw-bystander-exit" onClick={() => navigate("/tourist/sos")}>
        ✕
      </button>
    </div>
  );
}
