import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const ManageCourses = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                // Get Firebase token
                const token = await user.getIdToken();
                
                const response = await axios.get(`http://localhost:3000/courses/my-courses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Failed to fetch your courses');
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchMyCourses();
        }
    }, [user]);

    const handleEdit = (courseId) => {
        navigate(`/edit-course/${courseId}`);
    };

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // Get Firebase token
            const token = await user.getIdToken();
            
            await axios.delete(`http://localhost:3000/courses/${courseToDelete._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCourses(courses.filter(course => course._id !== courseToDelete._id));
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        } finally {
            setDeleteModalOpen(false);
            setCourseToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Manage Courses | EduGate</title>
            </Helmet>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Manage Your Courses</h2>
                    
                    {courses.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">You haven't added any courses yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course._id}>
                                            <td className="font-medium">{course.title}</td>
                                            <td className="max-w-md truncate">{course.description}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(course._id)}
                                                        className="btn btn-sm btn-warning btn-outline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(course)}
                                                        className="btn btn-sm btn-error btn-outline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">
                            Are you sure you want to delete the course "{courseToDelete?.title}"? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setCourseToDelete(null);
                                }}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-error"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageCourses;
