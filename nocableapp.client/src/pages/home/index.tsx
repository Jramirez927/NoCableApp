import '../../styles/fonts.css'
import '../../index.css'
import './styles.css'
import { Link } from 'react-router-dom'

function Home() {

  return (
    <>
      <h1 className='logo react'>No-Cable.com</h1>
      <div className="card">
        <button>
          <Link to="/register">Register</Link>
        </button>
        <button >
          <Link to="/login">Login</Link>
        </button>
      </div>
    </>
  )
}

export default Home