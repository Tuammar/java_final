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
import { format, addHours } from 'date-fns'; // Для работы с датами

interface Place {
  id: string;
  name: string;
  category: 'coworking' | 'library';
  // Допустим, у каждого места есть общее количество мест
  totalSlots: number;
}

const allPlaces: Place[] = [
  { id: 'cw1', name: 'Коворкинг "Прогресс" на 4-ом', category: 'coworking', totalSlots: 10 },
  { id: 'cw2', name: 'Коворкинг "Идея" в главном корпусе', category: 'coworking', totalSlots: 15 },
  { id: 'lib1', name: 'Библиотека, читальный зал №1', category: 'library', totalSlots: 20 },
  { id: 'lib2', name: 'Библиотека, компьютерный класс', category: 'library', totalSlots: 8 },
];

const Booking: React.FC = () => {
  const getInitialDateTime = () => {
    const now = new Date();
    const endDateDefault = addHours(now, 2);
    return {
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      endDate: format(endDateDefault, 'yyyy-MM-dd'),
      endTime: format(endDateDefault, 'HH:mm'),
    };
  };

  const [startDate, setStartDate] = useState<string>(getInitialDateTime().date);
  const [startTime, setStartTime] = useState<string>(getInitialDateTime().time);
  const [endDate, setEndDate] = useState<string>(getInitialDateTime().endDate);
  const [endTime, setEndTime] = useState<string>(getInitialDateTime().endTime);

  const [selectedCategory, setSelectedCategory] = useState<'' | 'coworking' | 'library'>('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');

  const [timeSliderValue, setTimeSliderValue] = useState<number>(new Date().getHours()); // Default to current hour
  const [freeSlotsAtSelectedTime, setFreeSlotsAtSelectedTime] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPlaces(allPlaces.filter(p => p.category === selectedCategory));
      setSelectedPlaceId(''); // Reset selected place when category changes
    } else {
      setFilteredPlaces([]);
      setSelectedPlaceId('');
    }
  }, [selectedCategory]);

  // Эффект для имитации обновления свободных мест при изменении слайдера или места
  useEffect(() => {
    if (selectedPlaceId) {
      const place = allPlaces.find(p => p.id === selectedPlaceId);
      if (place) {
        // Имитация: количество свободных мест зависит от времени и общего числа мест
        // Это очень упрощенная логика для примера
        const simulatedFreeSlots = Math.max(0, place.totalSlots - Math.abs(timeSliderValue - 14) - Math.floor(Math.random() * 5));
        setFreeSlotsAtSelectedTime(simulatedFreeSlots);
      } else {
        setFreeSlotsAtSelectedTime(0);
      }
    } else {
      setFreeSlotsAtSelectedTime(0);
    }
  }, [selectedPlaceId, timeSliderValue]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as '' | 'coworking' | 'library');
  };

  const handlePlaceChange = (event: SelectChangeEvent) => {
    setSelectedPlaceId(event.target.value);
  };

  const handleTimeSliderChange = (event: Event, newValue: number | number[]) => {
    setTimeSliderValue(newValue as number);
  };

  const formatSliderLabel = (value: number) => `${value}:00`;

  const handleBooking = async () => {
    if (!startDate || !startTime || !endDate || !endTime || !selectedPlaceId) {
      showSnackbar('Пожалуйста, заполните все поля, включая выбор места', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      console.log('Бронирование:', {
        placeId: selectedPlaceId,
        startTime: startDateTime,
        endTime: endDateTime
      });
      
      showSnackbar('Бронирование успешно создано!', 'success');
      
      setSelectedCategory('');
      setSelectedPlaceId('');
      const initialTimes = getInitialDateTime();
      setStartDate(initialTimes.date);
      setStartTime(initialTimes.time);
      setEndDate(initialTimes.endDate);
      setEndTime(initialTimes.endTime);
      setTimeSliderValue(new Date().getHours());

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
          {/* Date and Time Pickers */}
          <Grid item xs={12} md={3}>
            <TextField label="Дата начала" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Время начала" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Дата окончания" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Время окончания" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>

          {/* Category and Place Selectors */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Тип места</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                label="Тип места"
                onChange={handleCategoryChange}
              >
                <MenuItem value=""><em>Не выбрано</em></MenuItem>
                <MenuItem value="coworking">Коворкинг</MenuItem>
                <MenuItem value="library">Библиотека</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!selectedCategory}>
              <InputLabel id="place-select-label">Конкретное место</InputLabel>
              <Select
                labelId="place-select-label"
                value={selectedPlaceId}
                label="Конкретное место"
                onChange={handlePlaceChange}
                disabled={!selectedCategory || filteredPlaces.length === 0}
              >
                <MenuItem value=""><em>Не выбрано</em></MenuItem>
                {filteredPlaces.map((place) => (
                  <MenuItem key={place.id} value={place.id}>
                    {place.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Time Slider and Availability Info */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
              <Typography gutterBottom>Выберите время для проверки доступности:</Typography>
              <Slider
                value={timeSliderValue}
                onChange={handleTimeSliderChange}
                aria-labelledby="time-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={23}
                valueLabelFormat={formatSliderLabel}
                disabled={!selectedPlaceId} 
              />
              <Typography align="center" sx={{ mt: 1 }}>
                Выбранное время для проверки: {formatSliderLabel(timeSliderValue)}
              </Typography>
              {selectedPlaceId && (
                 <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                    Свободных мест в {formatSliderLabel(timeSliderValue)}: {freeSlotsAtSelectedTime}
                 </Typography>
              )}
            </Box>
          </Grid>
          
          {/* Booking Button */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBooking}
              disabled={!startDate || !startTime || !endDate || !endTime || !selectedPlaceId || isLoading}
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