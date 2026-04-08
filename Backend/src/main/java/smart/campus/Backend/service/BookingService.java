package smart.campus.Backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.campus.Backend.dto.BookingDto;
import smart.campus.Backend.entity.Booking;
import smart.campus.Backend.entity.Resource;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.BookingStatus;
import smart.campus.Backend.exception.ConflictException;
import smart.campus.Backend.exception.ResourceNotFoundException;
import smart.campus.Backend.repository.BookingRepository;
import smart.campus.Backend.repository.ResourceRepository;
import smart.campus.Backend.repository.UserRepository;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public Booking createBooking(Long userId, BookingDto dto) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Conflict checking: Any PENDING or APPROVED booking overlapping?
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resource.getId(), dto.getStartTime(), dto.getEndTime(), activeStatuses);
        
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked during this time period.");
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .user(user)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(BookingStatus.PENDING) // Default status according to rubrics
                .purpose(dto.getPurpose())
                .build();
        
        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }
}
