import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import { auth } from '../../config/firebase';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Register = () => {
    const { createUser, setUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
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
        const confirmPassword = form.confirmPassword.value;
        const photoUrl = form.photourl.value;

        // Password validation
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter.');
            return;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError('Password must contain at least one number.');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setPasswordError('Password must contain at least one special character.');
            return;
        }
        if (password.toLowerCase().includes(email.toLowerCase())) {
            setPasswordError('Password cannot contain your email address.');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError('Password and Confirm Password do not match.');
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
            setPasswordError(error.message || 'Registration failed.');
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

    const handleGithubLogin = async () => {
        setPasswordError('');
        setLoading(true);
        try {
            await signInWithGithub();
            // No need to call sendUserToDB here, handled globally in AuthProvider
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Signed up with Github',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location?.state?.from?.pathname || '/');
        } catch (error) {
            if (
                error.code === 'auth/account-exists-with-different-credential' ||
                error.message?.includes('auth/account-exists-with-different-credential')
            ) {
                setPasswordError('An account already exists with the same email address but different sign-in credentials. Please use the original provider to log in.');
            } else {
                setPasswordError('Github login failed');
            }
            console.error('Github signup failed:', error); // Add this for debugging
        } finally {
            setLoading(false);
        }

    }

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
                    <label className="label">Photo URL</label>
                    <input type="text" name="photourl" className="input" placeholder="Photo URL" />
                    <label className="label">Email</label>
                    <input type="email" name="email" className="input" placeholder="Email" required />
                    <label className="label">Password</label>
                    <input type="password" name="password" className="input" placeholder="Password" required />
                    <label className="label">Confirm Password</label>
                    <input type="password" name="confirmPassword" className="input" placeholder="Confirm Password" required />
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    <button className="btn btn-neutral mt-4">Register</button>
                </form>
                <div className="flex flex-col gap-2 mt-4">
                    <button type="button" className="btn btn-outline btn-primary flex items-center justify-center gap-2" onClick={handleGoogleLogin}>
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>

                    <button type="button" className="btn btn-outline btn-neutral flex items-center justify-center gap-2" onClick={handleGithubLogin} disabled={loading}>
                        <FaGithub size={22} />
                        Continue with Github
                    </button>
                </div>
                <p>Already have an account? Please <Link className="text-blue-400 underline" to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;