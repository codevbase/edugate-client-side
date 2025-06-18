import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaStar, FaUsers, FaClock } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://edugate-server-side.vercel.app';

// Default course image
const DEFAULT_COURSE_IMAGE = '/logo.png';

const Courses = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('addedAt_desc');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 20;

    // Categories for filtering
    const categories = [
        'all',
        'web development',
        'mobile development',
        'data science',
        'machine learning',
        'artificial intelligence',
        'cloud computing',
        'cybersecurity',
        'game development',
        'ui/ux design'
    ];

    useEffect(() => {
        fetchCourses();
    }, [sortBy, currentPage]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/courses?sort=${sortBy}&limit=${coursesPerPage}`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (course) => {
        if (!user) {
            toast.error('Please login to enroll in courses');
            return;
        }

        try {
            // Get Firebase token
            const token = await user.getIdToken();
            
            const enrollResponse = await axios.post(`${API_BASE_URL}/enrollments`, {
                courseId: course._id,
                courseName: course.title,
                price: course.price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (enrollResponse.data.success) {
                toast.success('Successfully enrolled in course!');
                // Refresh courses to update enrollment status
                fetchCourses();
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            toast.error('Failed to enroll in course');
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
            course.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Helmet>
                <title>Courses | EduGate</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover a wide range of courses taught by industry experts
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Filter and Sort Buttons */}
                        <div className="flex gap-4">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter className="mr-2" />
                                Filters
                            </button>
                            <select
                                className="select select-bordered"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="addedAt_desc">Newest First</option>
                                <option value="enrollments_desc">Most Popular</option>
                                <option value="rating_desc">Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-base-200 rounded-lg"
                        >
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`btn btn-sm ${
                                            selectedCategory === category
                                                ? 'btn-primary'
                                                : 'btn-ghost'
                                        }`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCourses.map(course => (
                                <motion.div
                                    key={course._id}
                                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <figure className="relative h-48 bg-gray-100">
                                        <img
                                            src={course.imageUrl || DEFAULT_COURSE_IMAGE}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = DEFAULT_COURSE_IMAGE;
                                            }}
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{course.title}</h2>
                                        <p className="text-gray-600 line-clamp-2">
                                            {course.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FaUsers />
                                                <span>{course.enrollments || 0} students</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-400" />
                                                <span>{course.rating || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaClock />
                                                <span>{course.duration || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions justify-end mt-4">
                                            <button
                                                onClick={() => handleEnroll(course)}
                                                className="btn btn-primary"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Course Count */}
                        {!loading && filteredCourses.length > 0 && (
                            <div className="text-center mt-8 text-gray-600">
                                Showing {filteredCourses.length} of {courses.length} courses
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && courses.length > coursesPerPage && (
                            <div className="flex justify-center mt-8 gap-2">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="btn btn-ghost">
                                    Page {currentPage}
                                </span>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={filteredCourses.length < coursesPerPage}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* No Results Message */}
                {!loading && filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Courses; 