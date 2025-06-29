import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ChannelForm from './pages/ChannelForm'
import ChannelsList from './pages/ChannelsList'

function Home() {
  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to LingShu Frontend!
      </Typography>
      <Typography variant="body1">
        This is the home page. Navigate to other sections using the links above.
      </Typography>
    </Container>
  )
}

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LingShu
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/channels">
            Channels
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/channels" element={<ChannelsList />} />
        <Route path="/channels/new" element={<ChannelForm />} />
        <Route path="/channels/edit/:id" element={<ChannelForm />} />
      </Routes>
    </Router>
  )
}

export default App