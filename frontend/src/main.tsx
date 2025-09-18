import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import './index.css'

const theme = createTheme({
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
