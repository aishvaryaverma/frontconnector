import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
	const onClickLogout = e => {
		e.preventDefault();
		logout();
	};

	const authLinks = (
		<ul>
			<li>
				<Link to="/posts">Posts</Link>
			</li>
			<li>
				<Link to="/profiles">Developers</Link>
			</li>
			<li>
				<a href="#!" onClick={onClickLogout}><i className="fas fa-sign-out-alt"></i> <span className='hide-sm'>Logout</span></a>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<Link to="/profiles">Developers</Link>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
			<li>
				<Link to="/login">Login</Link>
			</li>
		</ul>
	);

    return (
		<nav className="navbar bg-dark">
			<h1>
				<Link to="/">
					<i className="fas fa-code" /> DevConnector
				</Link>
			</h1>
			{!loading && (
				<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
			)}
		</nav>
	);
};

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStatetoProps = state => ({
    auth: state.auth
});

export default connect(mapStatetoProps, { logout })(withRouter(Navbar));