import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import { auth } from '../../config/firebase';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
    const { createUser, setUser, signInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [passwordError, setPasswordError] = useState(''); // State for password error
    const [loading, setLoading] = useState(false); // State for loading

    const handleRegister = async e => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const photoUrl = form.photourl.value;

        // Password validation
        if (!/[A-Z]/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter.');
            return;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }
        setPasswordError('');

        try {
            setLoading(true);
            const result = await createUser(email, password);
            const user = result.user;
            await updateProfile(user, {
                displayName: name,
                photoURL: photoUrl,
            });
            await auth.currentUser.reload();
            setUser(auth.currentUser); // Update context with latest user info
            // No need to call sendUserToDB here, handled globally in AuthProvider
            form.reset();
            navigate(location?.state?.from?.pathname || '/');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'User created successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setPasswordError('');
        try {
            setLoading(true);
            await signInWithGoogle();
            // No need to call sendUserToDB here, handled globally in AuthProvider
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Signed up with Google',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location?.state?.from?.pathname || '/');
        } catch (error) {
            setPasswordError('Google signup failed');
            console.error('Google signup failed:', error); // Add this for debugging
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl my-5 pb-10">
            <h1 className="text-3xl text-center font-bold">Register now!</h1>
            <div className="card-body">
                <form onSubmit={handleRegister} className="fieldset">
                    <label className="label">Name</label>
                    <input type="text" name="name" className="input" placeholder="Name" required />
                    <label className="label">Email</label>
                    <input type="email" name="email" className="input" placeholder="Email" required />
                    <label className="label">Password</label>
                    <input type="password" name="password" className="input" placeholder="Password" required />
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}                   
                    <label className="label">Photo-url</label>
                    <input type="text" name="photourl" className="input" placeholder="photourl" />
                    
                    <button className="btn btn-neutral mt-4">Register</button>
                </form>
                <div className="flex flex-col gap-2 mt-4">
                    <button type="button" className="btn btn-outline btn-primary flex items-center justify-center gap-2" onClick={handleGoogleLogin}>
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>
                </div>
                <p>Already have an account? Please <Link className="text-blue-400 underline" to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;