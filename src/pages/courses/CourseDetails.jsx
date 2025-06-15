import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
    const isCourseCreator = user?.email === course?.addedByEmail;

    // Check if user is enrolled in this course and get their enrollments
    useEffect(() => {
        const checkEnrollment = async () => {
            if (user?.email) {
                try {
                    const [enrollmentResponse, userEnrollmentsResponse] = await Promise.all([
                        axios.get(`${API_BASE_URL}/enrollments/check`, {
                            params: {
                                userEmail: user.email,
                                courseId: courseId
                            }
                        }),
                        axios.get(`${API_BASE_URL}/enrollments/user/${user.email}`)
                    ]);
                    setIsEnrolled(enrollmentResponse.data.isEnrolled);
                    setUserEnrollments(userEnrollmentsResponse.data);
                } catch (err) {
                    console.error('Error checking enrollment:', err);
                }
            }
        };

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
            const response = await axios.post(`${API_BASE_URL}/enrollments`, {
                userEmail: user.email,
                courseId: courseId,
                enrolledAt: new Date().toISOString()
            });
            setIsEnrolled(true);
            setSeatInfo(prev => ({
                ...prev,
                availableSeats: response.data.availableSeats,
                isFull: response.data.availableSeats <= 0
            }));
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to enroll in the course. Please try again.');
            console.error('Error enrolling in course:', err);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-8">
                <p>Course not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <div className="flex gap-3">
                            {isCourseCreator && (
                                <button
                                    onClick={() => navigate(`/edit-course/${courseId}`)}
                                    className="px-6 py-2 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-all"
                                >
                                    Edit Course
                                </button>
                            )}
                            {!isEnrolled && !seatInfo?.isFull && (
                                <button
                                    onClick={handleEnroll}
                                    disabled={!user || enrolling || userEnrollments.length >= 3}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                        !user || userEnrollments.length >= 3
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {!user
                                        ? 'Login to Enroll'
                                        : userEnrollments.length >= 3
                                        ? 'Enrollment Limit Reached'
                                        : enrolling
                                        ? 'Enrolling...'
                                        : `Enroll Now (${seatInfo?.availableSeats} seats left)`}
                                </button>
                            )}
                            {isEnrolled && (
                                <button
                                    onClick={() => navigate('/my-courses')}
                                    className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all"
                                >
                                    Enrolled
                                </button>
                            )}
                            {!isEnrolled && seatInfo?.isFull && (
                                <div className="px-6 py-2 rounded-lg font-semibold bg-red-500 text-white">
                                    No Seats Left
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <img 
                            src={course.imageUrl} 
                            alt={course.title} 
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
                            <p className="text-gray-600">{course.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700">Duration</h3>
                                <p className="text-gray-600">{course.duration}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700">Instructor</h3>
                                <p className="text-gray-600">{course.addedByName || 'Unknown'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700">Available Seats</h3>
                                <p className="text-gray-600">
                                    {seatInfo?.availableSeats} of {seatInfo?.totalSeats} seats left
                                </p>
                            </div>
                        </div>

                        {!user && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-700">
                                    Please login to enroll in this course and start learning!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;