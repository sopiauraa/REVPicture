import AdminLayout from '@/layouts/admin_layout';
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

const Dashboard = () => {
    const barRef = useRef<HTMLCanvasElement>(null);
    const doughnutRef = useRef<HTMLCanvasElement>(null);
    
    // Refs untuk menyimpan instance chart
    const barChartRef = useRef<Chart | null>(null);
    const doughnutChartRef = useRef<Chart | null>(null);

    const [monthlyData, setMonthlyData] = useState<{labels: string[]; data: number[]} | null>(null);
    const [brandData, setBrandData] = useState<{labels: string[]; data: number[]} | null>(null);
    const [stats, setStats] = useState<{
        total_products: number;
        active_rentals: number;
        active_customers: number;
    } | null>(null);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Panggil API dari Laravel untuk stats dashboard
        Promise.all([
            fetch('/dashboard-stats').then(res => res.json()),
            fetch('/recent-bookings').then(res => res.json())
        ])
        .then(([statsData, bookingsData]) => {
            setStats(statsData.stats);
            setMonthlyData(statsData.monthly);
            setBrandData(statsData.brands);
            setRecentBookings(bookingsData);
            setLoading(false);
        })
        .catch(err => {
            console.error('Gagal ambil data dashboard:', err);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!monthlyData || !brandData) return;

        const barCtx = barRef.current?.getContext('2d');
        const doughnutCtx = doughnutRef.current?.getContext('2d');

        // Hancurkan chart yang sudah ada sebelum membuat yang baru
        if (barChartRef.current) {
            barChartRef.current.destroy();
            barChartRef.current = null;
        }
        
        if (doughnutChartRef.current) {
            doughnutChartRef.current.destroy();
            doughnutChartRef.current = null;
        }

        if (barCtx) {
            barChartRef.current = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [
                        {
                            label: '2025',
                            data: monthlyData.data,
                            backgroundColor: '#4F46E5',
                            borderRadius: 8,
                            barThickness: 35,
                            hoverBackgroundColor: '#3730A3',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 1000, easing: 'easeOutQuart' },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: '#374151', font: { size: 11 } },
                            grid: { color: '#E5E7EB' },
                        },
                        x: {
                            ticks: { color: '#374151', font: { size: 11 }, maxRotation: 45 },
                            grid: { display: false },
                        },
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#1F2937',
                            titleFont: { size: 13, weight: 600 },
                            bodyFont: { size: 12 },
                            cornerRadius: 8,
                        },
                    },
                },
            });
        }

        if (doughnutCtx) {
            doughnutChartRef.current = new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: brandData.labels,
                    datasets: [
                        {
                            label: 'Berdasarkan Brand',
                            data: brandData.data,
                            backgroundColor: [
                                '#4F46E5',
                                '#7C3AED',
                                '#EC4899',
                                '#10B981',
                                '#F59E0B',
                                '#3B82F6'
                            ],
                            cutout: '60%',
                            hoverOffset: 18,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#374151', font: { size: 11 } },
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#1F2937',
                            titleFont: { size: 13, weight: 600 },
                            bodyFont: { size: 12 },
                            cornerRadius: 8,
                        },
                    },
                },
                plugins: [
                    {
                        id: 'doughnutlabel',
                        beforeDraw(chart) {
                            const { ctx } = chart;
                            ctx.save();
                            ctx.font = '600 12px Inter, sans-serif';
                            ctx.fillStyle = '#374151';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Berdasarkan Brand', chart.width / 2, chart.height / 2.5);
                            ctx.restore();
                        },
                    },
                ],
            });
        }

        // Cleanup function
        return () => {
            if (barChartRef.current) {
                barChartRef.current.destroy();
                barChartRef.current = null;
            }
            if (doughnutChartRef.current) {
                doughnutChartRef.current.destroy();
                doughnutChartRef.current = null;
            }
        };
    }, [monthlyData, brandData]);

    // Cleanup saat komponen unmount
    useEffect(() => {
        return () => {
            if (barChartRef.current) {
                barChartRef.current.destroy();
            }
            if (doughnutChartRef.current) {
                doughnutChartRef.current.destroy();
            }
        };
    }, []);

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            {/* Stat Cards with Real Data */}
            <section className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { 
                            title: 'Jumlah Barang', 
                            value: stats?.total_products || 0, 
                            icon: 'fa-box',
                            gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
                            iconBg: 'bg-blue-50',
                            iconColor: 'text-blue-600'
                        },
                        { 
                            title: 'Barang Sedang Disewa', 
                            value: stats?.active_rentals || 0, 
                            icon: 'fa-camera',
                            gradient: 'from-violet-500 via-purple-500 to-purple-600',
                            iconBg: 'bg-violet-50',
                            iconColor: 'text-violet-600'
                        },
                        { 
                            title: 'Penyewa Aktif', 
                            value: stats?.active_customers || 0, 
                            icon: 'fa-users',
                            gradient: 'from-pink-500 via-rose-500 to-pink-600',
                            iconBg: 'bg-pink-50',
                            iconColor: 'text-pink-600'
                        },
                    ].map((item, idx) => (
                        <div key={idx} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-5 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}>
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-black/5 blur-2xl"></div>
                            
                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-white/90 text-lg font-medium mb-4">
                                        {item.title}
                                    </div>
                                    
                                    <div className="text-white text-3xl font-bold tracking-tight">
                                        {item.value.toLocaleString()}
                                    </div>
                                </div>
                                
                                {/* Icon Container */}
                                <div className={`flex-shrink-0 ml-6 p-4 ${item.iconBg} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <i className={`fas ${item.icon} text-2xl ${item.iconColor}`}></i>
                                </div>
                            </div>
                            
                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Charts */}
            <section className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
                <div className="max-w-[720px] min-w-0 flex-1 rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Jumlah Penyewaan per Bulan</h2>
                            <p className="text-sm text-gray-600 mt-1">Tren penyewaan sepanjang tahun 2025</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">2025</span>
                        </div>
                    </div>
                    <div className="h-[320px]">
                        <canvas ref={barRef} />
                    </div>
                </div>

                <div className="w-full rounded-xl bg-white p-6 shadow-lg border border-gray-100 lg:w-96">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Statistik Penyewaan per Brand</h2>
                        <p className="text-sm text-gray-600 mt-1">Distribusi berdasarkan merek kamera</p>
                    </div>
                    <div className="h-[320px]">
                        <canvas ref={doughnutRef} />
                    </div>
                </div>
            </section>

            {/* Table with Real Data */}
            <section className="px-6 pb-12">
                <div className="overflow-x-auto rounded-xl bg-white shadow-lg border border-gray-100">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-violet-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Booking Terbaru</h3>
                                <p className="text-sm text-gray-600 mt-1">Kelola permintaan booking yang masuk</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">{recentBookings.length} menunggu persetujuan</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <table className="w-full border-separate border-spacing-y-3 text-[13px] text-gray-700">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-left">
                                    <th className="rounded-tl-lg px-4 py-4 font-semibold">Nama Customer</th>
                                    <th className="px-4 py-4 font-semibold">Kamera</th>
                                    <th className="px-4 py-4 font-semibold">Durasi</th>
                                    <th className="px-4 py-4 font-semibold">Tanggal Booking</th>
                                    <th className="rounded-tr-lg px-4 py-4 text-center font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px]">
                                {recentBookings.length > 0 ? recentBookings.map((booking, idx) => (
                                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gradient-to-r from-gray-50 to-indigo-50' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}>
                                        <td className="px-4 py-4 rounded-l-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                                                    {booking.customer_name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium">{booking.customer_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-indigo-600">{booking.product_name}</td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                                                {booking.duration === 'eight_hour' ? '8 jam' : '24 jam'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">
                                            {new Date(booking.order_date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-4 rounded-r-lg">
                                            <div className="flex justify-center gap-2">
                                                <button className="w-[80px] rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-2 text-center text-xs text-white font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                                    Terima
                                                </button>
                                                <button className="w-[80px] rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-3 py-2 text-center text-xs text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                                    Tolak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            Tidak ada booking yang menunggu persetujuan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default Dashboard;