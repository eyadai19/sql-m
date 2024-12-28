"use client";

import { useState } from "react";
import { FaRobot, FaDatabase, FaLightbulb, FaMedal, FaUsers, FaQuestionCircle, FaTable } from "react-icons/fa";

const Popup = () => {
  const [showPopup, setShowPopup] = useState(true);

  if (!showPopup) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 32, 63, 0.9)", // خلفية داكنة مائلة إلى الأزرق
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF", // خلفية بيضاء للحاوية
          color: "#00203F",
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "90%",
          width: "450px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          border: "2px solid #ADF0D1", // إطار مميز
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "15px", color: "#00203F" }}>
          🚀 Discover Amazing Features!
        </h2>
        <p style={{ fontSize: "1rem", marginBottom: "20px", color: "#555555" }}>
          Explore our cutting-edge features that empower your experience:
        </p>
        <ul style={{ listStyleType: "none", padding: 0, marginBottom: "25px", lineHeight: "1.6" }}>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaRobot style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            AI Chatbot for generating smart queries
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaLightbulb style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Automatic SQL syntax suggestions
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaDatabase style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Advanced database editor tailored for you
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaTable style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Interactive ER diagrams for database tables
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaMedal style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Highlight your achievements with pride
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaUsers style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Engage with a collaborative community
          </li>
          <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaQuestionCircle style={{ marginRight: "10px", color: "#FFA500", fontSize: "1.2rem" }} />
            Participate in progress-based quizzes
          </li>
        </ul>
        <button
          onClick={() => setShowPopup(false)}
          style={{
            backgroundColor: "#ADF0D1",
            color: "#00203F",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Popup;
