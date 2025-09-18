import { AppBar, Box, Container, IconButton, Toolbar, Typography, Link as MuiLink, CssBaseline } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} component={RouterLink} to="/">
            <span>🔗</span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AffordMed URL Shortener
          </Typography>
          <MuiLink component={RouterLink} to="/" color="inherit" underline="none" sx={{ mr: 2 }}>
            Shorten
          </MuiLink>
          <MuiLink component={RouterLink} to="/stats" color="inherit" underline="none">
            Stats
          </MuiLink>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">© {new Date().getFullYear()} AffordMed</Typography>
      </Box>
    </Box>
  )
} 