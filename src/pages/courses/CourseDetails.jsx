import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaClock, FaUser, FaCalendar, FaBook, FaPlay, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Default course image
const DEFAULT_COURSE_IMAGE = '/logo.png';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [seatInfo, setSeatInfo] = useState(null);
    const [userEnrollments, setUserEnrollments] = useState([]);

    // Check if user is enrolled in this course and get their enrollments
    const checkEnrollment = async () => {
        if (user?.email) {
            try {
                const firebaseToken = await user.getIdToken();
                const [enrollmentResponse, userEnrollmentsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/enrollments/check`, {
                        params: {
                            userEmail: user.email,
                            courseId: courseId
                        },
                        headers: {
                            'Authorization': `Bearer ${firebaseToken}`
                        }
                    }),
                    axios.get(`${API_BASE_URL}/enrollments/user/${user.email}`, {
                        headers: {
                            'Authorization': `Bearer ${firebaseToken}`
                        }
                    })
                ]);
                setIsEnrolled(enrollmentResponse.data.isEnrolled);
                setUserEnrollments(userEnrollmentsResponse.data);
            } catch (err) {
                console.error('Error checking enrollment:', err);
                setIsEnrolled(false);
                setUserEnrollments([]);
            }
        }
    };

    useEffect(() => {
        checkEnrollment();
    }, [user, courseId]);

    // Fetch course details and seat information
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const [courseResponse, seatsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/courses/${courseId}`),
                    axios.get(`${API_BASE_URL}/enrollments/seats/${courseId}`)
                ]);
                setCourse(courseResponse.data);
                setSeatInfo(seatsResponse.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch course details. Please try again later.');
                console.error('Error fetching course details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleEnroll = async () => {
        if (!user) {
            toast.error('Please login to enroll in this course');
            navigate('/login');
            return;
        }

        if (seatInfo?.isFull) {
            toast.error('No seats available for this course');
            return;
        }

        // Check if user has reached the 3-course limit
        if (userEnrollments.length >= 3) {
            toast.error('You cannot enroll in more than 3 courses at the same time');
            return;
        }

        try {
            setEnrolling(true);
            
            // Get Firebase ID token
            const firebaseToken = await user.getIdToken();
            
            const response = await axios.post(`${API_BASE_URL}/enrollments`, {
                courseId: courseId,
                enrolledAt: new Date().toISOString()
            }, {
                headers: {
                    'Authorization': `Bearer ${firebaseToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setSeatInfo(prev => ({
                ...prev,
                availableSeats: response.data.availableSeats,
                isFull: response.data.availableSeats <= 0
            }));
            toast.success('Successfully enrolled in the course!');
            await checkEnrollment();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to enroll in the course. Please try again.');
            console.error('Error enrolling in course:', err);
        } finally {
            setEnrolling(false);
        }
    };

    const handleUnenroll = async () => {
        if (!user) {
            toast.error('Please login to unenroll from this course');
            return;
        }

        try {
            setEnrolling(true);
            
            // Get Firebase ID token
            const firebaseToken = await user.getIdToken();
            
            await axios.delete(`${API_BASE_URL}/enrollments`, {
                headers: {
                    'Authorization': `Bearer ${firebaseToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    courseId: courseId,
                    userEmail: user.email
                }
            });
            
            setSeatInfo(prev => ({
                ...prev,
                availableSeats: prev.availableSeats + 1,
                isFull: false
            }));
            toast.success('Successfully removed enrollment');
            await checkEnrollment();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to unenroll from the course. Please try again.');
            console.error('Error unenrolling from course:', err);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                <div className="text-center">
                    <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                <div className="text-center">
                    <FaTimesCircle className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
                    <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => navigate('/courses')} 
                        className="btn btn-primary"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{course.title} | EduGate</title>
                <meta name="description" content={course.description} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    <div 
                        className="max-w-6xl mx-auto"
                    >
                        {/* Back Button */}
                        <div className="mb-6">
                            <button
                                onClick={() => navigate('/courses')}
                                className="btn btn-outline btn-sm"
                            >
                                ← Back to Courses
                            </button>
                        </div>

                        {/* Course Header */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                            <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600">
                                <img 
                                    src={course.imageUrl || DEFAULT_COURSE_IMAGE} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover mix-blend-overlay"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_COURSE_IMAGE;
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                    <div className="flex justify-between items-end">
                                        <div className="flex-1">
                                            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                                            <p className="text-xl opacity-90 mb-4">{course.description}</p>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="text-blue-200" />
                                                    <span>{course.addedByName || 'Unknown Instructor'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaUsers className="text-blue-200" />
                                                    <span>{course.enrollments || 0} students enrolled</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaStar className="text-yellow-300" />
                                                    <span>{course.rating || 0} rating</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-4">
                                                <div className="text-2xl font-bold">{seatInfo?.availableSeats || 0}</div>
                                                <div className="text-sm opacity-90">seats available</div>
                                            </div>
                                            <button
                                                onClick={isEnrolled ? handleUnenroll : handleEnroll}
                                                disabled={enrolling || (userEnrollments.length >= 3 && !isEnrolled)}
                                                className={`btn btn-lg font-semibold transition-all duration-300 ${
                                                    userEnrollments.length >= 3 && !isEnrolled
                                                        ? 'btn-disabled bg-gray-400'
                                                        : isEnrolled
                                                        ? 'btn-error hover:bg-red-600'
                                                        : 'btn-primary hover:bg-blue-700'
                                                }`}
                                            >
                                                {enrolling ? (
                                                    <>
                                                        <span className="loading loading-spinner loading-sm"></span>
                                                        {isEnrolled ? 'Unenrolling...' : 'Enrolling...'}
                                                    </>
                                                ) : userEnrollments.length >= 3 && !isEnrolled ? (
                                                    'Enrollment Limit Reached'
                                                ) : isEnrolled ? (
                                                    <>
                                                        <FaCheckCircle className="mr-2" />
                                                        Enrolled (Click to Unenroll)
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPlay className="mr-2" />
                                                        Enroll Now
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Course Description */}
                                <div 
                                    className="bg-white rounded-2xl shadow-xl p-8"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <FaBook className="text-blue-600" />
                                        Course Description
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Course Features */}
                                <div 
                                    className="bg-white rounded-2xl shadow-xl p-8"
                                >
                                    <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">Comprehensive course content</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">Hands-on practical exercises</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">Expert instructor guidance</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">Certificate upon completion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Course Info Card */}
                                <div 
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                >
                                    <h3 className="text-xl font-bold mb-4">Course Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaClock className="text-blue-600" />
                                            <div>
                                                <div className="font-semibold">Duration</div>
                                                <div className="text-gray-600">{course.duration || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaUser className="text-blue-600" />
                                            <div>
                                                <div className="font-semibold">Instructor</div>
                                                <div className="text-gray-600">{course.addedByName || 'Unknown'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCalendar className="text-blue-600" />
                                            <div>
                                                <div className="font-semibold">Added</div>
                                                <div className="text-gray-600">
                                                    {new Date(course.addedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaUsers className="text-blue-600" />
                                            <div>
                                                <div className="font-semibold">Enrollments</div>
                                                <div className="text-gray-600">{course.enrollments || 0} students</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enrollment Status */}
                                <div 
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                >
                                    <h3 className="text-xl font-bold mb-4">Your Enrollment</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${isEnrolled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className={isEnrolled ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                                {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            You have enrolled in {userEnrollments.length} out of 3 courses
                                        </div>
                                        {userEnrollments.length >= 3 && !isEnrolled && (
                                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                                You've reached the maximum enrollment limit. Please unenroll from another course first.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetails;