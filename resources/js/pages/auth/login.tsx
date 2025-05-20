import { Link, useForm } from '@inertiajs/react';
import React from 'react';
import '../../../css/register-style.css';

const Input = ({ type = 'text', value, onChange, placeholder, label, name, error }: any) => (
    <div className="input-container">
        <label className="input-label">{label}</label>
        <input className="input-field" type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} />
        {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
);

const Button = ({ type = 'button', children }: any) => (
    <button className="button" type={type}>
        <span className="button-text">{children}</span>
    </button>
);

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login'); // matches Laravel login route
    };

    return (
        <div className="form-container">
            {/* Header */}
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

            {/* Login Form */}
            <div className="form-center-wrapper">
                <form onSubmit={handleSubmit} className="form-content">
                    <div className="logo-wrapper">
                        <img
                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/7Z7cWQJTXY/ek0s7xjv_expires_30_days.png"
                            alt="Login Icon"
                            className="profile-image"
                        />
                    </div>

                    <Input
                        name="email"
                        value={data.email}
                        onChange={(e: any) => setData('email', e.target.value)}
                        placeholder="Masukkan Email Anda"
                        label="Email"
                        error={errors.email}
                    />
                    <Input
                        name="password"
                        value={data.password}
                        onChange={(e: any) => setData('password', e.target.value)}
                        placeholder="Masukkan Kata Sandi"
                        label="Kata Sandi"
                        error={errors.password}
                    />

                    <Button type="submit">{processing ? 'Memproses...' : 'Masuk'}</Button>

                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-blue-300 underline">
                            Daftar di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
