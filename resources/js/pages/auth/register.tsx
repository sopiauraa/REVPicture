import React, { useState } from "react";
import "../../../css/register-style.css";

// Input Component
const Input = ({ value, onChange, placeholder, label }: any) => (
  <div className="input-container">
    <label className="input-label">{label}</label>
    <input
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Button Component
const Button = ({ onClick, children }: any) => (
  <button className="button" onClick={onClick}>
    <span className="button-text">{children}</span>
  </button>
);

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");

  const handleSubmit = () => {
    alert("Daftar berhasil!");
  };

  return (
    <div className="form-container">
      {/* Header / Navbar */}
      <div className="header">
        <div className="nav-left">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7Z7cWQJTXY/12jj40if_expires_30_days.png"
            alt="Logo"
            className="header-logo"
          />
          <span className="header-title">REV PICTURE</span>
        </div>
        <div className="header-nav">
          <span className="header-nav-item">HOME</span>
          <span className="header-nav-item">AKUN</span>
          <span className="header-nav-item">KERANJANG</span>
        </div>
      </div>

      {/* Form Content */}
<div className="form-center-wrapper">
  <div className="form-content">
    <div className="logo-wrapper">
      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7Z7cWQJTXY/ek0s7xjv_expires_30_days.png"
        alt="Profile"
        className="profile-image"
      />
    </div>

    <Input
      value={nama}
      onChange={setNama}
      placeholder="Masukkan Nama Anda"
      label="Nama"
    />
    <Input
      value={email}
      onChange={setEmail}
      placeholder="Masukkan Email Anda"
      label="Email"
    />
    <Input
      value={sandi}
      onChange={setSandi}
      placeholder="Masukkan Kata Sandi"
      label="Kata Sandi"
    />
    <Button onClick={handleSubmit}>Daftar</Button>
  </div>
</div>
    </div>
  );
};

export default Register;
