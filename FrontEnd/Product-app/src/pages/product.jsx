import { useEffect, useState } from 'react'
import { Grid, Container, Typography, Button, Box } from '@mui/material'
import ProductCard from '../components/productCard'
import { Add } from '@mui/icons-material'
import CreateProductModal from '../components/createProductModal'
import { getProducts, deleteProduct } from '../api/products'

export default function Products() {
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)


  const fetchProducts = async () => {
    const res = await getProducts()
    setProducts(res.data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <Container sx={{ mt: 4 }}>
         <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>


      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid
            item
            key={product._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: 'flex' }}   
          >
            <ProductCard
              product={product}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

       <CreateProductModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchProducts}
      />
    </Container>
  )
}
