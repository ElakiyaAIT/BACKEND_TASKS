import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
} from '@mui/material'
import { createProduct } from '../api/products'
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    price:'',
    stock: '',
  })
  const [images, setImages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
     Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })
     Array.from(images).forEach((img) => {
      formData.append('images', img)
    })
    for (let pair of formData.entries()) {
  console.log(pair[0], pair[1])
}

    
    await createProduct(formData)
    navigate('/dashboard')
  }

  return (
    <Container>
      <Typography variant="h4" mt={4}>
        Create Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
    <TextField
  fullWidth
  label="Price"
  margin="normal"
  type="number"
  onChange={(e) =>
    setForm({ ...form, price: e.target.value })
  }
/>

        <TextField
          fullWidth
          label="Stock"
          margin="normal"
          type="number"
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Container>
  )
}
