import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        resumeUrl: '',
        coverLetter: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/jobs`);
            setJobs(response.data);
        } catch (error) {
            setError('Failed to fetch jobs. Please try again later.');
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplyModal(true);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }

            const applicationData = {
                userEmail: user.email,
                userName: user.name,
                ...applicationForm
            };

            await axios.post(`${API_BASE_URL}/jobs/${selectedJob._id}/apply`, applicationData);
            setShowApplyModal(false);
            setApplicationForm({ resumeUrl: '', coverLetter: '' });
            // Show success message or notification
        } catch (error) {
            console.error('Error submitting application:', error);
            // Show error message
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Helmet>
                <title>Jobs | EduGate</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore exciting career opportunities in tech and education
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <motion.div
                                key={job._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FaBriefcase className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{job.title}</h3>
                                            <p className="text-gray-600">{job.company}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaMapMarkerAlt />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaMoneyBillWave />
                                            <span>{job.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaClock />
                                            <span>{job.type}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            Posted {formatDate(job.postedAt)}
                                        </span>
                                        <button
                                            onClick={() => handleApply(job)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {showApplyModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-white rounded-xl p-6 max-w-lg w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">Apply for {selectedJob.title}</h3>
                        <form onSubmit={handleApplicationSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Resume URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    className="input input-bordered w-full"
                                    placeholder="https://example.com/resume.pdf"
                                    value={applicationForm.resumeUrl}
                                    onChange={(e) => setApplicationForm(prev => ({
                                        ...prev,
                                        resumeUrl: e.target.value
                                    }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Letter
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32"
                                    placeholder="Tell us why you're a great fit for this position..."
                                    value={applicationForm.coverLetter}
                                    onChange={(e) => setApplicationForm(prev => ({
                                        ...prev,
                                        coverLetter: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setShowApplyModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default Jobs; 