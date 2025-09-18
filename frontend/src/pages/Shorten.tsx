import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
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
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create a short link
      </Typography>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Original URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/path"
            required
            fullWidth
          />
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              label="Validity (minutes)"
              type="number"
              value={validity}
              onChange={(e) => setValidity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="30"
              inputProps={{ min: 1 }}
              fullWidth
            />
            <TextField
              label="Custom shortcode (optional)"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              placeholder="myalias123"
              fullWidth
            />
          </Stack>
          <Box>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Short URL'}
            </Button>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {shortLink && (
            <Stack spacing={1}>
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