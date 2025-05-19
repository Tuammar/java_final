import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent,
  Slider
} from '@mui/material';
import { format, addHours, setHours, setMinutes, setSeconds } from 'date-fns'; // Для работы с датами и добавим setHours и др.

interface SeatPlace { // New interface for individual seats
  id: string; // This will be the seatPlaceId for booking
  seatNumber: string;
}

interface SpaceData { // Renamed from Place, represents a space like a coworking area
  id: string; // This is the spaceId
  name: string;
  category: 'coworking' | 'library';
  totalSlots: number; // Can be derived from seats.length or kept for other purposes
  seats: SeatPlace[]; // Each space now has a list of its seats
}

// Updated data structure with nested seats
const allSpacesWithSeats: SpaceData[] = [
  { 
    id: 'cw1', name: 'Коворкинг "Прогресс" на 4-ом', category: 'coworking', totalSlots: 10,
    seats: [
      { id: 'cw1-s1', seatNumber: 'Стол 1' },
      { id: 'cw1-s2', seatNumber: 'Стол 2' },
      { id: 'cw1-s3', seatNumber: 'Кабинка A' },
    ]
  },
  { 
    id: 'cw2', name: 'Коворкинг "Идея" в главном корпусе', category: 'coworking', totalSlots: 15,
    seats: [
      { id: 'cw2-s1', seatNumber: 'Место 101' },
      { id: 'cw2-s2', seatNumber: 'Место 102' },
    ]
  },
  { 
    id: 'lib1', name: 'Библиотека, читальный зал №1', category: 'library', totalSlots: 20,
    seats: [
      { id: 'lib1-s1', seatNumber: 'Ряд 1, Место 1' },
      { id: 'lib1-s2', seatNumber: 'Ряд 1, Место 2' },
      { id: 'lib1-s3', seatNumber: 'Ряд 2, Место 1' },
    ]
  },
  { 
    id: 'lib2', name: 'Библиотека, компьютерный класс', category: 'library', totalSlots: 8,
    seats: [
      { id: 'lib2-pc1', seatNumber: 'Компьютер 1' },
      { id: 'lib2-pc2', seatNumber: 'Компьютер 2' },
    ]
  },
];

