import React, { useState } from 'react';
import { Box, Button, Input, Heading, Text, FormControl, FormLabel } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axios.post('/auth/register', { username, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md">
      <Heading mb={6} textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input value={username} onChange={e => setUsername(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </FormControl>
        {error && <Text color="red.500" mb={4}>{error}</Text>}
        {success && <Text color="green.500" mb={4}>{success}</Text>}
        <Button type="submit" colorScheme="blue" width="full">Register</Button>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login</Link>
      </Text>
    </Box>
  );
}

export default RegisterPage;
