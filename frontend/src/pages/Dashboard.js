import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, SimpleGrid, Text, Image, Spinner, Flex, Stack, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

function Dashboard() {
  const [posts, setPosts] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts/my-posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <Text textAlign="center" mt={10}>Please log in to view your dashboard.</Text>;

  if (!posts) return (
    <Box textAlign="center" mt={20}>
      <Spinner size="xl" />
      <Text mt={4}>Loading your posts...</Text>
    </Box>
  );

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Your Posts</Heading>
        <Button colorScheme="blue" onClick={() => navigate('/create-post')}>
          Create New Post
        </Button>
      </Flex>

      {posts.length === 0 && <Text>No posts yet. Create one above!</Text>}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {posts.map(post => (
          <Box key={post._id} borderWidth="1px" borderRadius="lg" overflow="hidden" position="relative">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                boxSize="250px"
                objectFit="cover"
                width="100%"
              />
            )}
            <Box p={4}>
              <Text fontWeight="bold" fontSize="xl">{post.title}</Text>
              <Text mt={2}>{post.content}</Text>
            </Box>
            <Stack direction="row" spacing={2} position="absolute" top="10px" right="10px">
              <IconButton
                aria-label="Edit post"
                icon={<EditIcon />}
                size="sm"
                onClick={() => navigate(`/create-post?id=${post._id}`)}
              />
              <IconButton
                aria-label="Delete post"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => handleDelete(post._id)}
              />
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
