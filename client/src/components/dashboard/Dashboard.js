import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
    getCurrentProfile,
    auth: { user },
    profile: { profile, loading },
    deleteAccount
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        getCurrentProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">
            Dashboard
        </h1>
        <p className="lead"><i className="fas fa-user"></i> Welcome { user && user.name }</p>
        {
            profile !== null ? (<Fragment>
                <DashboardActions />
                { profile.experience.length > 0 ? (<Experience experience={profile.experience} />) : null }
                { profile.education.length > 0 ? (<Education education={profile.education} />) : null }
                <div className="my-2">
                    <button className="btn btn-danger" onClick={e => deleteAccount()}>
                        <i className="fas fa-user-minus" style={{ marginRight: '10px' }}></i>
                        Delete My Account
                    </button>
                </div>
            </Fragment>) : (<Fragment>
                <p style={{ marginBottom: '10px' }}>No Profile Found. Please create profile:</p>
                <Link to="/create-profile" className="btn btn-dark mt-2">Create Profile</Link>
            </Fragment>)
        }
    </Fragment>
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
};

const mapStatetoProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStatetoProps, { getCurrentProfile, deleteAccount })(Dashboard);