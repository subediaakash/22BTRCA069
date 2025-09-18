import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography, InputAdornment } from '@mui/material'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import TagIcon from '@mui/icons-material/Tag'
import { getShortUrlStats, type ShortUrlStats } from '../services/shortUrls'
import StatsTable from '../components/StatsTable'

export default function StatsPage() {
  const [shortcode, setShortcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ShortUrlStats | null>(null)

  const onLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStats(null)
    setLoading(true)
    try {
      const res = await getShortUrlStats(shortcode)
      setStats(res)
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component={Paper} sx={{ p: { xs: 2, sm: 3 }, backdropFilter: 'blur(6px)' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <QueryStatsIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
          Link analytics
        </Typography>
      </Stack>
      <Box component="form" onSubmit={onLookup}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'flex-start' }}>
          <TextField
            label="Shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="abcd1"
            required
            InputProps={{ startAdornment: (<InputAdornment position="start"><TagIcon color="action" /></InputAdornment>) }}
          />
          <Button size="large" variant="contained" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Lookup'}
          </Button>
        </Stack>
      </Box>
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
      {stats && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography>
            <strong>Shortcode:</strong> {stats.shortcode}
          </Typography>
          <Typography>
            <strong>Original URL:</strong> {stats.originalUrl}
          </Typography>
          <Typography>
            <strong>Created:</strong> {new Date(stats.createdAt).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Expiry:</strong> {new Date(stats.expiry).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Total clicks:</strong> {stats.totalClicks}
          </Typography>
          <StatsTable rows={stats.clicks} />
        </Stack>
      )}
    </Box>
  )
} 