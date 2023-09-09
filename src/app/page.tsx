import Layout from '../components/Layout';
import { Container, CssBaseline, Paper } from '@mui/material';

export default function Home() {
  return (
    <>
      <CssBaseline />
      <Paper>
        <Container>
          <Layout />
        </Container>
      </Paper>
    </>
  )
}
