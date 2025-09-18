import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography, InputAdornment } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import TimerIcon from '@mui/icons-material/Timer'
import TagIcon from '@mui/icons-material/Tag'
import CopyField from '../components/CopyField'
import { createShortUrl } from '../services/shortUrls'

export default function ShortenPage() {
  const [url, setUrl] = useState('')
  const [validity, setValidity] = useState<number | ''>('')
  const [shortcode, setShortcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shortLink, setShortLink] = useState<string | null>(null)
  const [expiry, setExpiry] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShortLink(null)
    setExpiry(null)
    setLoading(true)
    try {
      const res = await createShortUrl({
        url,
        validity: typeof validity === 'number' ? validity : undefined,
        shortcode: shortcode || undefined,
      })
      setShortLink(res.shortLink)
      setExpiry(res.expiry)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create short URL'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component={Paper} sx={{ p: { xs: 2, sm: 3 }, backdropFilter: 'blur(6px)' }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
        Shorten your links
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create branded short links with optional expiry and custom aliases.
      </Typography>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Original URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/path"
            required
            fullWidth
            InputProps={{ startAdornment: (<InputAdornment position="start"><LinkIcon color="action" /></InputAdornment>) }}
          />
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              label="Validity (minutes)"
              type="number"
              value={validity}
              onChange={(e) => setValidity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="30"
              helperText="Leave blank for no expiry"
              inputProps={{ min: 1 }}
              fullWidth
              InputProps={{ startAdornment: (<InputAdornment position="start"><TimerIcon color="action" /></InputAdornment>) }}
            />
            <TextField
              label="Custom shortcode (optional)"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              placeholder="myalias123"
              fullWidth
              InputProps={{ startAdornment: (<InputAdornment position="start"><TagIcon color="action" /></InputAdornment>) }}
            />
          </Stack>
          <Box>
            <Button size="large" variant="contained" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Short URL'}
            </Button>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {shortLink && (
            <Stack spacing={1.5}>
              <CopyField label="Your short link" value={shortLink} />
              {expiry && (
                <Typography variant="body2" color="text.secondary">
                  Expires at: {new Date(expiry).toLocaleString()}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  )
} 