import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axiosInstance.get('/users/reports/');
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            if (error.response && error.response.status === 403) {
                toast.error("Access denied. Admins only.");
                navigate('/');
            } else {
                toast.error("Failed to load reports.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await axiosInstance.delete(`/users/reports/${id}/`);
                setReports(reports.filter(report => report.id !== id));
                toast.success("Report deleted successfully.");
            } catch (error) {
                console.error("Error deleting report:", error);
                toast.error("Failed to delete report.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Issue Reports</h1>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    {reports.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            No reports found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <th className="p-4 font-semibold">Subject</th>
                                        <th className="p-4 font-semibold">Reporter</th>
                                        <th className="p-4 font-semibold">Description</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">User Agent</th>
                                        <th className="p-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 align-top">
                                                <span className="font-medium text-gray-900 dark:text-white block mb-1">
                                                    {report.subject}
                                                </span>
                                            </td>
                                            <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300">
                                                <a href={`mailto:${report.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                    {report.email}
                                                </a>
                                            </td>
                                            <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300 max-w-md">
                                                <div className="whitespace-pre-wrap">{report.description}</div>
                                            </td>
                                            <td className="p-4 align-top text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {new Date(report.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4 align-top text-xs text-gray-400 dark:text-gray-500 max-w-xs truncate" title={report.user_agent}>
                                                {report.user_agent}
                                            </td>
                                            <td className="p-4 align-top text-xs">
                                                <button
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
