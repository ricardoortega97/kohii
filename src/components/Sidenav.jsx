
import { Link } from 'react-router-dom';
import '../styles/SideNav.css';

const SideNav = () => {

    return (
        <div className="sideNav">
            <div className="inner-sideNav">
                <Link to="/" className='link'>
                    <span>
                        Home
                    </span>
                </Link>
                <Link to="/create" className='link'>
                    <span>
                        Create Post
                    </span>
                </Link>
                <div className="channels">
                    <h3>Channels</h3>
                    <Link to="/channel/1" className='link'>
                        <span>
                            Dev
                        </span>
                    </Link>
                    <Link to="/channel/1" className='link'>
                        <span>
                            Python
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default SideNav;