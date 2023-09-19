import ReactMap from "../ReactMap";
import { Box, Paper, Stack } from '@mui/material'

function Layout() {
  return (
    <Stack justifyContent="center" sx={{ height: 1 }}>
      <Paper sx={{ height: 1, overflow: 'hidden' }}>
        <Box sx={{ height: 1, width: 1 }}>
          <ReactMap />
        </Box>
      </Paper>
    </Stack>
  )
}

export default Layout
