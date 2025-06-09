import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Login = () => {
   const { signInUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
       const navigate = useNavigate();
       const location = useLocation();
       const [error, setError] = useState('');
       const [loading, setLoading] = useState(false);
       const [showPassword, setShowPassword] = useState(false);
   
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
   
       const handleGithubLogin = async () => {
           setError('');
           setLoading(true);
           try {
               await signInWithGithub();
               Swal.fire({
                   position: 'top-end',
                   icon: 'success',
                   title: 'Logged in with Github',
                   showConfirmButton: false,
                   timer: 1500
               });
               navigate(location?.state?.from?.pathname || '/');
           } catch {
               setError('Github login failed');
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
                       <div style={{ position: 'relative' }}>
                           <input
                               type={showPassword ? 'text' : 'password'}
                               name="password"
                               className="input pr-10"
                               placeholder="Password"
                               required
                           />
                           <button
                               type="button"
                               onClick={() => setShowPassword((prev) => !prev)}
                               style={{
                                   position: 'absolute',
                                   right: 20,
                                   top: '50%',
                                   transform: 'translateY(-50%)',
                                   background: 'none',
                                   border: 'none',
                                   cursor: 'pointer',
                                   color: '#888',
                                   padding: 0,
                               }}
                               tabIndex={-1}
                               aria-label={showPassword ? 'Hide password' : 'Show password'}
                           >
                               {showPassword ? (
                                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/></svg>
                               ) : (
                                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.21 0 4.21-.5 6-1.35l-1.45-1.45C15.36 17.13 13.74 17.5 12 17.5c-5.05 0-8.13-4.13-8.94-5.5.81-1.37 3.89-5.5 8.94-5.5 1.74 0 3.36.37 4.55 1.05l1.45-1.45C16.21 5.5 14.21 5 12 5zm10.19 2.19l-1.41-1.41-18 18 1.41 1.41 2.1-2.1C7.79 20.5 9.79 21 12 21c7 0 10-7 10-7s-1.16-2.45-3.81-6.81l2-2z"/></svg>
                               )}
                           </button>
                       </div>
                       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                       <button className="btn btn-neutral mt-4" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                   </form>
                   <div className="flex flex-col gap-2 mt-4">
                       <button type="button" className="btn btn-outline btn-primary flex items-center justify-center gap-2" onClick={handleGoogleLogin} disabled={loading}>
                           <FcGoogle size={22} />
                           Continue with Google
                       </button>
                       <button type="button" className="btn btn-outline btn-neutral flex items-center justify-center gap-2" onClick={handleGithubLogin} disabled={loading}>
                           <FaGithub size={22} />
                           Continue with Github
                       </button>
                   </div>
                   <p>Don't have an account? <Link className="text-blue-400 underline" to="/register">Register</Link></p>
               </div>
           </div>
       );
};

export default Login;