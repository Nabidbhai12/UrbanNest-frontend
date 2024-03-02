import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import {app} from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch(); // Move useDispatch to the top level of the component
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            dispatch(signInStart()); // Dispatch action when the process starts
            
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            //fetch necessary data
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to authenticate with Google');
            }
            console.log("data success",data);


            dispatch(signInSuccess(data));
            navigate('/'); // Redirect to profile or dashboard upon successful login
        } catch (err) {
            console.error(err); // Log the error
            dispatch(signInFailure(err.message));
        }
    };

    return (
        <button onClick={handleGoogleClick} type='button' className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:shadow-outline">
            Continue with Google
        </button>
    );
}
