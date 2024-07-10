import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/posts">Posts</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
                <li>
                    <Link to="/subscribe">Subscribe</Link>
                </li>
                <li>
                    <Link to="/submit">Submit Post</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
