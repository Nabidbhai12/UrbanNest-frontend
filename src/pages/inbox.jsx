import React, { useState, useEffect } from 'react';

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([]);
  
    useEffect(() => {
      fetchConversations();
    }, []);
  
    const fetchConversations = async () => {
      try {
        // Adjust the URL based on your API endpoint that doesn't require authentication
        const response = await fetch('/api/conversation/getMessage'); // Assuming the endpoint doesn't require authentication
  
        // Check for successful response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

  return (
    <div>
      <h2>My Conversations</h2>
      {conversations.map((conversation) => (
        <div key={conversation._id}>
          <h3>Conversation with {conversation.receiver.username}</h3>
          {conversation.messages.map((message) => (
            <p key={message._id}>
              <strong>{message.sender.username}: </strong>{message.text}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ConversationsPage;
