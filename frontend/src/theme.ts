import React from 'react'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

export type Mode = 'light' | 'dark'

export const ColorModeContext = React.createContext<{ mode: Mode; toggleColorMode: () => void }>({
  mode: 'light',
  toggleColorMode: () => {},
})

export function createAppTheme(mode: Mode) {
  const isDark = mode === 'dark'
  let theme = createTheme({
    palette: {
      mode: mode as PaletteMode,
      primary: { main: isDark ? '#8b7cf6' : '#6C5CE7' },
      secondary: { main: isDark ? '#4DD7FF' : '#00C2FF' },
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      info: { main: '#3b82f6' },
      background: {
        default: isDark ? '#0f1224' : '#f6f8fb',
        paper: isDark ? '#14182e' : '#ffffff',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(180%) blur(12px)',
            backgroundImage: 'linear-gradient(90deg, rgba(108,92,231,0.9), rgba(0,194,255,0.9))',
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            ...(isDark
              ? { border: '1px solid rgba(255,255,255,0.06)' }
              : { border: '1px solid rgba(0,0,0,0.06)' }),
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12 },
          contained: { boxShadow: '0 8px 20px rgba(108,92,231,0.25)' },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': { fontWeight: 700 },
          },
        },
      },
      MuiLink: { defaultProps: { underline: 'hover' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  })

  theme = responsiveFontSizes(theme)
  return theme
} 