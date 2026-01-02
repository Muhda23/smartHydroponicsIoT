import { Link } from "react-router-dom";
import logoUntid from '../assets/logoUntid.png'
import ThemeToggle from "../items/ThemeToggle";

const Header = ()=> {
  // const navigate = useNavigate();

  return (

    <nav className="shadow-sm nav">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:border-b border-gray-200 dark:border-gray-700/60">
          {/* Left Side */}
          <Link to={'/'}>myGreenHouse</Link>
          {/* Right Side */}
          <div>
            <ul className="flex space-x-8 items-center">
              <li className="rounded-lg px-4 py-2 hover:shadow">
                <Link  to={'/setting'}>Data</Link>
              </li>
              {/* <li>
                <ThemeToggle></ThemeToggle>
              </li> */}
              <li>
                <Link to={'/'}>
                <img style={{width:'40px', height:'40px'}} src={logoUntid} alt="logo-untid" />
                </Link>
              </li>
            </ul>
            {/* <button onClick={()=>navigate('/setting')}>Settings</button>            
            <ThemeToggle></ThemeToggle>
            <div>Logo </div> */}
          </div>
        </div>
      </div>
    </nav>    

  );
}

export default Header;
