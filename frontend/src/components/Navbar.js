import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logging out
  };

  return (
    <Box
      bgGradient="linear(to-r, blue.500, purple.500)"
      color="white"
      px={4}
      py={2}
      boxShadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Left side: Home button with logo-like text */}
        <Button colorScheme="blue" variant="solid" onClick={() => navigate('/')}>
          Home
        </Button>

        {/* Center: Username if authenticated */}
        {user && (
          <Text fontWeight="bold" fontSize="lg">
            {user.username}
          </Text>
        )}

        {/* Right side: Dashboard and Logout or Login/Register */}
        <Flex alignItems="center">
          {user ? (
            <>
              <Button colorScheme="blue" variant="solid" mr={4} onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>

              <Button colorScheme="blue" variant="solid" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button colorScheme="blue" variant="solid" mr={4} onClick={() => navigate('/login')}>
                Login
              </Button>

              <Button colorScheme="blue" variant="solid" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}

        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
