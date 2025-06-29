import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChannelModel } from '../api/channels';
import { deleteChannel, getChannels } from '../api/channels';

const ChannelsList: React.FC = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await getChannels();
      setChannels(data);
    } catch (err) {
      setError('Failed to fetch channels.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to delete channel ${id}?`)) {
      try {
        await deleteChannel(id);
        fetchChannels(); // Refresh the list
      } catch (err) {
        setError(`Failed to delete channel ${id}.`);
        console.error(err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Channels Management
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/channels/new')}>
          Create New Channel
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="channels table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Enabled</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {channels.map((channel) => (
                <TableRow
                  key={channel.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {channel.id}
                  </TableCell>
                  <TableCell>{channel.name}</TableCell>
                  <TableCell>{channel.description}</TableCell>
                  <TableCell align="center">{channel.enabled ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => navigate(`/channels/edit/${channel.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(channel.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ChannelsList;