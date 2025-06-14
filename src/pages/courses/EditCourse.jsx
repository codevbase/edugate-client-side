import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router';

const EditCourse = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/courses/${id}`);
                const courseData = response.data;
                setForm({
                    title: courseData.title || '',
                    description: courseData.description || '',
                    imageUrl: courseData.imageUrl || '',
                    duration: courseData.duration || '',
                });
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch course data');
                navigate('/courses');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchCourse();
    }, [id, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title || !form.description || !form.imageUrl || !form.duration) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            const courseData = {
                ...form,
                updatedByEmail: user?.email || '',
                updatedByName: user?.displayName || user?.email || 'Unknown',
                updatedAt: new Date().toISOString(),
            };
            await axios.put(`http://localhost:3000/courses/${id}`, courseData);
            toast.success('Course updated successfully!');
            navigate(`/courses/${id}`);
        } catch {
            setError('Failed to update course.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Edit Course | EduGate</title>
            </Helmet>
            <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Edit Course</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-semibold mb-1">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input input-bordered w-full"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Short Description</label>
                        <textarea
                            name="description"
                            className="input input-bordered w-full min-h-[80px]"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            className="input input-bordered w-full"
                            value={form.imageUrl}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Duration (e.g. 6 weeks, 10 hours)</label>
                        <input
                            type="text"
                            name="duration"
                            className="input input-bordered w-full"
                            value={form.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="btn btn-outline flex-1"
                            onClick={() => navigate(`/courses/${id}`)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Course'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCourse; 