'use client'

import DrawerMenu from '@/components/DrawerMenu';
import Layout from '../components/Layout';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useMapStyle } from '@/zustand';
import Modal from '@/components/Modal';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export default function Home() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const mapStyle = useMapStyle.use.style()
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
    },
  }), [])

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
    },
  }), [mode])

  useEffect(() => {
    if (['Dark', 'Navigation (Night)'].includes(mapStyle)) {
      setMode('dark')
    } else {
      setMode('light')
    }
  }, [mapStyle])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container disableGutters={true} maxWidth={false} sx={{ height: '100vh' }}>
          <Modal />
          <Layout />
          <DrawerMenu />
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
