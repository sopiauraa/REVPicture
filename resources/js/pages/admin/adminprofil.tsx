import AdminLayout from '@/layouts/admin_layout';
import { usePage } from '@inertiajs/react';
import { Calendar, Camera, Edit3, Eye, EyeOff, Lock, Mail, Save, Settings, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminProfile() {
    const [activeTab, setActiveTab] = useState('profile');
    interface AuthProps {
        user?: {
            name?: string;
            email?: string;
            role?: string;
            updated_at?: string;
        };
    }

    const { auth } = usePage().props as { auth?: { user?: AuthProps['user'] } };
    const user = auth?.user;

    console.log(user);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile data state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        updated_at: user?.updated_at || '',
    });

    const [originalProfileData, setOriginalProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        updated_at: user?.updated_at || '',
    });

    // Individual states for better performance
    const [bookingNotifications, setBookingNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    // Password form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || '',
            updated_at: user?.updated_at || '',
        });
        setOriginalProfileData({
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || '',
            updated_at: user?.updated_at || '',
        });
    }, [user]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Tidak diketahui';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Tidak diketahui';

            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Tidak diketahui';
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
        { id: 'security', label: 'Keamanan', icon: Shield },
    ];

    const handleProfileUpdate = (field: keyof typeof profileData, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        // Validation
        if (!profileData.name || !profileData.name.trim()) {
            alert('Nama tidak boleh kosong');
            setLoading(false);
            return;
        }
        if (!profileData.email || !profileData.email.trim()) {
            alert('Email tidak boleh kosong');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            alert('Format email tidak valid');
            setLoading(false);
            return;
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setProfileData((prev) => ({
            ...prev,
            updated_at: new Date().toISOString(),
        }));
        setOriginalProfileData({ ...profileData });
        setIsEditing(false);
        setLoading(false);
        alert('Profil berhasil diperbarui!');
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            alert('Password baru tidak cocok!');
            return;
        }
        if (newPassword.length < 8) {
            alert('Password minimal 8 karakter!');
            return;
        }
        if (!currentPassword) {
            alert('Password saat ini harus diisi!');
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Reset password form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
        alert('Password berhasil diperbarui!');
    };

    const handleCancel = () => {
        setProfileData({ ...originalProfileData });
        setIsEditing(false);
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <button className="absolute right-2 bottom-2 rounded-full bg-blue-600 p-2 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg">
                        <Camera size={16} />
                    </button>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{profileData.name || 'User'}</h2>
                    <p className="flex items-center justify-center space-x-1 text-gray-600">
                        <Mail size={14} />
                        <span>{profileData.email}</span>
                    </p>
                    <div className="mt-2 flex items-center justify-center space-x-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                profileData.role === 'admin'
                                    ? 'border border-red-200 bg-red-100 text-red-800'
                                    : profileData.role === 'staff'
                                      ? 'border border-blue-200 bg-blue-100 text-blue-800'
                                      : 'border border-green-200 bg-green-100 text-green-800'
                            }`}
                        >
                            {profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'User'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Informasi Personal</h3>
                    <button
                        onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                        className="flex items-center space-x-2 rounded-md px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                        disabled={loading}
                    >
                        <Edit3 size={16} />
                        <span>{isEditing ? 'Batal' : 'Edit'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileData.name || ''}
                            onChange={(e) => handleProfileUpdate('name', e.target.value)}
                            disabled={!isEditing || loading}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="email"
                                value={profileData.email || ''}
                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                disabled={!isEditing || loading}
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            value={profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : ''}
                            disabled={true}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Role tidak dapat diubah dari halaman profil</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
                        <div className="relative">
                            <Calendar size={16} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                value={formatDate(profileData.updated_at)}
                                disabled={true}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pr-4 pl-12 text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
                        <button
                            onClick={handleCancel}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            <Save size={16} />
                            <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-gray-800">Pengaturan Umum</h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <div>
                            <h4 className="font-medium text-gray-800">Notifikasi Booking</h4>
                            <p className="text-sm text-gray-600">Terima notifikasi ketika ada booking baru</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={bookingNotifications}
                                onChange={(e) => setBookingNotifications(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <div>
                            <h4 className="font-medium text-gray-800">Mode Gelap</h4>
                            <p className="text-sm text-gray-600">Aktifkan tampilan mode gelap</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="peer sr-only" />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            {/* Change Password */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-gray-800">Ubah Password</h3>

                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password Saat Ini <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan password saat ini"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password Baru <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan password baru (minimal 8 karakter)"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Konfirmasi Password Baru <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Konfirmasi password baru"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePasswordUpdate}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    >
                        <Lock size={16} />
                        <span>{loading ? 'Memperbarui...' : 'Update Password'}</span>
                    </button>
                </div>
            </div>

            {/* Two Factor Authentication */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-gray-800">Autentikasi Dua Faktor</h3>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div>
                        <h4 className="font-medium text-gray-800">2FA</h4>
                        <p className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra untuk akun Anda</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={twoFactorAuth}
                            onChange={(e) => setTwoFactorAuth(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout title="Profile & Setting">
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <h1 className="text-3xl font-bold text-gray-900">Profil Admin</h1>
                            <p className="mt-1 text-gray-600">Kelola profil dan pengaturan akun Anda</p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-6 rounded-lg border bg-white p-4 shadow-sm">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all ${
                                                    activeTab === tab.id
                                                        ? 'border border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="font-medium">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'settings' && renderSettingsTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
