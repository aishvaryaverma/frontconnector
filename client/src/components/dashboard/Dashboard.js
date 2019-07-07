import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layouts/Spinner';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({
    getCurrentProfile,
    auth: { user },
    profile: { profile, loading }
}) => {
    useEffect(() => {
        getCurrentProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">
            Dashboard
        </h1>
        <p className="lead"><i className="fas fa-user"></i> Welcome { user && user.name }</p>
        {
            profile !== null ? (<Fragment>Has Profile</Fragment>) : (<Fragment>
                <p>No Profile Found. Please create profile:</p>
                <Link to="/create-profile" className="btn btn-dark mt-2">Create Profile</Link>
            </Fragment>)
        }
    </Fragment>
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStatetoProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStatetoProps, { getCurrentProfile })(Dashboard);