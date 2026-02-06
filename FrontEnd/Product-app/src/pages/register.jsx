import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import { registerUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'


export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const[showPassword, setShowPassword]=useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            autoComplete='current-name'
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            autoComplete='current-email'
            name="email"
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            autoComplete='password'
            name="password"
            type={showPassword?'text':"password"}
            onChange={handleChange}
            required
            InputProps={{
                endAdornment:(
                    <InputAdornment position='end'>
                        <IconButton
                        onClick={()=>setShowPassword((p)=>!p)}
                        edge='end'
                        >
                            {showPassword?<Visibility/>:<VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Typography mt={3} variant="body2">
  Already have an account?{' '}
  <Link component="button" onClick={() => navigate('/login')}>
    Login
  </Link>
</Typography>
      </Box>
    </Container>
  )
}
