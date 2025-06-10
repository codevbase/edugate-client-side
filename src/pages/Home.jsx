import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router';

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

const sliderStyles = {
    slide: {
        position: 'relative',
        width: '100%',
        height: 'min(60vw, 420px)',
        minHeight: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(120deg, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)',
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
        fontWeight: 800,
        marginBottom: '1rem',
        letterSpacing: '0.02em',
        lineHeight: 1.1,
        textShadow: '0 2px 16px rgba(0,0,0,0.4)'
    },
    subtitle: {
        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
        fontWeight: 400,
        marginBottom: '1.5rem',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1,
        filter: 'blur(0.5px) scale(1.04)',
        transition: 'transform 0.5s',
    },
    cta: {
        marginTop: '0.5rem',
        padding: '0.75rem 2.5rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: '999px',
        background: 'linear-gradient(90deg, #2563eb 0%, #1e293b 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 2px 8px rgba(30,41,59,0.15)',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.2s',
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
        <section className="w-full max-w-5xl mx-auto mt-8 mb-12 relative px-2 sm:px-4">
            <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => sliderRef.current.slickPrev()}
                aria-label="Previous Slide"
                style={{ left: 0 }}
            >
                <FaChevronLeft  size={24} />
            </button>
            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => sliderRef.current.slickNext()}
                aria-label="Next Slide"
                style={{ right: 0 }}
            >
                <FaChevronRight size={24} />
            </button>
            <div style={{ width: '100%', height: 'min(60vw, 420px)', minHeight: '260px' }}>
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
    );
};

export default Home;