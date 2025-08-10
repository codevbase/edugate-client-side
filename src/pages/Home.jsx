import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const sliderData = [
    {
        title: "Welcome to EduGate",
        subtitle: "Empower your learning journey with top courses and expert instructors.",
        bg: "/logo.png"
    },
    {
        title: "Interactive Learning",
        subtitle: "Engage with hands-on projects and real-world scenarios.",
        bg: "/vite.svg"
    },
    {
        title: "Join Our Community",
        subtitle: "Connect with learners and educators from around the globe.",
        bg: "/favicon.png"
    }
];

const categories = [
    {
        id: 1,
        title: "Web Development",
        description: "Master modern web technologies and frameworks",
        icon: "🌐",
        color: "from-blue-500 to-blue-600"
    },
    {
        id: 2,
        title: "Data Science",
        description: "Learn data analysis and machine learning",
        icon: "📊",
        color: "from-purple-500 to-purple-600"
    },
    {
        id: 3,
        title: "Mobile Development",
        description: "Build apps for iOS and Android",
        icon: "📱",
        color: "from-green-500 to-green-600"
    },
    {
        id: 4,
        title: "UI/UX Design",
        description: "Create beautiful and intuitive interfaces",
        icon: "🎨",
        color: "from-pink-500 to-pink-600"
    }
];

const features = [
    {
        id: 1,
        title: "Expert Instructors",
        description: "Learn from industry professionals with years of experience",
        icon: "👨‍🏫"
    },
    {
        id: 2,
        title: "Interactive Learning",
        description: "Engage with hands-on projects and real-world scenarios",
        icon: "💻"
    },
    {
        id: 3,
        title: "Flexible Schedule",
        description: "Learn at your own pace with lifetime access to courses",
        icon: "⏰"
    },
    {
        id: 4,
        title: "Career Support",
        description: "Get guidance on building your portfolio and landing jobs",
        icon: "🎯"
    }
];

const sliderStyles = {
    slide: {
        position: 'relative',
        width: '100%',
        height: 'min(70vw, 500px)',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(120deg, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 100%), url("/edugate1.jpg")',
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        height: '55vh',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        fontWeight: 800,
        marginBottom: '1.5rem',
        letterSpacing: '0.02em',
        lineHeight: 1.2,
        textShadow: '0 2px 20px rgba(0,0,0,0.5)'
    },
    subtitle: {
        fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
        fontWeight: 400,
        marginBottom: '2rem',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        lineHeight: 1.5
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1,
        filter: 'blur(0.8px) scale(1.05)',
        transition: 'transform 0.8s ease-out',
    },
    cta: {
        marginTop: '1rem',
        padding: '1rem 3rem',
        fontSize: '1.2rem',
        fontWeight: 600,
        borderRadius: '999px',
        background: 'linear-gradient(90deg, #2563eb 0%, #1e293b 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 16px rgba(30,41,59,0.25)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        outline: 'none',
    }
};

const slideVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5, ease: 'easeIn' } }
};

