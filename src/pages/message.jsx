import React, { useState, useEffect } from 'react';


const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('api/conversation/getUsers'); // Adjust the URL based on your API endpoint
      // Check for successful response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const sendMessage = async (receiverId) => {
    if (!message) {
      alert('Please enter a message.');
      return;
    }
  
    const data = {
      receiverId: receiverId,
      text: message,
    };
    console.log(data);
  
    try {
      const response = await fetch('/api/conversation/sendMessage', {
        method: 'POST', // Explicitly specify POST method
        headers: { 'Content-Type': 'application/json' }, // Set headers for JSON data
        body: JSON.stringify(data),
      });
  console.log(response);
      // Check for successful response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      alert('Message sent successfully');
      setMessage(''); // Clear the message box after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => setSelectedUserId(user._id)}>Send Message</button>
          </li>
        ))}
      </ul>

      {selectedUserId && (
        <div>
          <textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => sendMessage(selectedUserId)}>Send</button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
