import StaffLayout from '@/layouts/staff_layout';
import { usePage, router } from '@inertiajs/react';
import { Calendar, Edit3, Mail, Save, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminProfile() {
    interface AuthProps {
        user?: {
            id?: number;
            name?: string;
            email?: string;
            role?: string;
            updated_at?: string;
        };
    }

    const { auth } = usePage().props as { auth?: { user?: AuthProps['user'] } };
    const user = auth?.user;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        type: 'success' as 'success' | 'error' | 'warning',
        message: ''
    });

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
                setProfileData({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    updated_at: updatedUser.updated_at,
                });
                setOriginalProfileData({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    updated_at: updatedUser.updated_at,
                });
                
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
            showToast('error', 'Terjadi kesalahan saat menghubungi server: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData({ ...originalProfileData });
        setIsEditing(false);
    };

    return (
        <StaffLayout title="Profile">
            {/* Toast Notification - Positioned relative to AdminLayout content */}
            {toast.show && (
                <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 pointer-events-none">
                    <div className={`rounded-lg p-4 shadow-lg max-w-sm pointer-events-auto ${
                        toast.type === 'success' ? 'bg-green-50 border border-green-200' :
                        toast.type === 'error' ? 'bg-red-50 border border-red-200' :
                        'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    toast.type === 'success' ? 'bg-green-100' :
                                    toast.type === 'error' ? 'bg-red-100' :
                                    'bg-yellow-100'
                                }`}>
                                    {toast.type === 'success' && <span className="text-green-600 font-bold">✓</span>}
                                    {toast.type === 'error' && <span className="text-red-600 font-bold">✕</span>}
                                    {toast.type === 'warning' && <span className="text-yellow-600 font-bold">!</span>}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    toast.type === 'success' ? 'text-green-800' :
                                    toast.type === 'error' ? 'text-red-800' :
                                    'text-yellow-800'
                                }`}>
                                    {toast.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                <div className="min-h-screen bg-gray-50">
                    {/* Header */}
                    <div className="border-b bg-white shadow-sm">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="py-6 flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Profil Admin</h1>
                                    <p className="mt-1 text-gray-600">Kelola informasi profil Anda</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
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
                    </div>
                </div>
            </StaffLayout>
    );
}