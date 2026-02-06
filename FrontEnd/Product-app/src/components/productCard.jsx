import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material'

export default function ProductCard({ product, onDelete }) {
  return (
    <Card
      sx={{
        height: '100%',        // 🔑 critical
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={3}
    >
      {/* IMAGE */}
      <Box
        sx={{
          width: '100%',
          height: 180,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src={`http://localhost:3000/uploads/${product.images?.[0]}`}
          alt={product.name}
          width="100%"
          height="180"
          style={{ objectFit: 'cover', display: 'block' }}
        />
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="body2">Price: ₹{product.price}</Typography>
        <Typography variant="body2">Stock: {product.stock}</Typography>
      </CardContent>

      {/* ACTIONS */}
      <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(product._id)}
        >
          DELETE
        </Button>
      </CardActions>
    </Card>
  )
}
