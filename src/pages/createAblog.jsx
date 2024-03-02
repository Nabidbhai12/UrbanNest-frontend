// NewBlogPost.js
import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import axios from 'axios'; // Make sure to install axios if not already
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

Quill.register('modules/imageResize', ImageResize);

const NewBlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const [preview, setPreview] = useState(false);
  const quillRef = React.useRef();

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, []);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        const formData = new FormData();
        formData.append('image', file);
        console.log(file);
        // Assuming '/api/images/upload' is your image upload endpoint
        const response = await fetch ('/api/blogs/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json(); // Parse the JSON from the response
        console.log(data);
        const imageUrl = data.url; // URL from the server
        setImageUrls(prevUrls => [...prevUrls, imageUrl]);
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const index = range ? range.index : 0;
        editor.insertEmbed(index, 'image', imageUrl);
      } else {
        console.warn('You can only upload images.');
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tags.split(',').map(tag => tag.trim());
    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('imageUrls', JSON.stringify(imageUrls));

    try {  
      const response = await axios.post('/api/blogs/createBlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(response.data);
    // Handle success, maybe clear form or show a success message
    } catch (error) {
      console.error('There was an error creating the blog post:', error);
      // Handle error, show error message to the user
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
    },
  };

  return (
    // <div className="container mx-auto p-8" style={{ backgroundImage: "url('/path-to-real-estate-background.jpg')" }}>
    <div className="bg-yellow-50-custom min-h-screen pt-16 align-center">
      <form onSubmit={handleSubmit} className="content-center px-4 py-5 sm:px-6 border-b space-y-6 bg-white-A700 p-8 rounded shadow-lg max-w-2xl">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 p-2.5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
  
        <div>
          <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 p-2.5"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
  
        <div>
          <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">Content</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="bg-gray-50 border border-gray-300 text-gray-900 py-2.5 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
  
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg transform transition-transform duration-150 ease-in-out hover:-translate-y-1"
        >
          Create Blog Post
        </button>
  
        {preview && (
          <div className="mt-8 p-4 border rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <div className="mb-3">{tags.split(',').map(tag => <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tag.trim()}</span>)}</div>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewBlogPost;

