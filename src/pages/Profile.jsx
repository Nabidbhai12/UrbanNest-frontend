import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || 'default-avatar.png', // Provide a default avatar if needed
    // ... add other default properties if necessary ...
  });
  


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`https://urbannest-backend.onrender.com/api/users/getUserDetails`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if needed: 'Authorization': `Bearer ${token}`
          },
        });
        const data = await res.json();
        console.log(data);
        console.log(data.success);
  
       
  
        // Assuming data.user contains user details
        const userDetails = data.user;
        console.log("User details: ***", userDetails);
        setFormData({
          username: userDetails.username,
          email: userDetails.email,
          avatar: userDetails.profilePicture, // Make sure the key matches the one from your backend
          // ... include other properties as needed ...
          bio: userDetails.bio,
          contactNumber: userDetails.contactNumber,
          // ... and so on ...
        });
      } catch (error) {
        console.log("Error fetching user details:", error.message); // Handle error
      }
    };
  
    fetchUserDetails();
  }, []);
  



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filePerc < 100) {
      alert("Please wait until the file is fully uploaded.");
      return;
    }
    try {
      dispatch(updateUserStart());

      const data1 = new FormData();
      // Append file data if a file was uploaded
      if (file) {
        data.append('image', file);
      }
      // Append other form data
      Object.keys(formData).forEach(key => data.append(key, formData[key]));

      const res = await fetch(`https://urbannest-backend.onrender.com/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => { 
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://urbannest-backend.onrender.com/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
         try {
          dispatch(signOutUserStart());
          const res = await fetch('https://urbannest-backend.onrender.com/api/auth/signout', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          const data = await res.json();
          if (data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
          }
          dispatch(deleteUserSuccess(data));
         
        } catch (error) {
          // Here, 'data' is not defined, so you cannot use it
          dispatch(deleteUserFailure(error.message));
        }
      };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`https://urbannest-backend.onrender.com/api/listings/getlisting/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const fetchWishlistItems = async () => {
    try {
      const res = await fetch(`https://urbannest-backend.onrender.com/api/wishlist/${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        // Assuming data.wishlistItems contains the wishlist items
        setUserListings(data.wishlistItems);
      } else {
        // Handle error, could set an error state to show a message
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`https://urbannest-backend.onrender.com/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen p-5'>

      <div className='bg-white shadow rounded-lg p-6 flex'>
        <div className='w-1/3'>
          <img className='rounded-lg' src={formData.avatar || 'default-avatar.png'} alt='Profile avatar' />
        </div>
        <div className='w-2/3 pl-5'>
          <h1 className='text-2xl font-bold mb-2'>{formData.username}</h1>
          <p className='text-gray-700'>{formData.email}</p>
          {/* ... other user details ... */}
         
          <button className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSignOut}>Sign Out</button>


        </div>
      </div>

      <div className='my-6'>
        <h2 className='text-2xl font-bold mb-4'>Wishlist</h2>
        <div className='flex overflow-x-auto gap-4'>
          {userListings.map((item) => (
            <div key={item._id} className='min-w-max bg-white shadow rounded-lg p-4'>
              <img className='rounded-lg mb-4' src={item.image} alt={item.title} />
              <h3 className='text-lg font-semibold'>{item.title}</h3>
              <p className='text-gray-600'>{item.description}</p>
              <p className='text-gray-600'>{item.price}</p>
              {/* ... additional item details ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


  