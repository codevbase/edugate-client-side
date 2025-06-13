import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const CourseDetails = () => {
    const { courseId } = useParams();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    // Check if user is enrolled in this course
    useEffect(() => {
        const checkEnrollment = async () => {
            if (user?.email) {
                try {
                    const response = await axios.get(`http://localhost:3000/enrollments/check`, {
                        params: {
                            userEmail: user.email,
                            courseId: courseId
                        }
                    });
                    setIsEnrolled(response.data.isEnrolled);
                } catch (err) {
                    console.error('Error checking enrollment:', err);
                }
            }
        };

        checkEnrollment();
    }, [user, courseId]);

    // Fetch course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
                setCourse(response.data);
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

        try {
            setEnrolling(true);
            await axios.post('http://localhost:3000/enrollments', {
                userEmail: user.email,
                courseId: courseId,
                enrolledAt: new Date().toISOString()
            });
            setIsEnrolled(true);
            toast.success('Successfully enrolled in the course!');
        } catch (err) {
            toast.error('Failed to enroll in the course. Please try again.');
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
                        <button
                            onClick={handleEnroll}
                            disabled={!user || isEnrolled || enrolling}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                !user
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : isEnrolled
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {!user
                                ? 'Login to Enroll'
                                : isEnrolled
                                ? 'Enrolled'
                                : enrolling
                                ? 'Enrolling...'
                                : 'Enroll Now'}
                        </button>
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