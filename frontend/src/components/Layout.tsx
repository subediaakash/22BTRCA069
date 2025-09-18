import { AppBar, Box, Container, IconButton, Toolbar, Typography, CssBaseline, Button } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useContext } from 'react'
import { ColorModeContext } from '../theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { mode, toggleColorMode } = useContext(ColorModeContext)
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column',
      background: {
        xs: 'radial-gradient(600px circle at 0% 0%, rgba(108,92,231,0.15), transparent 40%), radial-gradient(600px circle at 100% 0%, rgba(0,194,255,0.12), transparent 40%)',
        md: 'radial-gradient(800px circle at 0% 0%, rgba(108,92,231,0.18), transparent 40%), radial-gradient(800px circle at 100% 0%, rgba(0,194,255,0.14), transparent 40%)',
      },
    }}>
      <CssBaseline />
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} component={RouterLink} to="/">
            <span>🔗</span>
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 0.3 }}>
            <Box component="span" sx={{
              background: 'linear-gradient(90deg,#ffffff, rgba(255,255,255,0.85))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AffordMed URL Shortener
            </Box>
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{ mr: 1, borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Shorten
          </Button>
          <Button
            component={RouterLink}
            to="/stats"
            color="inherit"
            variant={location.pathname === '/stats' ? 'outlined' : 'text'}
            sx={{ mr: 1, borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Stats
          </Button>
          <IconButton color="inherit" aria-label="toggle theme" onClick={toggleColorMode}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flex: 1, py: 5 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">© {new Date().getFullYear()} AffordMed</Typography>
      </Box>
    </Box>
  )
} 