/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
    LineElement,
    PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Users,
    Clock,
    IndianRupee,
    MapPin,
    ChevronUp,
    Calendar,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { CaptainDataContext } from "../../context/CapatainContext";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    Title,
    Tooltip,
    LineElement,
    PointElement
);

function CaptainDashboard() {
    const [canceledRides, setCanceledRides] = useState(0);
    const [completedRides, setCompletedRides] = useState(0);
    const [rideDetails, setRideDetails] = useState([]);

    const captainData = useContext(CaptainDataContext);
    
    useEffect(() => {
        if (captainData) {
            gettingDashboardData();
        }
    }, [captainData]);

    const gettingDashboardData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/dashboard`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 200) {
                toast.success('Dashboard data fetched successfully');
                setCanceledRides(response.data.cancelledRides);
                setCompletedRides(response.data.completedRides);
                setRideDetails(response.data.rideDetails);
                console.log('dashboard', response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', error);
        }
    };

    // Process ride details for earnings and rides data
    const processRideData = () => {
        // Group rides by month
        const monthlyEarnings = new Array(12).fill(0);

        rideDetails.forEach(ride => {
            const date = new Date(ride.date);
            const monthIndex = date.getMonth();
            monthlyEarnings[monthIndex] += parseFloat(ride.price);
        });

        // Process weekly rides (using most recent week's data)
        const weeklyRides = new Array(7).fill(0);
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        rideDetails.forEach(ride => {
            const rideDate = new Date(ride.date);
            if (rideDate >= oneWeekAgo && rideDate <= today) {
                const dayIndex = rideDate.getDay();
                weeklyRides[dayIndex]++;
            }
        });

        return { monthlyEarnings, weeklyRides };
    };

    const { monthlyEarnings, weeklyRides } = processRideData();

    // Dashboard Data
    const totalRides = completedRides + canceledRides;
    const totalEarnings = captainData.captain?.TotalEarnings;
    const totalDistance = captainData.captain?.distanceTravelled;
    const totalTime = ((captainData.captain?.minutesWorked ?? 0) / 60).toFixed(2);

    // Growth metrics
    const earningsGrowth = 8.5;
    const ridesGrowth = 12.3;
    const distanceGrowth = 5.2;
    const timeGrowth = -2.1;
    const cancellationRate = (canceledRides / totalRides) * 100;

    const recentRides = rideDetails.slice(0, 5).map((ride, index) => ({
        id: index + 1,
        pickup: ride.origin,
        drop: ride.destination,
        fare: ride.price,
        status: ride.status,
        date: new Date(ride.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    }));

    const monthlyEarningsData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Earnings (₹)",
                data: monthlyEarnings,
                backgroundColor: "rgba(79, 70, 229, 0.6)",
                borderColor: "rgb(79, 70, 229)",
                borderWidth: 2,
            },
        ],
    };

    const weeklyRidesData = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
            {
                label: "Rides",
                data: weeklyRides,
                borderColor: "rgb(234, 88, 12)",
                backgroundColor: "rgba(234, 88, 12, 0.1)",
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "rgb(234, 88, 12)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const rideStatsData = {
        labels: ["Completed Rides", "Cancelled Rides"],
        datasets: [
            {
                label: "Ride Stats",
                data: [totalRides - canceledRides, canceledRides],
                backgroundColor: ["#8B5CF6", "#F97316"],
                borderColor: ["#7C3AED", "#EA580C"],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">
                        Captain Dashboard
                    </h1>

                    <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                        <Calendar className="text-indigo-600 mr-2 h-5 w-5" />
                        <span className="text-gray-700 text-sm font-medium">{captainData.captain?.captain?.createdAt.slice(0, 4)}</span>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard
                        title="Total Rides"
                        value={totalRides}
                        icon={<Users className="text-indigo-500 h-6 w-6" />}
                        change={ridesGrowth}
                        bgGradient="from-indigo-50 to-indigo-100"
                        borderColor="border-indigo-200"
                        textColor="text-indigo-600"
                    />
                    <StatCard
                        title="Total Earnings"
                        value={`₹${totalEarnings?.toLocaleString()}`}
                        icon={<IndianRupee className="text-green-500 h-6 w-6" />}
                        change={earningsGrowth}
                        bgGradient="from-green-50 to-green-100"
                        borderColor="border-green-200"
                        textColor="text-green-600"
                    />
                    <StatCard
                        title="Total Distance"
                        value={`${totalDistance?.toLocaleString()} km`}
                        icon={<MapPin className="text-blue-500 h-6 w-6" />}
                        change={distanceGrowth}
                        bgGradient="from-blue-50 to-blue-100"
                        borderColor="border-blue-200"
                        textColor="text-blue-600"
                    />
                    <StatCard
                        title="Total Time"
                        value={`${totalTime} hrs`}
                        icon={<Clock className="text-purple-500 h-6 w-6" />}
                        change={timeGrowth}
                        bgGradient="from-purple-50 to-purple-100"
                        borderColor="border-purple-200"
                        textColor="text-purple-600"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Earnings Chart */}
                    <ChartCard title="Monthly Earnings" subtitle="Last 12 months revenue">
                        <Bar
                            data={monthlyEarningsData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        titleColor: '#1F2937',
                                        bodyColor: '#4B5563',
                                        borderColor: 'rgba(209, 213, 219, 0.5)',
                                        borderWidth: 1,
                                        padding: 12,
                                        cornerRadius: 6,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }
                                },
                                scales: {
                                    y: {
                                        grid: {
                                            color: 'rgba(209, 213, 219, 0.3)',
                                        },
                                        ticks: {
                                            color: '#6B7280',
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            color: '#6B7280',
                                        }
                                    }
                                }
                            }}
                        />
                    </ChartCard>

                    {/* Weekly Rides Chart */}
                    <ChartCard title="Weekly Rides" subtitle="Current week performance">
                        <Line
                            data={weeklyRidesData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        titleColor: '#1F2937',
                                        bodyColor: '#4B5563',
                                        borderColor: 'rgba(209, 213, 219, 0.5)',
                                        borderWidth: 1,
                                        padding: 12,
                                        cornerRadius: 6,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }
                                },
                                scales: {
                                    y: {
                                        grid: {
                                            color: 'rgba(209, 213, 219, 0.3)',
                                        },
                                        ticks: {
                                            color: '#6B7280',
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            color: '#6B7280',
                                        }
                                    }
                                }
                            }}
                        />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Ride Status Pie Chart */}
                    <ChartCard title="Ride Status" subtitle="Completion rate analysis" className="min-h-[450px]">
                        <div className="flex justify-center items-center h-full">
                            <div className="h-80 w-80 mt-20 max-sm:min-h-60 max-sm:min-w-60 max-sm:mt-10">
                                <Pie
                                    data={rideStatsData}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    color: '#6B7280',
                                                    padding: 20,
                                                    usePointStyle: true,
                                                    pointStyle: 'rect',
                                                    boxWidth: 20,
                                                    boxHeight: 10
                                                }
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                titleColor: '#1F2937',
                                                bodyColor: '#4B5563',
                                                borderColor: 'rgba(209, 213, 219, 0.5)',
                                                borderWidth: 1,
                                                padding: 12,
                                                cornerRadius: 6,
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </ChartCard>

                    {/* Recent Rides Table (spans 2 columns) */}
                    <div className="bg-white rounded-xl shadow-md lg:col-span-2 border border-gray-200 min-h-[450px] flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Recent Rides</h2>
                                <p className="text-gray-500 text-sm mt-1">Latest trip details</p>
                            </div>
                            <button className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors font-medium flex items-center">
                                View All
                                <ChevronUp className="h-4 w-4 ml-1 rotate-90" />
                            </button>
                        </div>
                        <div className="overflow-x-auto flex-grow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentRides.map((ride) => (
                                        <tr key={ride.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{ride.date}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{ride.pickup}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{ride.drop}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-800">{ride.fare}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    ride.status === "completed"
                                                        ? "bg-green-100 text-green-800 border border-green-200"
                                                        : "bg-red-100 text-red-800 border border-red-200"
                                                }`}>
                                                    {ride.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Alert Section */}
                <div className="bg-amber-50 rounded-xl shadow-md border border-amber-200 p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Attention needed</h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <p>
                                    Your cancellation rate has increased by {cancellationRate.toFixed(2)}% compared to last month. High cancellation rates may affect your performance score.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, change, bgGradient, borderColor, textColor }) {
    const isPositive = change >= 0;

    return (
        <div className={`bg-white rounded-xl shadow-md p-6 border ${borderColor} relative overflow-hidden`}>
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`}></div>

            <div className="relative">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
                </div>

                <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{value}</h3>

                <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="flex items-center">
                        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 rotate-180" />}
                        {isPositive ? "+" : ""}{change}%
                    </span>
                    <span className="text-gray-500 ml-1 text-xs">vs prev. month</span>
                </div>
            </div>
        </div>
    );
}

function ChartCard({ title, subtitle, children, className }) {
    return (
        <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className || ""}`}>
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
            <div className="p-6 h-64">{children}</div>
        </div>
    );
}

export default CaptainDashboard;