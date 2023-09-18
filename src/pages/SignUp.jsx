import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase.config';
import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);

    //Single state to manage both Email and password data from form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    //Destructured to use in JSX
    const { name, email, password } = formData;

    const navigate = useNavigate();

    //update formData State 
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    };

    //Submit function for form
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            
            //register the user with this function
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            const user = userCredential.user

            updateProfile(auth.currentUser, {
                displayName: name,
            })

            //copy the formData state as to not change it
            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            //update the doc to add new user into the user collection in db
            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            //redirect to home
            navigate('/')
        } catch (error) {
            toast.error('Something went wrong with registration')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back!
                    </p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            className="nameInput"
                            placeholder="Name"
                            id="name"
                            value={name}
                            onChange={onChange} 
                        />

                        <input
                            type="email"
                            className="emailInput"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={onChange} 
                        />

                        <div className="passwordInputDiv">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="passwordInput"
                                placeholder="Password"
                                id="password"
                                value={password}
                                onChange={onChange}
                            />

                            {/**Button to show password */}
                            <img
                                src={visibilityIcon}
                                alt="show password" 
                                className="showPassword"
                                onClick={() => setShowPassword((prevState) => !prevState)}    
                            />
                        </div>

                        <Link to='/forgot-password' className="forgotPasswordLink">
                            Forgot Password
                        </Link>

                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon
                                    fill="#ffffff"
                                    width='34px'
                                    height='34px'
                                />
                            </button>
                        </div>
                    </form>

                    <OAuth />

                    <Link to='/sign-in' className="registerLink">
                        Sign In
                    </Link>
                </main>
            </div>
        </>
    )
}

export default SignUp;