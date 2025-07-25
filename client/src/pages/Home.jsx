import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Chronicare</h1>
      <p>Helping doctors and patients manage chronic care efficiently.</p>
      <div className="home-buttons">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Home;
