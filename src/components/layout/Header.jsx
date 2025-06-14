import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import './Header.css';
import { AuthContext } from '../../contexts/AuthContext';


const Header = () => {
    const { user, signOutUser } = useContext(AuthContext);

    const [showDropdown, setShowDropdown] = useState(false);

    const links = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>


            {!user && <>
                
                
            </>}

            {
                user && <>
                    <li><NavLink to="/my-enrolled-courses" className={({ isActive }) => isActive ? 'active' : ''}>My Enrolled Courses</NavLink></li>
                    <li><NavLink to="/manage-courses" className={({ isActive }) => isActive ? 'active' : ''}>Manage Courses</NavLink></li>
                    <li><NavLink to="/add-course" className={({ isActive }) => isActive ? 'active' : ''}>Add Course</NavLink></li>
                   
                </>
            }

        </>
    );

    const handleLogout = async () => {
        try {
            await signOutUser();
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <div className={`shadow-3xl bg-gray-300`}>
            <div className='w-11/12 mx-auto navbar'>
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul tabIndex={0} className={`menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow`}>
                            {links}
                        </ul>
                    </div>
                    <Link to="/" className="normal-case text-xl flex items-center justify-center">
                        <div>
                            <img src="./logo.png" alt="logo" style={{ width: 60, height: 60 }} />
                        </div>
                        {/* <p className={`font-bold flex flex-row justify-center items-center`}>
                            <span>EduGate</span>
                        
                        </p> */}
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end flex items-center gap-2">

                    {user ? (
                        <div className="relative">
                            <div className="group relative">
                                <img
                                    src={user.photoURL}
                                    alt="Profile Picture"
                                    className="w-8 h-8 rounded-full cursor-pointer"
                                    onClick={() => setShowDropdown((prev) => !prev)}
                                />
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-400 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                    {user.displayName}
                                    <button
                                        className={`block w-full text-center rounded-md px-4 py-2 cursor-pointer `}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            {/* {showDropdown && (
                                <div className={`absolute right-0 mt-2 w-40 rounded shadow-lg z-10`}>
                                    <Link
                                        to={``}
                                        className={`block px-4 py-2 `}
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        className={`block w-full text-left px-4 py-2`}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )} */}
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Link to="/login" className="btn btn-outline btn-primary">Login</Link>
                            <Link to="/register" className="btn btn-outline btn-primary">Register</Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Header;