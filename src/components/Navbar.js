import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="navbar-fixed">
            <nav className="yellow lighten-2">
                <div className="container nav-wrapper">
                    <Link to="/" className="brand-logo center grey-text text-darken-3">Cognizance</Link>
                    <ul className="right">
                        <li>
                            <NavLink to="/new" className="grey-text text-darken-3">
                                <i className="material-icons">
                                    create
                                </i>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar