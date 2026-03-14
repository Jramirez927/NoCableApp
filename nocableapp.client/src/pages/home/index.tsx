import '../../styles/fonts.css';
import '../../index.css';
import './styles.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1 className="logo react">No-Cable.com</h1>

      <p>
        Hi, I'm <strong>Jorge Ramirez</strong>, a GIS Full Stack Developer. No-Cable is a portfolio
        project built to showcase full-stack and geospatial development skills. The idea is simple:
        instead of saving places in a notes app or a plain list, you pin them on a real interactive
        map — attaching a journal entry with your thoughts, the date you visited, and the story
        behind the place. Add friends, see their pins on your map, and explore where the people you
        know have been. <Link to="/register">Create a free account</Link> to try it out.
      </p>
    </div>
  );
}

export default Home;
