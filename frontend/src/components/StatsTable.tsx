import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material'

export type ClickRow = {
  timestamp: string
  referer: string | null
  userAgent: string | null
  ip: string | null
  country: string | null
}

export default function StatsTable({ rows }: { rows: ClickRow[] }) {
  if (!rows.length) return null
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 420 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Referer</TableCell>
            <TableCell>User Agent</TableCell>
            <TableCell>IP</TableCell>
            <TableCell>Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
              <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
              <TableCell>{r.referer ?? '-'}</TableCell>
              <TableCell>{r.userAgent ?? '-'}</TableCell>
              <TableCell>{r.ip ?? '-'}</TableCell>
              <TableCell>{r.country ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 