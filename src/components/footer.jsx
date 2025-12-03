import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <p>© {new Date().getFullYear()} SagePath. All rights reserved.</p>

            <div className="footer-links">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
            </div>

            <div className="social-media">
                <a href="https://www.instagram.com/abhigyandutta"><i className="fab fa-facebook-f"></i></a>
                <a href="https://x.com/AbhigyanD_21"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/abhigyandutta"><i className="fab fa-instagram"></i></a>
                <a href="www.linkedin.com/in/abhigyandutta"><i className="fab fa-linkedin-in"></i></a>
            </div>

            <div id="courses-offered">
                <h4>Courses Offered</h4>
                <ul>
                    <li>Introduction to Programming</li>
                    <li>Web Development Basics</li>
                    <li>Data Science Fundamentals</li>
                    <li>Machine Learning 101</li>
                    <li>Advanced JavaScript</li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
