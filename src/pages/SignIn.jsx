import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';




export default function SignIn() {
  const [formData, setFormData] = useState({});
 const {loading,error}=useSelector(state=>state.user)
 const [warning, setWarning] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset warning when user starts correcting
    if (warning) setWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

   

    // Replace with your authentication logic
    try {
      console.log("hello");
      const res = await fetch('https://urbannest-backend.onrender.com//api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });

      const data = await res.json();
     if(data.success==false){
        setWarning(data.message);
        console.log(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      //vlocalStoragee token to 
      console.log(data);

      dispatch(signInSuccess(data));
      navigate('/'); // Redirect to profile or dashboard upon successful login
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
    <div className="max-w-md w-full bg-yellow-50 rounded-lg shadow-xl p-8">
      <h2 className="text-center text-3xl font-extrabold text-gray-800">Sign In</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {warning && <p className="text-red-500 text-center">{warning}</p>}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
            
          </div>

          <div className="space-y-4">

          <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            
            <OAuth />
          </div>
          <div className="text-sm text-center">
            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
