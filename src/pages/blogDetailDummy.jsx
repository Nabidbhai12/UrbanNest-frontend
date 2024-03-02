/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser'; // Install this package to parse HTML
import '../styles/color.css';

const BlogHome = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6; // 3+3 blogs per page

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch ('/api/blogs/recent',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data=await response.json();
                console.log('data received by client side : ', data);


                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const extractContent = (content) => {
        const div = document.createElement('div');
        div.innerHTML = content;
        const text = div.textContent || div.innerText || '';
        const image = div.querySelector('img') ? div.querySelector('img').src : 'default-image.jpg';
        return { text, image };
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 bg-yellow-50-custom">
            <div className="py-8">
                <div className="grid grid-cols-2 gap-4">
                    {currentBlogs.map((blog) => {
                        const { text, image } = extractContent(blog.content);
                        return (
                            <div key={blog._id} className="transition duration-500 ease-in-out transform hover:-translate-x-1 hover:scale-105">
                                <Link to={`/blogHome/${blog._id}`}>
                                    <div className="bg-white hover:shadow-xl rounded-lg overflow-hidden" style={{ height: '300px', width: '400px' }}>
                                        <img src={image} alt={blog.title} className="w-full object-cover h-48" />
                                        <div className="p-4 h-52">
                                            <h2 className="font-bold text-lg mb-2">{blog.title}</h2>
                                            <p className="text-gray-700 text-sm">{parse(text.substring(0, 100))}...</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <Pagination blogsPerPage={blogsPerPage} totalBlogs={blogs.length} paginate={paginate} />
            </div>
        </div>
    );
};

const Pagination = ({ blogsPerPage, totalBlogs, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalBlogs / blogsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="flex justify-center space-x-2">
                {pageNumbers.map(number => (
                    <li key={number} className="inline">
                        <a onClick={() => paginate(number)} href="#!" className="text-gray-600 hover:text-gray-900">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BlogHome;

 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../styles/color.css';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogResponse = await fetch(`/api/blogs/showBlog/${id}`);
        const userUpvoteStatusResponse = await fetch(`/api/blogs/checkUpvote/${id}`, {
          // Add necessary headers for authentication, e.g.,
          // headers: { 
          //   'Authorization': `Bearer ${token}`,
          // },
        });

        const userDownvoteStatusResponse = await fetch(`/api/blogs/checkDownvote/${id}`, {});
  
        if (blogResponse.ok && userUpvoteStatusResponse.ok && userDownvoteStatusResponse.ok) {
          const blogData = await blogResponse.json();
          const hasUpvoted = await userUpvoteStatusResponse.json().hasUpvoted;
          const hasDownvoted = await userDownvoteStatusResponse.json().hasDownvoted;
  
          setBlog(blogData);
          setHasUpvoted(hasUpvoted);
          setHasDownvoted(hasDownvoted);
        } else {
          console.error('Error fetching blog details:', blogResponse.statusText, userUpvoteStatusResponse.statusText);
          navigate('/404');
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
        navigate('/404');
      }
    };
  
    fetchBlog();
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
      const response = await axios.put(endpoint);
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
        body: JSON.stringify({ blogId: id, content: comment }),
      });
  
      if (response.ok) {
        setComment('');
        // Optionally fetch updated blog data
      } else {
        console.error('Error submitting the comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error during comment submission:', error);
    }
  };
  

  if (!blog) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="min-h-screen bg-yellow-50-custom pt-16">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h1 className="text-3xl leading-6 font-medium text-gray-900">{blog.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{blog.authorName}</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
          <div className="px-4 py-4 sm:px-6">
            <button
              onClick={handleUpVote}
              className={`px-4 py-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 ${hasUpvoted ? 'bg-red-100 text-red-800' : ''}`}
            >
              {hasUpvoted ? 'Cancel Upvote' : 'Upvote'}
            </button>
            <button
              onClick={handleDownVote}
              className={`px-4 py-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 ${hasDownvoted ? 'bg-green-100 text-green-800' : ''}`}
            >
              {hasDownvoted ? 'Cancel Downvote' : 'Downvote'}
            </button>
            <span className="text-sm font-medium text-gray-500 ml-2">{blog.numOfUpvotes || 0} upvotes</span>
            <span className="text-sm font-medium text-gray-500 ml-2">{blog.numOfDownvotes || 0} downvotes</span>
          </div>
          <div className="px-4 py-4 sm:px-6 border-t">
            <form onSubmit={handleCommentSubmit} className="mt-1 flex">
              <textarea
                className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                rows="3"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm leading-5 font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue"
              >
                Comment
              </button>
            </form>
          </div>

          <div className="container p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold pt-5 pb-2">Comments</h1>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment._id} className="bg-yellow-50-custom p-3 my-2 rounded-2xl shadow">
                  {/* display comment so that text wraps to next line if exceeds container length */}
                  <p className="break-words text-xl">{comment.content}</p>
                  {/* Display additional comment information such as author and timestamp if available */}
                  <div className="text-xs text-gray-500">
                    {comment.authorName} - {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
