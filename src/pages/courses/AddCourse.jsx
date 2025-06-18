import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const AddCourse = () => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.title || !form.description || !form.imageUrl || !form.duration) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            // Get Firebase token
            const token = await user.getIdToken();
            
            await axios.post(`${API_BASE_URL}/courses`, form, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccess('Course added successfully!');
            toast.success('Course added successfully!');
            setForm({ title: '', description: '', imageUrl: '', duration: '' });
        } catch (error) {
            console.error('Error adding course:', error);
            setError('Failed to add course.');
            toast.error('Failed to add course.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Add Course | EduGate</title>
            </Helmet>
            <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Add a New Course</h2>
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
                    {/* Additional fields can be added here */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Course'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddCourse;
