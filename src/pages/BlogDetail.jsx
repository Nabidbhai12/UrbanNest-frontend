import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../styles/color.css';
import { Img } from "../components/image";
import { Text } from "../components/text";
import { List } from "../components/list";
import { Slider } from "../components/slider";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentVoteStatuses, setCommentVoteStatuses] = useState([]);
  const { id } = useParams();
  const { commentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogResponse = await fetch(`/api/blogs/showBlog/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const userUpvoteStatusResponse = await fetch(`/api/blogs/checkUpvote/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const userDownvoteStatusResponse = await fetch(`/api/blogs/checkDownvote/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('in fetchBlog id:', id);
  
        if (blogResponse.ok && userUpvoteStatusResponse.ok && userDownvoteStatusResponse.ok) {
          const blogData = await blogResponse.json();

          console.log(blogData.content);
          const hasUpvoted = await userUpvoteStatusResponse.json().hasUpvoted;
          const hasDownvoted = await userDownvoteStatusResponse.json().hasDownvoted;
  
          setBlog(blogData);
          setHasUpvoted(hasUpvoted);
          setHasDownvoted(hasDownvoted);

          console.log('in fetchBlog blogData:', blogData);
        } else {
          console.error('Error fetching blog details:', blogResponse.statusText);
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
        navigate('/404');
      }
    };

    const fetchComments = async () => {
      try{
        const response = await axios.get(`/api/blogs/showAllComments/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        console.log('in fetchComments response:', response);
        setComments(response.data);

        console.log('in fetchComments id:', id);

        const voteStatusResponse = await fetch(`/api/blogs/checkVoteComment/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        console.log('in fetchComments voteStatusResponse:', voteStatusResponse);
        if(voteStatusResponse.ok){
          const voteStatusData = await voteStatusResponse.json();
          setCommentVoteStatuses(voteStatusData);
        }else{
          console.error('Error fetching comment vote status:', voteStatusResponse.statusText);
        }
        
      }catch(error){
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchBlog();
    fetchComments();
  }, [id, navigate]);

  const handleUpVote = async () => {
    // If already downvoted, first reverse the downvote
    if (hasDownvoted) {
      await handleVoteChange(`/api/blogs/decreaseDownvoteBlog/${id}`, setHasDownvoted, 'numOfDownvotes', -1);
    }

    const endpoint = hasUpvoted ? `/api/blogs/decreaseUpvoteBlog/${id}` : `/api/blogs/upvoteBlog/${id}`;
    await handleVoteChange(endpoint, setHasUpvoted, 'numOfUpvotes', hasUpvoted ? -1 : 1);
  };

  const handleDownVote = async () => {
    // If already upvoted, first reverse the upvote
    if (hasUpvoted) {
      await handleVoteChange(`/api/blogs/decreaseUpvoteBlog/${id}`, setHasUpvoted, 'numOfUpvotes', -1);
    }

    const endpoint = hasDownvoted ? `/api/blogs/decreaseDownvoteBlog/${id}` : `/api/blogs/downvoteBlog/${id}`;
    await handleVoteChange(endpoint, setHasDownvoted, 'numOfDownvotes', hasDownvoted ? -1 : 1);
  };

  // Refactored vote handling logic to reduce duplication
  const handleVoteChange = async (endpoint, setState, countKey, delta) => {
    try {
      const response = await axios.put(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      
      });
      if (response.status === 200) {
        setState(prevState => !prevState);
        setBlog(prevBlog => ({
          ...prevBlog,
          [countKey]: prevBlog[countKey] + delta,
        }));
      }
    } catch (error) {
      console.error('Error voting on the blog:', error);
    }
  };  
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/blogs/createComment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ blogId: id, content: comment }),
      });
  
      if (response.ok) {
        setComment('');
        // Optionally fetch updated blog data
        window.location.reload();
      } else {
        console.error('Error submitting the comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error during comment submission:', error);
    }
  };

  const handleCommentVoteChange = async (endpoint, index, newStatus) => {
    try {
      console.log('in handleCommentVoteChange endpoint:', endpoint);
      console.log('in handleCommentVoteChange newStatus:', newStatus);
      const response = await axios.put(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        // Directly update the specific index in the commentVoteStatuses array
        setCommentVoteStatuses(prevStatuses =>
          prevStatuses.map((status, idx) => (idx === index) ? newStatus : status)
        );
      }
    } catch (error) {
      console.error('Error voting on the comment:', error);
    }
  };
  
  const handleCommentUpvote = async (commentId, index) => {
    const currentStatus = commentVoteStatuses[index];
    const isCurrentlyUpvoted = currentStatus === 1;
    const isCurrentlyDownvoted = currentStatus === -1;
    let endpoint;
    
    console.log('in handleCommentUpvote currentStatus:', currentStatus);

    if (currentStatus === 1) {
      // Cancel the upvote
      endpoint = `/api/blogs/decreaseUpvoteComment/${commentId}`;
      await handleCommentVoteChange(endpoint, index, 0);

    } else {
      // Apply upvote
      if (currentStatus === -1) {
        // First, cancel the downvote
        await handleCommentVoteChange(`/api/blogs/decreaseDownvoteComment/${commentId}`, index, 0);
      }
      // Then, apply the upvote
      endpoint = `/api/blogs/upvoteComment/${commentId}`;
      await handleCommentVoteChange(endpoint, index, 1);
    }
  };

  const handleCommentDownvote = async (commentId, index) => {
    const currentStatus = commentVoteStatuses[index];
    const isCurrentlyDownvoted = currentStatus === -1;
    const isCurrentlyUpvoted = currentStatus === 1;
    let endpoint;

    console.log('in handleCommentDownvote currentStatus:', currentStatus);
    
    if (currentStatus === -1) {
      // Cancel the downvote
      endpoint = `/api/blogs/decreaseDownvoteComment/${commentId}`;
      await handleCommentVoteChange(endpoint, index, 0);
    } else {
      // Apply downvote
      if (currentStatus === 1) {
        // First, cancel the upvote
        await handleCommentVoteChange(`/api/blogs/decreaseUpvoteComment/${commentId}`, index, 0);
      }
      // Then, apply the downvote
      endpoint = `/api/blogs/downvoteComment/${commentId}`;
      await handleCommentVoteChange(endpoint, index, -1);
    }
  };
  

  if (!blog) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // const extractContent = (content) => {
  //   const div = document.createElement('div');
  //   div.innerHTML = content;
  //   const text = div.textContent || div.innerText || '';
  //   const image = div.querySelector('img') ? div.querySelector('img').src : 'default-image.jpg';
  //   let tags;
  //   try {
  //       // Assuming `blog.tags` is something like ['["ab","bc","cd"]']
  //       // and you want to parse it to get the actual array of tags
  //       tags = JSON.parse(blog.tags[0]);
  //   } catch (error) {
  //       console.error('Error parsing tags:', error);
  //       tags = []; // Default to an empty array in case of parsing failure
  //   }

  //   console.log('in extractContent tags:', tags);
  //   return { text, image, tags };
  // };
  const extractContent = (content, tagsData) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    const image = div.querySelector('img') ? div.querySelector('img').src : 'default-image.jpg';
    let tags;
    try {
      tags = tagsData;
    } catch (error) {
      console.error('Error parsing tags:', error);
      tags = []; // Default to an empty array in case of parsing failure
    }
  
    console.log('in extractContent tags:', tags);
    return { text, image, tags };
  };
  //const sanitizedComments = DOMPurify.sanitize(blog.commentList);

  const { text, image, tags } = extractContent(blog.content, blog.tags);

  return (
    <div className="bg-yellow-50-custom min-h-screen pt-16">
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white-A700 rounded-lg shadow overflow-hidden">
          {/* Post Header */}
          <div className="px-4 py-5 sm:px-6 border-b">
            <Text
                className="leading-[140.00%] sm:text-4xl md:text-[42px] text-[46px] text-gray-900 tracking-[-0.92px] text-center"
                size="txtManropeExtraBold46"
              >
                {blog.title}
            </Text>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 text-center">{blog.authorName} - {new Date(blog.createdAt).toLocaleString()}</p>
          </div>
          {/* Post Content */}
          <div className="px-4 py-5 sm:p-6 ">
            <div className="prose max-w-none text-[25px]" dangerouslySetInnerHTML={{ __html: (blog.content) }} />
            {/* get the image */}
            <div className='object-center'>
              <img
                src={image}
                className="h-2/3 w-2/3 object-center object-cover"
                alt={blog.title}
              />
            </div>
            {/* get the tags*/}
            <div className="flex justify-left space-x-4 mt-5">
              {tags.map((tag) => (
                <Link to={`/blogHome/${tag}`} key={tag}>
                  <span key={tag} className="py-1 px-3 text-sm font-semibold bg-gray-401 rounded-full text-gray-700 mb-2">{tag}</span>
                </Link>
              ))}
            </div>

          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUpVote}
              className={`p-2 border rounded-full hover:bg-gray-100 text-black ${hasUpvoted ? 'bg-green-600' : 'bg-gray-100'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Use an arrow-up icon for upvoted */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className="text-xl font-bold">{blog.numOfUpvotes || 0}</span>
            <button
              onClick={handleDownVote}
              className={`p-2 border rounded-full hover:bg-gray-100 text-black ${hasDownvoted ? 'bg-red-600' : 'bg-gray-100'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Use an arrow-down icon for downvoted */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span className="text-xl font-bold">{blog.numOfDownvotes || 0}</span>
          </div>
          {/* Comment Section */}
          <div className="px-4 py-4 sm:px-6 border-t">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Post your comment now~"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Send
              </button>
            </form>
          </div>

          {/* show all the comments sorted by time. My commentlist stores comment ids, so we have to fetch the comments first. */}
          {/* <div className="px-4 py-4 sm:px-6 border-t">
            <h2 className="text-lg font-semibold mb-3">Comments</h2>
            <ul>
              {blog.commentList.map((commentId) => (
                <li key={commentId}>
                  <Comment commentId={commentId} />
                </li>
              ))}
            </ul>
          </div> 
          
          */}
          
          <div className="container p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold pt-5 pb-2">Comments</h1>
            {
              comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={comment._id} className="bg-yellow-50-custom p-3 my-2 rounded-2xl shadow">
                    <p className="break-words text-xl">{comment.content}</p>

                    <div className="text-xs text-gray-500">
                      {comment.authorName} - {new Date(comment.createdAt).toLocaleString()}
                    </div>

                    <div className="flex items-center space-x-4 mt-2">
                      <button
                        onClick={() => handleCommentUpvote(comment._id, index)}
                        className={`p-2 border rounded-full hover:bg-gray-100 text-black ${commentVoteStatuses[index] === 1 ? 'bg-green-600' : 'bg-gray-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-xl font-bold">{comment.numOfUpvotes || 0}</span>
                      <button
                        onClick={() => handleCommentDownvote(comment._id, index)}
                        className={`p-2 border rounded-full hover:bg-gray-100 text-black ${commentVoteStatuses[index] === -1 ? 'bg-red-600' : 'bg-gray-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <span className="text-xl font-bold">{comment.numOfDownvotes || 0}</span>
                    </div>
                  </div>
                ))
              )
              : (
              <p>No comments yet.</p>
              )
            }
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;