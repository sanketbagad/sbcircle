import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import { getProfileById } from "../../actions/profile"
import ProfileAbout from "../../components/profile/ProfileAbout"
import ProfileTop from "./ProfileTop"
import { Link } from 'react-router-dom'
import ProfileExperience from "./ProfileExperience"
import ProfileEducation from "./ProfileEducation"
import ProfileGithub from "./ProfileGithub"
const Profile = ({ match, getProfileById, profile: {profile, loading}, auth}) => {
    
    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById, match.params.id])
    
    return (
        <>
         {profile === null || loading ? <Spinner /> : (
             <> 
             <Link to="/profile" className="btn btn-light">
                 Back to Profiles
             </Link>
             {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                 <Link to="/edit-profile" className="btn btn-dark">
                     Edit Profile
                 </Link>
             )}
             <div className="profile-grid my-1">
                 <ProfileTop profile={profile} />
                 <ProfileAbout profile={profile} />
                 <div className="profile-exp bg-white p-2">
                     <h2 className="text-primary">Experience</h2>
                     {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment> ) : ( 
                <h4>No experience credentials</h4> 
                )}
                 </div>
                 <div className="profile-edu bg-white p-2">
                     <h2 className="text-primary">Education</h2>
                     {profile.education.length > 0 ? (<>
                     {profile.education.map(education => (
                         <ProfileEducation key={education._id} education={education} />
                     ))}
                     </>) : 
                         <h4> No Experience Field </h4>
                     }
                 </div>
                 {profile.githubusername && (
                     <ProfileGithub username={profile.githubusername}/>
                 )}
             </div>
             </>
         )}
        </>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById }) (Profile)
