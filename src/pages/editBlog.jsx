// NewBlogPost.js
import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import axios from 'axios'; // Make sure to install axios if not already
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useParams } from 'react-router-dom';
import { set } from 'mongoose';

Quill.register('modules/imageResize', ImageResize);


const EditBlog = () => {
    const [blog, setBlog] = useState(null);
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrls, setImageUrls] = useState([]);

    const [preview, setPreview] = useState(false);
    const quillRef = React.useRef();

    useEffect(() => {
        const fetchBlog = async () => {
            try{
                console.log("blogid in usereffect: ", id);
                const response = await fetch(`https://urbannest-backend.onrender.com/api/blogs/showBlog/${id}`);
                const data = await response.json();

                setTitle(data.title);
                setContent(data.content);
                setTags(data.tags.join(', '));
                setImageUrls(data.imageUrls || []);

                setBlog(data);

                console.log("in fetchblog: ", data);

            }catch(error){
                console.error('Error fetching blog:', error);
            }
        }

        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            editor.getModule('toolbar').addHandler('image', imageHandler);
        }

        fetchBlog();
    }, [id]);

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
            const response = await fetch ('https://urbannest-backend.onrender.com/api/blogs/upload', {
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
        let formdata = new FormData();
        formdata.append('title', title);
        formdata.append('content', content);
        formdata.append('tags', JSON.stringify(tagsArray));
        formdata.append('imageUrls', JSON.stringify(imageUrls));

        try{
            const response = await axios.put(`/api/blogs/updateBlog/${id}`, formdata, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Blog submitted:', response.data);
            alert('Blog updated successfully!');
        }catch(error){
            console.error('Error submitting blog:', error);
        }
    }

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

      return(
        <div className="bg-yellow-50-custom min-h-screen pt-16 align-center">
          <form onSubmit={handleSubmit} className="container mx-auto p-8 bg-white rounded-lg shadow">
            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
    
            {/* Tags input */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
    
            {/* Content editor */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <ReactQuill value={content} onChange={setContent} modules={modules} ref={quillRef} />
            </div>
    
            <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                {preview ? 'Edit' : 'Preview'}
            </button>
    
            {/* Submit button */}
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update Blog Post</button>

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

export default EditBlog;