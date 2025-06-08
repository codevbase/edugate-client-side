import React from 'react';

const Footer = () => {
    return (
        <footer className='bg-gray-700' style={{ color: '#fff', padding: '40px 0', marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
                {/* Column 1: Logo & Slogan */}
                <div style={{ flex: 1, minWidth: 220, marginBottom: 20 }}>
                    <img src="/logo.png" alt="EduGate Logo" style={{ width: 70, marginBottom: 10 }} />
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>EduGate</h2>
                    <p style={{ margin: '10px 0 0', fontSize: 15, color: '#bbb' }}>
                        Unlocking knowledge, empowering futures.
                    </p>
                    <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                        {/* Social Media Icons (SVGs) */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }} aria-label="Facebook">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }} aria-label="Twitter">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.92 2.206-4.92 4.924 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.633A9.936 9.936 0 0 0 24 4.557z"/></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }} aria-label="LinkedIn">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg>
                        </a>
                    </div>
                </div>
                {/* Column 2: Links */}
                <div style={{ flex: 1, minWidth: 180, marginBottom: 20 }}>
                    <h3 style={{ color: '#fff', marginBottom: 12 }}>Quick Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2' }}>
                        <li><a href="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</a></li>
                        <li><a href="/courses" style={{ color: '#bbb', textDecoration: 'none' }}>Courses</a></li>
                        <li><a href="/about" style={{ color: '#bbb', textDecoration: 'none' }}>About Us</a></li>
                    </ul>
                </div>
                {/* Column 3: Links */}
                <div style={{ flex: 1, minWidth: 180, marginBottom: 20 }}>
                    <h3 style={{ color: '#fff', marginBottom: 12 }}>Resources</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2' }}>
                        <li><a href="/blog" style={{ color: '#bbb', textDecoration: 'none' }}>Blog</a></li>
                        <li><a href="/faq" style={{ color: '#bbb', textDecoration: 'none' }}>FAQ</a></li>
                        <li><a href="/contact" style={{ color: '#bbb', textDecoration: 'none' }}>Contact</a></li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', color: '#888', fontSize: 14, marginTop: 30 }}>
                &copy; {new Date().getFullYear()} EduGate. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;