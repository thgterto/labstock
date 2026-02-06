import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Box sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 1.5,
              borderRadius: 2,
              mb: 2
            }}>
               <ScienceIcon fontSize="large" />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Faça login no LabControl 2.0
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Usuário"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Entrar
              </Button>
            </Box>

            <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
              Credenciais Demo: admin / admin
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
