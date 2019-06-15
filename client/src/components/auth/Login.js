import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onFormSubmit = async e => {
        e.preventDefault();
        console.log('SUCCESS');
    };

	return (
		<Fragment>
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<i className="fas fa-user" /> Sign Into Your Account
			</p>
			<form className="form" onSubmit={e => onFormSubmit(e)}>
				<div className="form-group">
					<input
						type="email"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
						placeholder="Email Address"
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength="6"
						placeholder="Password"
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>

			<p className="my-1">
				Already have an account? <Link to="/register">Sign Up</Link>
			</p>
		</Fragment>
	);
};

export default Login;
