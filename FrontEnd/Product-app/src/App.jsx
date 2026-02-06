import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Product from './pages/product'
import CreateProduct from './pages/createProduct'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        // <ProtectedRoute>
          <Product/>
        /* </ProtectedRoute> */
      }
      />
      <Route path='/products/new' element={
        // <ProtectedRoute>
          <CreateProduct/>
        /* </ProtectedRoute> */
      }/>
    </Routes>
  )
}
