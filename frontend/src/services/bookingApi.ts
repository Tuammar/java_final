import api from './api';

export interface SeatPlace {
  id: string;
  name: string;
}

export interface BookingRequest {
  seatplaceId: string;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  seatplaceId: string;
  startTime: string;
  endTime: string;
  userId: string;
}

// Booking API service
const bookingApi = {
  // Get all available seat places
  getSeats: () => api.get<SeatPlace[]>('/seatplaces'),
  
  // Create a new booking
  createBooking: (data: BookingRequest) => api.post<Booking>('/bookings', data),
  
  // Get user bookings
  getUserBookings: () => api.get<Booking[]>('/bookings/user'),
  
  // Get all bookings (admin only)
  getAllBookings: () => api.get<Booking[]>('/bookings'),
  
  // Delete booking
  deleteBooking: (id: string) => api.delete(`/bookings/${id}`)
};

export default bookingApi; 