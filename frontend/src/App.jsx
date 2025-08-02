import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// --- Firebase Configuration ---
// IMPORTANT: Replace with your project's Firebase configuration object.
const firebaseConfig = {
  apiKey: "AIzaSyBreI53BYFeccngChdfIsIVWEMdTQIbXDo",
  authDomain: "insights-467407.firebaseapp.com",
  projectId: "insights-467407",
  storageBucket: "insights-467407.firebasestorage.app",
  messagingSenderId: "526865014796",
  appId: "1:526865014796:web:b33c77b6f0debb659c8e29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Helper Components ---

const StatCard = ({ title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

const LogLevelLabel = ({ level }) => {
    const levelStyles = {
        'ERROR': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'WARN': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'INFO': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'UNKNOWN': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelStyles[level] || levelStyles['UNKNOWN']}`}>
            {level}
        </span>
    );
};

// --- Main App Component ---

function App() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ errorCount: 0, warnCount: 0, infoCount: 0, total: 0 });
    const [errorsLastHour, setErrorsLastHour] = useState({});

    useEffect(() => {
        const q = query(collection(db, 'processed-logs'), orderBy('timestamp', 'desc'), limit(100));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const logsData = [];
            const newStats = { errorCount: 0, warnCount: 0, infoCount: 0, total: 0 };
            const newErrorsLastHour = {};
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            querySnapshot.forEach((doc) => {
                const log = { id: doc.id, ...doc.data() };
                logsData.push(log);
                
                newStats.total++;
                if (log.level === 'ERROR') newStats.errorCount++;
                else if (log.level === 'WARN') newStats.warnCount++;
                else if (log.level === 'INFO') newStats.infoCount++;
                
                const logDate = new Date(log.timestamp);
                if (log.level === 'ERROR' && logDate > oneHourAgo) {
                    const minute = logDate.getMinutes();
                    newErrorsLastHour[minute] = (newErrorsLastHour[minute] || 0) + 1;
                }
            });

            setLogs(logsData);
            setStats(newStats);
            setErrorsLastHour(newErrorsLastHour);
        });

        return () => unsubscribe();
    }, []);

    const pieData = {
        labels: ['Errors', 'Warnings', 'Info'],
        datasets: [{
            data: [stats.errorCount, stats.warnCount, stats.infoCount],
            backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6'],
            borderColor: ['#1f2937'],
            borderWidth: 2,
        }],
    };
    
    const barData = {
      labels: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
      datasets: [{
          label: 'Errors per Minute',
          data: Array.from({ length: 60 }, (_, i) => errorsLastHour[i] || 0),
          backgroundColor: '#EF4444',
          borderRadius: 4,
      }],
  };


    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Insight Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Real-time log analytics platform.</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard title="Total Errors" value={stats.errorCount} color="text-red-500" />
                    <StatCard title="Total Warnings" value={stats.warnCount} color="text-yellow-500" />
                    <StatCard title="Logs Processed (Last 100)" value={stats.total} color="text-blue-500" />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
                    <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: {color: '#9ca3af'} }}}} />
                </div>
                
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Error Rate (Last Hour by Minute)</h2>
                    <div className="h-64">
                      <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { ticks: { color: '#9ca3af' }}, x: { ticks: { color: '#9ca3af' }} } }} />
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Live Log Stream</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Timestamp</th>
                                    <th scope="col" className="px-6 py-3">Level</th>
                                    <th scope="col" className="px-6 py-3">Message</th>
                                    <th scope="col" className="px-6 py-3">Service</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4"><LogLevelLabel level={log.level} /></td>
                                        <td className="px-6 py-4">{log.message}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{log.service}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;