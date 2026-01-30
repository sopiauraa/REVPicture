import { usePage, router, Link } from '@inertiajs/react';
import { Calendar, Edit3, Mail, Save, User, CheckCircle, XCircle, AlertCircle, ShoppingBag, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

interface AuthProps {
    user?: {
        id?: number;
        name?: string;
        email?: string;
        role?: string;
        updated_at?: string;
    };
}

interface ToastState {
    show: boolean;
    type: 'success' | 'error' | 'warning';
    message: string;
}

interface ProfileData {
    name: string;
    email: string;
    role: string;
    updated_at: string;
}

export default function AdminProfile() {
    const { auth } = usePage().props as { auth?: { user?: AuthProps['user'] } };
    const user = auth?.user;
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState<ToastState>({
        show: false,
        type: 'success',
        message: ''
    });

    // Profile data state
    const [profileData, setProfileData] = useState<ProfileData>({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        updated_at: user?.updated_at || '',
    });

    const [originalProfileData, setOriginalProfileData] = useState<ProfileData>({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        updated_at: user?.updated_at || '',
    });

    useEffect(() => {
        const userData = {
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || '',
            updated_at: user?.updated_at || '',
        };
        setProfileData(userData);
        setOriginalProfileData(userData);
    }, [user]);

    const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
        console.log('Showing toast:', type, message); // Debug log
        setToast({ show: true, type, message });
        
        // Clear any existing timeout
        setTimeout(() => {
            console.log('Hiding toast'); // Debug log
            setToast(prev => ({ ...prev, show: false }));
        }, 2000); // Changed to 2 seconds
    };

    // Test function to check if toast works
    const testToast = () => {
        showToast('success', 'Test toast notification!');
    };

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

    const handleProfileUpdate = (field: keyof ProfileData, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        // Validation
        if (!profileData.name || !profileData.name.trim()) {
            showToast('error', 'Nama tidak boleh kosong');
            setLoading(false);
            return;
        }
        if (!profileData.email || !profileData.email.trim()) {
            showToast('error', 'Email tidak boleh kosong');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            showToast('error', 'Format email tidak valid');
            setLoading(false);
            return;
        }

        try {
            // Send request to backend
            const response = await fetch('/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: profileData.name.trim(),
                    email: profileData.email.trim(),
                }),
            });

            // Debug log
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success response:', result);

            if (result.success) {
                // Update profile data with response from server
                const updatedUser = result.data.user;
                const updatedData = {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    updated_at: updatedUser.updated_at,
                };
                
                setProfileData(updatedData);
                setOriginalProfileData(updatedData);
                
                setIsEditing(false);
                showToast('success', 'Profil berhasil diperbarui!');
                
                // Optionally reload the page to refresh auth data
                // router.reload({ only: ['auth'] });
            } else {
                // Handle validation errors or other errors
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join('\n');
                    showToast('error', `Validasi gagal:\n${errorMessages}`);
                } else {
                    showToast('error', result.message || 'Terjadi kesalahan saat memperbarui profil');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('error', 'Terjadi kesalahan saat menghubungi server: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData({ ...originalProfileData });
        setIsEditing(false);
    };

    const getRoleDisplayName = (role: string) => {
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
    };

    const getRoleBadgeClasses = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
            case 'staff':
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
            default:
                return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
        }
    };

    const getToastIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-white" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-white" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-white" />;
            default:
                return <CheckCircle className="w-5 h-5 text-white" />;
        }
    };

    const getToastClasses = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-green-50/95 border-green-200 shadow-green-100',
                    icon: 'bg-green-500',
                    text: 'text-green-800'
                };
            case 'error':
                return {
                    container: 'bg-red-50/95 border-red-200 shadow-red-100',
                    icon: 'bg-red-500',
                    text: 'text-red-800'
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50/95 border-yellow-200 shadow-yellow-100',
                    icon: 'bg-yellow-500',
                    text: 'text-yellow-800'
                };
            default:
                return {
                    container: 'bg-green-50/95 border-green-200 shadow-green-100',
                    icon: 'bg-green-500',
                    text: 'text-green-800'
                };
        }
    };

    const getInputClasses = (isEditable: boolean) => {
        return `w-full rounded-xl border-2 px-4 py-3 text-slate-800 transition-all duration-200 focus:outline-none ${
            isEditable
                ? 'border-slate-300 bg-white focus:border-slate-600 focus:ring-4 focus:ring-slate-100 hover:border-slate-400'
                : 'border-slate-200 bg-slate-50 text-slate-600'
        }`;
    };

    const getInputWithIconClasses = (isEditable: boolean) => {
        return `w-full rounded-xl border-2 py-3 pr-4 pl-12 text-slate-800 transition-all duration-200 focus:outline-none ${
            isEditable
                ? 'border-slate-300 bg-white focus:border-slate-600 focus:ring-4 focus:ring-slate-100 hover:border-slate-400'
                : 'border-slate-200 bg-slate-50 text-slate-600'
        }`;
    };

    const handleOrderHistory = () => {
        router.visit('/order-history');
    };

    return (
        <div title="Profile">
            <Navbar 
                showSearch={false}
                showFilters={false}
                showCart={true}
            />
            
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 pointer-events-none">
                    <div className={`rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto backdrop-blur-sm border-2 transform transition-all duration-300 ${
                        getToastClasses(toast.type).container
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                                    getToastClasses(toast.type).icon
                                }`}>
                                    {getToastIcon(toast.type)}
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm font-semibold ${getToastClasses(toast.type).text}`}>
                                    {toast.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Avatar Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
                            <div className="flex flex-col items-center space-y-6">
                                <div className="relative">
                                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-4xl font-bold text-white shadow-2xl ring-4 ring-white">
                                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                        {profileData.name || 'User'}
                                    </h2>
                                    <div className="flex items-center justify-center space-x-2 text-slate-600 mb-4">
                                        <Mail size={16} className="text-slate-500" />
                                        <span className="text-lg">{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className={`rounded-full px-4 py-2 text-sm font-semibold shadow-md ${
                                            getRoleBadgeClasses(profileData.role)
                                        }`}>
                                            {getRoleDisplayName(profileData.role)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Aksi Cepat</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleOrderHistory}
                                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50 hover:from-slate-100 hover:to-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-slate-800">Riwayat Sewa</h4>
                                        <p className="text-sm text-slate-600">Lihat semua pesanan Anda</p>
                                    </div>
                                </button>
                                
                                <Link 
                                    href="/status-order"
                                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50 hover:from-slate-100 hover:to-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-slate-800">Status Sewa</h4>
                                        <p className="text-sm text-slate-600">Lihat Daftar Sewa</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Informasi Personal</h3>
                                        <p className="text-slate-600 text-sm mt-1">Kelola data pribadi Anda</p>
                                    </div>
                                    <button
                                        onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                                        className={`flex items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-md ${
                                            isEditing 
                                                ? 'bg-slate-500 text-white hover:bg-slate-600 hover:shadow-lg' 
                                                : 'bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                        disabled={loading}
                                    >
                                        <Edit3 size={16} />
                                        <span>{isEditing ? 'Batal' : 'Edit Profil'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name || ''}
                                            onChange={(e) => handleProfileUpdate('name', e.target.value)}
                                            disabled={!isEditing || loading}
                                            className={getInputClasses(isEditing && !loading)}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-slate-400" />
                                            <input
                                                type="email"
                                                value={profileData.email || ''}
                                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                                disabled={!isEditing || loading}
                                                className={getInputWithIconClasses(isEditing && !loading)}
                                                placeholder="user@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Role Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Role</label>
                                        <div className="relative">
                                            <User size={18} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-slate-400" />
                                            <input
                                                type="text"
                                                value={getRoleDisplayName(profileData.role)}
                                                disabled={true}
                                                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-slate-600"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Role tidak dapat diubah dari halaman profil</p>
                                    </div>

                                    {/* Last Updated Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Terakhir Diperbarui</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute top-1/2 left-4 -translate-y-1/2 transform text-slate-400" />
                                            <input
                                                type="text"
                                                value={formatDate(profileData.updated_at)}
                                                disabled={true}
                                                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="mt-10 flex justify-end space-x-4 pt-8 border-t border-slate-200">
                                        <button
                                            onClick={handleCancel}
                                            className="rounded-xl border-2 border-slate-300 px-6 py-3 text-slate-700 font-medium transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
                                            disabled={loading}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-3 text-white font-medium transition-all duration-200 hover:from-slate-900 hover:to-slate-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                            disabled={loading}
                                        >
                                            <Save size={18} />
                                            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}