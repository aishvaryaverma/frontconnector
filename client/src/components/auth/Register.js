import React, { Fragment, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
    
    const onFormSubmit = async e => {
        e.preventDefault();

        if(password !== password2) {
            setAlert('Password does not matched.', 'danger', 2500);
        } else {
            register({name, email, password});
        }
    };

    if(isAuthenticated) {
		return <Redirect to="/dashboard" />
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user" /> Create Your Account
			</p>
			<form className="form" onSubmit={e => onFormSubmit(e)}>
				<div className="form-group">
					<input
						type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={e => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => onChange(e)}
					/>
					<small className="form-text">
						This site uses Gravatar so if you want a profile image,
						use a Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={e => onChange(e)}
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>

			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.propType = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStatetoProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStatetoProps, { setAlert, register })(Register);