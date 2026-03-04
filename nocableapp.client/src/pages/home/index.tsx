import "../../styles/fonts.css";
import "../../index.css";
import "./styles.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="card">
      <h1 className="logo react">No-Cable.com</h1>

      <Link to="/register" className="btn">Register</Link>
      <Link to="/login" className="btn">Login</Link>
    </div>
  );
}

export default Home;
