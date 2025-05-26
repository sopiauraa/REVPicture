import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AdminLayout from '@/layouts/admin_layout';
import { usePage } from '@inertiajs/react';

const Dashboard = () => {
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const barCtx = barRef.current?.getContext('2d');
    const doughnutCtx = doughnutRef.current?.getContext('2d');

    if (barCtx) {
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
          datasets: [
            {
              label: '2025',
              data: [90, 80, 50, 70, 40, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: '#2F80ED',
              borderRadius: 6,
              barThickness: 35,
              hoverBackgroundColor: '#0F63D4'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000, easing: 'easeOutQuart' },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { stepSize: 20, color: '#1a1a1a', font: { size: 10 } },
              grid: { color: '#e5e7eb', borderColor: '#F2F2F2' }
            },
            x: {
              ticks: { color: '#1a1a1a', font: { size: 10 }, maxRotation: 45 },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: '#7a7a7a',
              titleFont: { size: 13, weight: 600 },
              bodyFont: { size: 12 }
            }
          }
        }
      });
    }

    if (doughnutCtx) {
      new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Sonny', 'Fujifilm', 'Canon', 'Nikon', 'Oji Osmo Pocket 3', 'Lumix'],
          datasets: [
            {
              label: 'Berdasarkan Brand',
              data: [20, 10, 20, 15, 15, 20],
              backgroundColor: ['#f9d56e', '#3fcf97', '#f87171', '#7f8ea3', '#3bb9f9', '#b78aff'],
              cutout: '60%',
              hoverOffset: 18
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#1a1a1a', font: { size: 11 } }
            },
            tooltip: {
              enabled: true,
              backgroundColor: '#7a7a7a',
              titleFont: { size: 13, weight: 600 },
              bodyFont: { size: 12 }
            }
          }
        },
        plugins: [{
          id: 'doughnutlabel',
          beforeDraw(chart) {
            const { ctx, chartArea: { width, height } } = chart;
            ctx.save();
            ctx.font = '600 12px Inter, sans-serif';
            ctx.fillStyle = '#1a1a1a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Berdasarkan Brand', chart.width / 2, chart.height / 2.5);
            ctx.restore();
          }
        }]
      });
    }
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
     <section className="overflow-x-auto px-6 py-6 bg-[#F2F2F2]">
        <div className="flex flex-row gap-6 min-w-max">
          {[
            { title: "Jumlah Barang", value: 120, icon: "fa-box" },
            { title: "Booking hari ini", value: 4, icon: "fa-calendar-check" },
            { title: "Jumlah Staff", value: 7, icon: "fa-user-tie" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#7a7a7a] rounded-md flex items-center justify-between px-4 py-3 w-64 flex-shrink-0"
            >
              <div className="text-white text-[13px]">
                <div>{item.title}</div>
                <div className="font-semibold text-xl mt-1">{item.value}</div>
              </div>
              <div
                className="bg-white rounded p-2 flex items-center justify-center text-[#0F63D4]"
                style={{ width: 36, height: 36 }}
              >
                <i className={`fas ${item.icon} text-[18px]`}></i>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Charts */}
      <section className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
        <div className="bg-white rounded-md shadow-md p-5 flex-1 min-w-0 max-w-[720px]">
          <h2 className="font-semibold text-[14px] mb-4 text-[#1f1e29]">Jumlah Penyewaan per Bulan</h2>
          <div className="h-[320px]">
            <canvas ref={barRef} />
            <p className='font-semibold text-[14px] mb-2 text-[#1f1e29] text-center'>2025</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-md p-5 w-full lg:w-96">
          <h2 className="font-semibold text-[14px] mb-10 text-[#1f1e29]">Statistik Penyewaan per Brand</h2>
          <div className="h-[320px]">
            <canvas ref={doughnutRef} />
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="px-6 pb-12">
        <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
          <h3 className="font-semibold text-[14px] mb-4">Booking Terbaru</h3>
          <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#d3d3d3] text-left">
                <th className="py-3 px-4 rounded-tl-md">Nama Customer</th>
                <th className="py-3 px-4">Kamera</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Tanggal Booking</th>
                <th className="py-3 px-4 rounded-tr-md text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {[...Array(4)].map((_, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"} rounded-md`}>
                  <td className="py-3 px-4">Bima Arya</td>
                  <td className="py-3 px-4 font-semibold">Canon M50</td>
                  <td className="py-3 px-4">24 jam</td>
                  <td className="py-3 px-4">25 Mei 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button className="w-[80px] bg-[#0F63D4] hover:bg-[#0c54b3] text-white py-1 px-3 text-xs rounded text-center">
                        Terima
                      </button>
                      <button className="w-[80px] bg-[#EF4444] hover:bg-[#dc2626] text-white py-1 px-3 text-xs rounded text-center">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </AdminLayout>
  );
};

export default Dashboard;
