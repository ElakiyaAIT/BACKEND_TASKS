import api from './axios'

export const getProducts = () => api.get('/products')

export const createProduct = (payload) =>
  api.post('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`)
