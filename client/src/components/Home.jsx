import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>📚 DevOps Project</h1>
        <p>Discover your next favorite book</p>
        <div className="home-buttons">
          <Link to="/login" className="auth-button login">Sign In</Link>
          <Link to="/register" className="auth-button register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
