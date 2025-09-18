import { useState } from 'react'
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <Box>
      <TextField
        fullWidth
        size="medium"
        label={label}
        value={value}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                <IconButton aria-label="copy" onClick={onCopy} edge="end" color={copied ? 'success' : 'default'}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
} 