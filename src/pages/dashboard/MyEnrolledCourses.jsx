import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyEnrolledCourses = () => {
    const { user } = useContext(AuthContext);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                // Get the Firebase token
                const token = await user.getIdToken();
                
                
                const response = await axios.get(`http://localhost:3000/enrollments/my-courses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEnrolledCourses(response.data);
            } catch (error) {
                console.error('Error fetching enrolled courses:', error);
                toast.error('Failed to load enrolled courses');
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchEnrolledCourses();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleRemoveEnrollment = async (courseId) => {
        try {
            // Get the Firebase token
            const token = await user.getIdToken();
            
            await axios.delete(`http://localhost:3000/enrollments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    userEmail: user.email,
                    courseId: courseId
                },
            });
            
            // Update the local state to remove the course
            setEnrolledCourses(prevCourses => 
                prevCourses.filter(course => course.courseId !== courseId)
            );
            
            toast.success('Successfully removed from enrolled courses');
        } catch (error) {
            console.error('Error removing enrollment:', error);
            toast.error('Failed to remove enrollment');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">My Enrolled Courses</h2>
            
            {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 border-b text-left">Title</th>
                                <th className="px-6 py-3 border-b text-left">Description</th>
                                <th className="px-6 py-3 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledCourses.map((enrollment) => (
                                <tr key={enrollment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b">
                                        {enrollment.courseDetails?.title || 'Course Title Not Available'}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        {enrollment.courseDetails?.description || 'No description available'}
                                    </td>
                                    <td className="px-6 py-4 border-b text-center">
                                        <button
                                            onClick={() => handleRemoveEnrollment(enrollment.courseId)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
                                        >
                                            Remove Enrollment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyEnrolledCourses; 