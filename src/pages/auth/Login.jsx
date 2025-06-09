import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
   const { signInUser, signInWithGoogle } = useContext(AuthContext);
       const navigate = useNavigate();
       const location = useLocation();
       const [error, setError] = useState('');
       const [loading, setLoading] = useState(false);
   
       const handleLogin = async (e) => {
           e.preventDefault();
           setError('');
           setLoading(true);
           const form = e.target;
           const email = form.email.value;
           const password = form.password.value;
           try {
               await signInUser(email, password);
               form.reset();
               Swal.fire({
                   position: 'top-end',
                   icon: 'success',
                   title: 'Logged in successfully',
                   showConfirmButton: false,
                   timer: 1500
               });
               navigate(location?.state?.from?.pathname || '/');
           } catch {
               setError('Invalid email or password');
           } finally {
               setLoading(false);
           }
       };
   
       const handleGoogleLogin = async () => {
           setError('');
           setLoading(true);
           try {
               await signInWithGoogle();
               Swal.fire({
                   position: 'top-end',
                   icon: 'success',
                   title: 'Logged in with Google',
                   showConfirmButton: false,
                   timer: 1500
               });
               navigate(location?.state?.from?.pathname || '/');
           } catch {
               setError('Google login failed');
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
               <h1 className="text-3xl text-center font-bold">Login</h1>
               <div className="card-body">
                   <form onSubmit={handleLogin} className="fieldset">
                       <label className="label">Email</label>
                       <input type="email" name="email" className="input" placeholder="Email" required />
                       <label className="label">Password</label>
                       <input type="password" name="password" className="input" placeholder="Password" required />
                       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                       <button className="btn btn-neutral mt-4" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                   </form>
                   <div className="flex flex-col gap-2 mt-4">
                       <button type="button" className="btn btn-outline btn-primary flex items-center justify-center gap-2" onClick={handleGoogleLogin} disabled={loading}>
                           <FcGoogle size={22} />
                           Continue with Google
                       </button>
                   </div>
                   <p>Don't have an account? <Link className="text-blue-400 underline" to="/register">Register</Link></p>
               </div>
           </div>
       );
};

export default Login;