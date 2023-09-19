import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const Category = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    //Fetch the listings from the doc and put them into out listings state
    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Get a referance
                const listingsRef = collection(db, 'listings')

                //Create a query
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                //Execute query
                const querySnap = await getDocs(q)

                //Loop through the snapshot
                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch listings')
            }
        }

        fetchListings()
    }, [params.categoryName])

    return (
        <div className="category">
            <header>
                {/**Set pageHeader conditionally */}
                <p className="pageHeader">
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
                </p>
            </header>

            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <h3 key={listing.id}>{listing.data.name}</h3>
                            ))}
                        </ul>
                    </main>
                </>   
            ) : (
                <p>No listings for {params.categoryName}</p>
            )}
        </div>
    )
}

export default Category;