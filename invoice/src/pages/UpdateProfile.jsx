import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!currentPassword) {
      setError("Current password is required");
      setLoading(false);
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (!newUsername && !newPassword) {
      setError("Provide username or password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newUsername: newUsername || undefined,
            newPassword: newPassword || undefined,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          animation: "fadeUp 0.5s ease",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Update Profile
        </h2>

        <p style={{ textAlign: "center", color: "#777", fontSize: "14px" }}>
          Update your username or password
        </p>

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#d8000c",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: "#e6ffed",
              color: "#2d7a2d",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div style={{ marginTop: "15px" }}>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter current password"
            />
          </div>

          {/* Username */}
          <div style={{ marginTop: "15px" }}>
            <label>New Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={inputStyle}
              placeholder={`Current: ${user?.username || ""}`}
            />
          </div>

          {/* New Password */}
          <div style={{ marginTop: "15px" }}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              placeholder="Leave blank if no change"
            />
          </div>

          {/* Confirm */}
          <div style={{ marginTop: "15px" }}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={inputStyle}
              disabled={!newPassword}
              placeholder="Confirm password"
            />
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              background: "#667eea",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            background: "#ccc",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// 🔥 Input Style
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
};