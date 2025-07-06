import { Send as SendIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { ChannelModel, MessageProcessRequest, MessageProcessResponse } from '../api/channels';
import { getChannelById, processMessage } from '../api/channels';

const MessageTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [channel, setChannel] = useState<ChannelModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [result, setResult] = useState<MessageProcessResponse | null>(null);

  useEffect(() => {
    if (id) {
      getChannelById(id)
        .then((data) => {
          setChannel(data);
        })
        .catch((err) => {
          setError('Failed to load channel.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleProcessMessage = async () => {
    if (!id || !message.trim()) return;

    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const request: MessageProcessRequest = { message: message.trim() };
      const response = await processMessage(id, request);
      setResult(response);
    } catch (err) {
      setError('Failed to process message.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSetSampleMessage = () => {
    const sampleMessage = `{
  "patient_id": "123456",
  "name": "John Doe",
  "age": 30,
  "diagnosis": "Hypertension",
  "timestamp": "${new Date().toISOString()}"
}`;
    setMessage(sampleMessage);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!channel) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Channel not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('test_channel')}: {channel.name}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('channel_info')}
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('id')}
            </Typography>
            <Typography variant="body1">{channel.id}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('name')}
            </Typography>
            <Typography variant="body1">{channel.name}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('enabled')}
            </Typography>
            <Typography variant="body1">{channel.enabled ? t('yes') : t('no')}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('source_type')}
            </Typography>
            <Typography variant="body1">{channel.source.type.toUpperCase()}</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('test_message')}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleSetSampleMessage}
            sx={{ mr: 2 }}
          >
            {t('use_sample_message')}
          </Button>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label={t('message_content')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('enter_message_placeholder')}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={processing ? <CircularProgress size={20} /> : <SendIcon />}
          onClick={handleProcessMessage}
          disabled={processing || !message.trim()}
          sx={{ minWidth: 120 }}
        >
          {processing ? t('processing') : t('send_message')}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('processing_result')}
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {t('status')}
              </Typography>
              <Alert severity={result.success ? 'success' : 'error'} sx={{ mt: 1 }}>
                {result.success ? t('success') : t('failed')}
              </Alert>
            </CardContent>
          </Card>

          {result.processed_message && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('processed_message')}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {result.processed_message}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          )}

          {result.result && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('result_details')}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {result.result}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          )}

          {result.error && (
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('error_details')}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'error.dark' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', color: 'error.contrastText' }}>
                    {result.error}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Paper>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/channels')}
          sx={{ minWidth: 120 }}
        >
          {t('back_to_channels')}
        </Button>
      </Box>
    </Container>
  );
};

export default MessageTest;