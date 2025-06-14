import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Text, Image, Spinner } from '@chakra-ui/react';
import axios from '../api/axios';

function HomePage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  if (!posts) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text mt={4}>Loading blogs...</Text>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box textAlign="center" mt={20}>
        <Text>No blog posts found. Please add one in the Dashboard.</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6} textAlign="center">Snap Blog</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {posts.map(post => (
          <Box key={post._id} borderWidth="1px" borderRadius="lg" overflow="hidden">
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
              <Text mt={2} fontSize="sm" color="gray.500">By: {post.author.username}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default HomePage;