const Home = () => {
    const sliderRef = useRef(null);
    const navigate = useNavigate();
    // Courses section state
    const [courses, setCourses] = useState([]);
    const [popularCourses, setPopularCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popularLoading, setPopularLoading] = useState(false);
    const [error, setError] = useState('');
    const [popularError, setPopularError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`${API_BASE_URL}/courses?limit=6&sort=addedAt_desc`);
                setCourses(res.data || []);
            } catch {
                setError('Failed to load courses.');
            } finally {
                setLoading(false);
            }
        };

        const fetchPopularCourses = async () => {
            setPopularLoading(true);
            setPopularError('');
            try {
                const res = await axios.get(`${API_BASE_URL}/courses?limit=6&sort=enrollments_desc`);
                setPopularCourses(res.data || []);
            } catch {
                setPopularError('Failed to load popular courses.');
            } finally {
                setPopularLoading(false);
            }
        };

        fetchCourses();
        fetchPopularCourses();
    }, []);

    var settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false, // We'll use custom arrows
        pauseOnHover: true,
        adaptiveHeight: false,
        swipe: true,
        accessibility: true,
        appendDots: dots => (
            <div style={{ position: 'absolute', bottom: 18, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 3 }}>
                <ul style={{ margin: 0, padding: 0, display: 'flex', gap: 8 }}>{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#fff',
                border: '2px solid #2563eb',
                opacity: 0.7,
                transition: 'opacity 0.2s',
            }}></div>
        )
    };
    return (
        <>
            <Helmet>
                <title>Home | EduGate</title>
            </Helmet>
            <section className="w-full max-w-6xl mx-auto mt-8 mb-12 relative px-4 sm:px-6">
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 hover:bg-white transition-all duration-300 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110"
                    onClick={() => sliderRef.current.slickPrev()}
                    aria-label="Previous Slide"
                >
                    <FaChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 hover:bg-white transition-all duration-300 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-110"
                    onClick={() => sliderRef.current.slickNext()}
                    aria-label="Next Slide"
                >
                    <FaChevronRight size={20} className="text-gray-700" />
                </button>
                <div style={{ width: '100%', height: 'min(70vw, 500px)', minHeight: '300px' }}>
                    <Slider ref={sliderRef} {...settings}>
                        {sliderData.map((slide, idx) => (
                            <div key={idx} style={sliderStyles.slide}>
                                <img src={slide.bg} alt={slide.title + ' background'} style={sliderStyles.bg} loading="lazy" />
                                <div style={sliderStyles.overlay} aria-hidden="true"></div>
                                <motion.div
                                    style={sliderStyles.content}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={slideVariants}
                                    key={slide.title}
                                >
                                    <motion.h2
                                        style={sliderStyles.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p
                                        style={sliderStyles.subtitle}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                    <motion.button
                                        style={sliderStyles.cta}
                                        whileHover={{ scale: 1.07, background: 'linear-gradient(90deg, #1e293b 0%, #2563eb 100%)' }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate('/courses')}
                                        tabIndex={0}
                                        aria-label="Explore Courses"
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        Explore Courses
                                    </motion.button>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
            {/* Courses Section */}
            <section className="w-full max-w-6xl mx-auto mb-16 px-2 sm:px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Latest Courses</h2>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[120px]">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                        {courses.map(course => (
                            <div key={course._id || course.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                                <img
                                    src={course.imageUrl || '/logo.png'}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                                    <div className="text-gray-400 text-xs mb-3 mt-auto">Added: {course.addedAt ? new Date(course.addedAt).toLocaleDateString() : 'N/A'}</div>
                                    <button
                                        className="btn btn-primary btn-sm w-full mt-2"
                                        onClick={() => navigate(`/courses/${course._id || course.id}`)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* Popular Courses Section */}
            <section className="w-full max-w-6xl mx-auto mb-16 px-2 sm:px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Popular Courses</h2>
                {popularLoading ? (
                    <div className="flex justify-center items-center min-h-[120px]">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : popularError ? (
                    <div className="text-center text-red-500">{popularError}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                        {popularCourses.map(course => (
                            <div key={course._id || course.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <img
                                        src={course.imageUrl || '/logo.png'}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {course.enrollments || 0} Enrolled
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                                    <div className="text-gray-400 text-xs mb-3 mt-auto">Added: {course.addedAt ? new Date(course.addedAt).toLocaleDateString() : 'N/A'}</div>
                                    <button
                                        className="btn btn-primary btn-sm w-full mt-2 hover:scale-[1.02] transition-transform"
                                        onClick={() => navigate(`/courses/${course._id || course.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* Featured Categories Section */}
            <section className="w-full max-w-6xl mx-auto mb-16 px-2 sm:px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Featured Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(category => (
                        <motion.div
                            key={category.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`h-32 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                <span className="text-5xl">{category.icon}</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                                <p className="text-gray-600 text-sm">{category.description}</p>
                                <button
                                    onClick={() => navigate(`/courses?category=${category.title.toLowerCase()}`)}
                                    className="mt-4 text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2 transition-colors"
                                >
                                    Explore Courses
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Choose EduGate Section */}
            <section className="w-full max-w-6xl mx-auto mb-16 px-2 sm:px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose EduGate</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join thousands of learners who have transformed their careers with our comprehensive learning platform
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map(feature => (
                        <motion.div
                            key={feature.id}
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/courses')}
                        className="btn btn-primary px-8 py-3 text-lg"
                    >
                        Start Learning Today
                    </motion.button>
                </div>
            </section>
        </>
    );
};

export default Home;