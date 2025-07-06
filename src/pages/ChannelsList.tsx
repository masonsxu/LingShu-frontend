import { Delete as DeleteIcon, Edit as EditIcon, PlayArrow as TestIcon } from '@mui/icons-material';
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
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ChannelModel } from '../api/channels';
import { deleteChannel, getChannels } from '../api/channels';

const ChannelsList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChannels();
      setChannels(data);
    } catch (err) {
      setError(t('fetch_channels_failed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm(t('confirm_delete_channel', { id }))) {
      try {
        await deleteChannel(id);
        fetchChannels(); // Refresh the list
      } catch (err) {
        setError(t('delete_channel_failed', { id }));
        console.error(err);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('channels_management')}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/channels/new')}>
          {t('create_new_channel')}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{t('fetch_channels_failed')}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="channels table">
            <TableHead>
              <TableRow>
                <TableCell>{t('id')}</TableCell>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="center">{t('enabled')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
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
                  <TableCell align="center">{channel.enabled ? t('yes') : t('no')}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="test" onClick={() => navigate(`/channels/test/${channel.id}`)}>
                      <TestIcon titleAccess={t('test')} />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => navigate(`/channels/edit/${channel.id}`)}>
                      <EditIcon titleAccess={t('edit')} />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(channel.id)}>
                      <DeleteIcon titleAccess={t('delete')} />
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