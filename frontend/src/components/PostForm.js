import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Heading, Textarea, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PostForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();
  const postId = query.get('id');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (postId) {
      setLoading(true);
      axios.get(`/posts/${postId}`)
        .then(res => {
          const post = res.data;
          if (post.author._id !== user._id) {
            setError('You are not authorized to edit this post.');
          } else {
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl || '');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load post data.');
          setLoading(false);
        });
    }
  }, [postId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      if (postId) {
        // Update post
        await axios.put(`/posts/${postId}`, { title, content, imageUrl });
      } else {
        // Create post
        await axios.post('/posts', { title, content, imageUrl });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  if (loading) return <Text mt={10} textAlign="center">Loading post data...</Text>;

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md">
      <Heading mb={6}>{postId ? 'Edit Post' : 'Create New Post'}</Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea value={content} onChange={e => setContent(e.target.value)} rows={6} />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Image URL (optional)</FormLabel>
          <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
        </FormControl>
        <Button colorScheme="blue" type="submit" width="full">
          {postId ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </Box>
  );
}

export default PostForm;
