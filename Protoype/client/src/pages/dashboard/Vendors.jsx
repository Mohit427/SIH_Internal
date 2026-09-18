import { useAppState } from "../../state/StateContext.jsx";
import { api } from "../../api.js";
import { VendorStatusBadge } from "../../components/ui.jsx";

export default function Vendors() {
  const { state } = useAppState();
  const { vendors } = state;

  return (
    <div className="vendors-view">
      <div className="map-view-header">
        <h2>Vendor Registry</h2>
        <p className="hint-text">
          Suspending or flagging a vendor here updates instantly across any
          other open Dashboard tab. The Tourist App's Scan screen is
          currently a self-contained visual demo and no longer reads this
          registry live — see the README's "Caveats" section.
        </p>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Service</th>
              <th>Route</th>
              <th>Licence ID</th>
              <th>Price range</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.service}</td>
                <td>{v.route}</td>
                <td>{v.licenseId || "—"}</td>
                <td>
                  ₹{v.priceRange.min} - ₹{v.priceRange.max}
                </td>
                <td>
                  <VendorStatusBadge status={v.licenseStatus} />
                </td>
                <td className="table-actions">
                  {v.licenseStatus !== "suspended" ? (
                    <button
                      className="btn btn-hold btn-sm"
                      onClick={() => api.setVendorStatus(v.id, "suspended")}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="btn btn-safe btn-sm"
                      onClick={() => api.setVendorStatus(v.id, "verified")}
                    >
                      Reinstate
                    </button>
                  )}
                  {v.licenseStatus === "unregistered" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => api.setVendorStatus(v.id, "verified")}
                    >
                      Mark Verified
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
