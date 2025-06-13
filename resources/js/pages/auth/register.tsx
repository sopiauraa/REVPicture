import { Link, router, useForm } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import '../../../css/register-style.css';

// Input Component
const Input = ({ type = 'text', value, onChange, placeholder, label, name, error }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="input-container">
            <label className="input-label">{label}</label>
            <div className="input-wrapper">
                <input
                    className="input-field"
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPasswordField && (
                    <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
        </div>
    );
};

// Button Component
const Button = ({ type = 'button', children }: any) => (
    <button className="button" type={type}>
        <span className="button-text">{children}</span>
    </button>
);

// Notification Component
const Notification = ({ show, message, type, onClose }: any) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto close after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    // Debugging: log props
    useEffect(() => {
        if (show) {
            console.log('Notification shown:', { message, type });
        }
    }, [show, message, type]);

    if (!show) return null;

    // Fallback message if message is empty
    const displayMessage = message || 'Notifikasi tidak tersedia.';

    return (
        <div className={`notification ${type === 'success' ? 'notification-success' : 'notification-error'}`}>
            <div className="notification-content">
                {type === 'success' && <CheckCircle size={20} className="notification-icon" />}
                <span className="notification-message">{displayMessage}</span>
                <button onClick={onClose} className="notification-close">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

const Register = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                setNotification({
                    show: true,
                    message: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi. Anda akan diarahkan ke halaman verifikasi email...',
                    type: 'success',
                });
                setData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                });
                setTimeout(() => {
                    router.visit('/email/verify');
                }, 5000);
            },
            onError: () => {
                setNotification({
                    show: true,
                    message: 'Terjadi kesalahan saat mendaftar. Silakan periksa kembali data Anda.',
                    type: 'error',
                });
            },
        });
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, show: false }));
    };

    // Fungsi untuk menerjemahkan error
    const translateError = (errorMessage: string | undefined): string | undefined => {
        if (!errorMessage || typeof errorMessage !== 'string') return undefined;

        // Debug: tampilkan pesan error asli di console
        console.log('Original error:', errorMessage);

        const translations: Record<string, string> = {
            // Name errors
            'The name field is required.': 'Nama wajib diisi.',
            'The name may not be greater than 255 characters.': 'Nama maksimal 255 karakter.',
            'The name must be at least 2 characters.': 'Nama minimal 2 karakter.',

            // Email errors
            'The email field is required.': 'Email wajib diisi.',
            'The email must be a valid email address.': 'Format email tidak valid.',
            'The email field must be a valid email address.': 'Format email tidak valid.',
            'The email has already been taken.': 'Email sudah terdaftar.',

            // Password errors
            'The password field is required.': 'Kata sandi wajib diisi.',
            'The password must be at least 8 characters.': 'Kata sandi minimal 8 karakter.',
            'The password must contain at least one uppercase letter.': 'Kata sandi harus mengandung minimal satu huruf besar.',
            'The password must contain at least one lowercase letter.': 'Kata sandi harus mengandung minimal satu huruf kecil.',
            'The password must contain at least one number.': 'Kata sandi harus mengandung minimal satu angka.',
            'The password must contain at least one symbol.': 'Kata sandi harus mengandung minimal satu simbol.',

            // Password confirmation errors - semua kemungkinan variasi
            'The password field confirmation does not match.': 'Konfirmasi kata sandi tidak sama.',
            'The password confirmation does not match.': 'Konfirmasi kata sandi tidak sama.',
            'The password confirmation field is required.': 'Konfirmasi kata sandi wajib diisi.',
            'The password_confirmation field is required.': 'Konfirmasi kata sandi wajib diisi.',
            'The password confirmation and password must match.': 'Konfirmasi kata sandi tidak sama.',
            'The password and password confirmation must match.': 'Konfirmasi kata sandi tidak sama.',
        };

        // Coba terjemahkan dengan exact match terlebih dahulu
        if (translations[errorMessage]) {
            return translations[errorMessage];
        }

        // Jika tidak ada exact match, coba dengan includes untuk menangkap variasi
        if (
            errorMessage.includes('confirmation does not match') ||
            errorMessage.includes('confirmation and password must match') ||
            errorMessage.includes('password and password confirmation must match')
        ) {
            return 'Konfirmasi kata sandi tidak sama.';
        }

        if (errorMessage.includes('confirmation') && errorMessage.includes('required')) {
            return 'Konfirmasi kata sandi wajib diisi.';
        }

        // Jika masih belum ada, kembalikan pesan asli
        console.log('Untranslated error:', errorMessage);
        return errorMessage;
    };

    // Terjemahkan pesan error ke bahasa Indonesia
    const translatedErrors = {
        name: translateError(errors.name),
        email: translateError(errors.email),
        password: translateError(errors.password),
        password_confirmation: translateError(errors.password_confirmation),
    };

    return (
        <div className="form-container">
            {/* Notification */}
            <Notification show={notification.show} message={notification.message} type={notification.type} onClose={closeNotification} />

            {/* Header / Navbar */}
            {/* <div className="header">
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
            </div> */}

            {/* Form Content */}
            <div className="form-center-wrapper">
                <form onSubmit={handleSubmit} className="form-content">
                    <div className="logo-wrapper">
                        <img src="/images/REV Logo Htm.png" alt="Profile" className="profile-image" />
                    </div>

                    <Input
                        name="name"
                        value={data.name}
                        onChange={(e: any) => setData('name', e.target.value)}
                        placeholder="Masukkan Nama Anda"
                        label="Nama"
                        error={translatedErrors.name}
                    />
                    <Input
                        name="email"
                        value={data.email}
                        onChange={(e: any) => setData('email', e.target.value)}
                        placeholder="Masukkan Email Anda"
                        label="Email"
                        error={translatedErrors.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e: any) => setData('password', e.target.value)}
                        placeholder="Masukkan Kata Sandi"
                        label="Kata Sandi"
                        error={translatedErrors.password}
                    />
                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e: any) => setData('password_confirmation', e.target.value)}
                        placeholder="Konfirmasi Kata Sandi"
                        label="Konfirmasi Kata Sandi"
                        error={translatedErrors.password_confirmation}
                    />

                    <Button type="submit">{processing ? 'Memproses...' : 'Daftar'}</Button>

                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-blue-300 underline">
                            Masuk
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
