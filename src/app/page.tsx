import DrawerMenu from '@/components/DrawerMenu';
import Layout from '../components/Layout';
import { Container, CssBaseline } from '@mui/material';

export default function Home() {
  return (
    <>
      <CssBaseline />
      <Container disableGutters={true} maxWidth={false} sx={{ height: '100vh' }}>
        <Layout />
        <DrawerMenu />
      </Container>
    </>
  )
}
