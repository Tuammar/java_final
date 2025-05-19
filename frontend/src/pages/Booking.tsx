import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';

// Временная имитация данных мест для бронирования
const dummySeats = [
  { id: '1', name: 'Коворкинг №1' },
  { id: '2', name: 'Коворкинг №2' },
  { id: '3', name: 'Библиотека №1' },
  { id: '4', name: 'Библиотека №2' },
];

const Booking: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [availableSeats] = useState(dummySeats);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const handleSeatChange = (event: SelectChangeEvent) => {
    setSelectedSeat(event.target.value);
  };

  const handleBooking = async () => {
    if (!startDate || !startTime || !endDate || !endTime || !selectedSeat) {
      showSnackbar('Пожалуйста, заполните все поля', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // Формируем данные для бронирования
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      // В реальном приложении здесь был бы API запрос к бэкенду
      console.log('Бронирование:', {
        seatplaceId: selectedSeat,
        startTime: startDateTime,
        endTime: endDateTime
      });
      
      showSnackbar('Бронирование успешно создано!', 'success');
      
      // Сбросить форму
      setSelectedSeat('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      showSnackbar('Не удалось создать бронирование', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Система бронирования
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Дата начала"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Время начала"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Дата окончания"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Время окончания"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="seat-select-label">Выберите место</InputLabel>
              <Select
                labelId="seat-select-label"
                id="seat-select"
                value={selectedSeat}
                label="Выберите место"
                onChange={handleSeatChange}
              >
                {availableSeats.map((seat) => (
                  <MenuItem key={seat.id} value={seat.id}>
                    {seat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBooking}
              disabled={!startDate || !startTime || !endDate || !endTime || !selectedSeat || isLoading}
            >
              {isLoading ? 'Обработка...' : 'Забронировать'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Booking; 