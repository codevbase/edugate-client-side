import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const sliderData = [
    {
        title: "Welcome to EduGate",
        description: "Empower your learning journey with top courses and expert instructors.",
        image: "/logo.png"
    },
    {
        title: "Interactive Learning",
        description: "Engage with hands-on projects and real-world scenarios.",
        image: "/vite.svg"
    },
    {
        title: "Join Our Community",
        description: "Connect with learners and educators from around the globe.",
        image: "/favicon.png"
    }
];

const sliderStyles = {
    slide: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '350px',
        height: '100%',
        background: '#f9fafb',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2rem',
        textAlign: 'center',
        width: '100%',
    },
    image: {
        width: '120px',
        height: '120px',
        objectFit: 'contain',
        marginBottom: '1.5rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: '#1e293b',
    },
    description: {
        fontSize: '1.1rem',
        color: '#334155',
        marginBottom: '0.5rem',
    }
};

const Home = () => {
    const sliderRef = useRef(null);
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
        adaptiveHeight: true,
    };
    return (
        <div className="w-full max-w-5xl mx-auto mt-10 relative">
            <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
                onClick={() => sliderRef.current.slickPrev()}
                aria-label="Previous Slide"
                style={{ left: 0 }}
            >
                <FaChevronLeft size={24} />
            </button>
            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
                onClick={() => sliderRef.current.slickNext()}
                aria-label="Next Slide"
                style={{ right: 0 }}
            >
                <FaChevronRight size={24} />
            </button>
            <div style={{ width: '100%', height: '400px' }}>
                <Slider ref={sliderRef} {...settings}>
                    {sliderData.map((slide, idx) => (
                        <div key={idx} style={sliderStyles.slide}>
                            <img src={slide.image} alt={slide.title} style={sliderStyles.image} />
                            <h2 style={sliderStyles.title}>{slide.title}</h2>
                            <p style={sliderStyles.description}>{slide.description}</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Home;