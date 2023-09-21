import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { 
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
    const auth = getAuth();
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

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

    //Fetch the listings that match userRef field w logged in User
    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            //Only grab listings where the userRef value matches the logged in users uid
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            //initialize listings array
            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

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

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId))
            
            //Once the doc is deleted I want to show the remaining listings on the page
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('You have succesfully deleted listing')
        }
    }

    //Navigate to th edit page when edit icon is clicked
    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

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

                <Link to='/create-listing' className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile;