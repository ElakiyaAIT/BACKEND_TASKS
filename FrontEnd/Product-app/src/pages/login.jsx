import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const[showPassword, setShowPassword]=useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await loginUser(form)
      localStorage.setItem('access_token', res.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        mt={10}
        p={4}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" mb={3}>
          Welcome 👋
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            autoComplete='current-email'
            margin="normal"
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            margin="normal"
            onChange={handleChange}
            required
            InputProps={{
                endAdornment:(
                    <InputAdornment position='end'>
                        <IconButton 
                        onClick={()=>setShowPassword((p)=>!p)}
                        edge='end'>
                            {showPassword?<Visibility/>:<VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>

        <Typography mt={3} variant="body2">
          New user?{' '}
          <Link
            component="button"
            onClick={() => navigate('/register')}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
