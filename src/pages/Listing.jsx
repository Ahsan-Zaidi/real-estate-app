import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '../firebase.config';
import Spinner from "../components/Spinner";
import shareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    //Fetch the listings as soon as you enter the page
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing();
    }, [navigate, params.listingId])

    return (
        <div>Listing</div>
    )
}

export default Listing;