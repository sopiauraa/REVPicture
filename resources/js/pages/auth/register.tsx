import React from "react";
import { useForm } from "@inertiajs/react";
import "../../../css/register-style.css";

// Input Component
const Input = ({ value, onChange, placeholder, label, name, error }: any) => (
  <div className="input-container">
    <label className="input-label">{label}</label>
    <input
      className="input-field"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

// Button Component
const Button = ({ type = "button", children }: any) => (
  <button className="button" type={type}>
    <span className="button-text">{children}</span>
  </button>
);

const Register = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/register"); 
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
        <form onSubmit={handleSubmit} className="form-content">
          <div className="logo-wrapper">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7Z7cWQJTXY/ek0s7xjv_expires_30_days.png"
              alt="Profile"
              className="profile-image"
            />
          </div>

          <Input
            name="name"
            value={data.name}
            onChange={(e: any) => setData("name", e.target.value)}
            placeholder="Masukkan Nama Anda"
            label="Nama"
            error={errors.name}
          />
          <Input
            name="email"
            value={data.email}
            onChange={(e: any) => setData("email", e.target.value)}
            placeholder="Masukkan Email Anda"
            label="Email"
            error={errors.email}
          />
          <Input
            name="password"
            value={data.password}
            onChange={(e: any) => setData("password", e.target.value)}
            placeholder="Masukkan Kata Sandi"
            label="Kata Sandi"
            error={errors.password}
          />
          <Input
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(e: any) =>
              setData("password_confirmation", e.target.value)
            }
            placeholder="Konfirmasi Kata Sandi"
            label="Konfirmasi Kata Sandi"
            error={errors.password_confirmation}
          />

          <Button type="submit">
            {processing ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