const Booking: React.FC = () => {
  const getInitialDate = () => { // Renamed and simplified
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  };

  const getInitialTimeRange = (): [number, number] => {
    const now = new Date();
    let startHour = now.getHours();
    let endHour = startHour + 2;
    if (endHour > 23) { // Assuming slider max is 23 for 23:00
        endHour = 23;
        if (startHour > 21) {
            startHour = 21; // Ensure at least 2 hours if possible, or adjust as needed
        }
    }
    return [startHour, endHour];
  };

  const [startDate, setStartDate] = useState<string>(getInitialDate());
  const [bookingTimeRange, setBookingTimeRange] = useState<[number, number]>(getInitialTimeRange());

  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [availableSeats, setAvailableSeats] = useState<SeatPlace[]>([]);
  const [selectedSeatPlaceId, setSelectedSeatPlaceId] = useState<string>('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpaceChange = (event: SelectChangeEvent) => {
    const currentSpaceId = event.target.value;
    setSelectedSpaceId(currentSpaceId);
    setSelectedSeatPlaceId('');
    if (currentSpaceId) {
      const space = allSpacesWithSeats.find(s => s.id === currentSpaceId);
      setAvailableSeats(space ? space.seats : []);
    } else {
      setAvailableSeats([]);
    }
  };

  const handleSeatChange = (event: SelectChangeEvent) => {
    setSelectedSeatPlaceId(event.target.value);
  };

  const formatTimeRangeSliderLabel = (value: number) => `${String(value).padStart(2, '0')}:00`;

  const handleBookingTimeRangeChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    // Prevent end time from being less than or equal to start time
    // And ensure minimum 1-hour booking if desired (optional)
    const minBookingDuration = 1; // Minimum 1 hour booking
    if (activeThumb === 0) { // Start time thumb
        const newStartTime = Math.min(newValue[0], bookingTimeRange[1] - minBookingDuration);
        setBookingTimeRange([newStartTime, Math.max(newStartTime + minBookingDuration, bookingTimeRange[1])]);
    } else { // End time thumb
        const newEndTime = Math.max(newValue[1], bookingTimeRange[0] + minBookingDuration);
        setBookingTimeRange([Math.min(bookingTimeRange[0], newEndTime - minBookingDuration), newEndTime]);
    }
  };

  const handleBooking = async () => {
    const [startHour, endHour] = bookingTimeRange;
    if (!startDate || !selectedSeatPlaceId || startHour === undefined || endHour === undefined || startHour >= endHour) {
      showSnackbar('Пожалуйста, выберите дату, место и корректный диапазон времени.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      // Construct startDateTime and endDateTime from startDate and bookingTimeRange
      const baseDate = new Date(startDate); // Parse the startDate string
      
      const startDateTime = format(setSeconds(setMinutes(setHours(baseDate, startHour), 0), 0), "yyyy-MM-dd'T'HH:mm:ss");
      const endDateTime = format(setSeconds(setMinutes(setHours(baseDate, endHour), 0), 0), "yyyy-MM-dd'T'HH:mm:ss");
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        showSnackbar('Для бронирования необходимо авторизоваться', 'error');
        return;
      }
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          seatPlaceId: selectedSeatPlaceId,
          startTime: startDateTime,
          endTime: endDateTime
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Бронирование успешно:', data);
      
      showSnackbar('Бронирование успешно создано!', 'success');
      
      setSelectedSpaceId('');
      setAvailableSeats([]);
      setSelectedSeatPlaceId('');
      setStartDate(getInitialDate());
      setBookingTimeRange(getInitialTimeRange());

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Система бронирования (Администратор)
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Date Picker */}
          <Grid item xs={12} md={4}> {/* Adjusted grid size */}
            <TextField 
              label="Дата бронирования" 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              fullWidth 
            />
          </Grid>

          {/* Space and Seat Selectors - Spacing adjusted */}
          <Grid item xs={12} md={4}> {/* Adjusted grid size */}
            <FormControl fullWidth>
              <InputLabel id="space-select-label">Пространство</InputLabel>
              <Select
                labelId="space-select-label"
                value={selectedSpaceId}
                label="Пространство"
                onChange={handleSpaceChange}
              >
                <MenuItem value=""><em>Не выбрано</em></MenuItem>
                {allSpacesWithSeats.map((space) => (
                  <MenuItem key={space.id} value={space.id}>
                    {space.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}> {/* Adjusted grid size */}
            <FormControl fullWidth disabled={!selectedSpaceId || availableSeats.length === 0}>
              <InputLabel id="seat-select-label">Номер места</InputLabel>
              <Select
                labelId="seat-select-label"
                value={selectedSeatPlaceId}
                label="Номер места"
                onChange={handleSeatChange}
              >
                <MenuItem value=""><em>Не выбрано</em></MenuItem>
                {availableSeats.map((seat) => (
                  <MenuItem key={seat.id} value={seat.id}>
                    {seat.seatNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* New Booking Time Range Slider */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
              <Typography gutterBottom>Выберите диапазон времени бронирования:</Typography>
              <Slider
                value={bookingTimeRange}
                onChange={handleBookingTimeRangeChange}
                valueLabelDisplay="auto"
                getAriaLabel={() => 'Диапазон времени бронирования'}
                valueLabelFormat={formatTimeRangeSliderLabel}
                min={0} // 00:00
                max={23} // 23:00 (slider represents start of the hour)
                         // If max is 23, then range [22, 23] means 22:00 to 23:00
                         // If you want to book up to 24:00 (end of day), max could be 24,
                         // but then need to handle how endHour=24 is interpreted.
                         // Sticking to max 23, where endHour is exclusive is simpler.
                         // Or if max 23 means 23:00-23:59, and endHour is inclusive.
                         // Let's assume max 23 means end booking AT 23:00 (i.e. 22:00-23:00 is last slot)
                step={1}
                marks={[
                  { value: 0, label: '00:00' },
                  { value: 6, label: '06:00' },
                  { value: 9, label: '09:00' },
                  { value: 12, label: '12:00' },
                  { value: 15, label: '15:00' },
                  { value: 18, label: '18:00' },
                  { value: 21, label: '21:00' },
                  { value: 23, label: '23:00' },
                ]}
                disableSwap
              />
              <Typography align="center" sx={{ mt: 1 }}>
                Выбрано: с {formatTimeRangeSliderLabel(bookingTimeRange[0])} до {formatTimeRangeSliderLabel(bookingTimeRange[1])}
              </Typography>
            </Box>
          </Grid>
          
          {/* Booking Button */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBooking}
              disabled={!startDate || !selectedSeatPlaceId || isLoading || bookingTimeRange[0] >= bookingTimeRange[1]}
            >
              {isLoading ? 'Обработка...' : 'Забронировать'}
            </Button>
          </Grid>
        </Grid>
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