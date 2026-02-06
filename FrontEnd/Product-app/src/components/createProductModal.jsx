import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material'
import { createProduct } from '../api/products'

export default function CreateProductModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      )

      images.forEach((img) =>
        formData.append('images', img)
      )

      await createProduct(formData)

      onCreated()     // refresh products
      onClose()       // close modal

      // reset form
      setForm({ name: '', price: '', stock: '' })
      setImages([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
