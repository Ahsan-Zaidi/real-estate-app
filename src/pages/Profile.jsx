import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
    const auth = getAuth();

    //state to update the user details
    const [changeDetails, setChangeDetails] = useState(false);

    //name and email data saved into a formData state
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    //destructure name and email from formData state object
    const { name, email } = formData;

    //initialize navigate
    const navigate = useNavigate();

    //logout handler
    const onLogout = () => {
        auth.signOut();
        navigate('/')
    };

    //update the changes in firebase as well as firestore
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //Update displayName 
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                //Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Could not update your information')
        }
    };

    //update the formData State
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    };

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button
                    className="logOut"
                    type="button"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails((prevState) => !prevState)
                        }}
                    >
                        {changeDetails ? 'done' : 'change' }
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="text"
                            id="email"
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Profile;