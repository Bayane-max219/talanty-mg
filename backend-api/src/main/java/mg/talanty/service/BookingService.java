package mg.talanty.service;

import lombok.RequiredArgsConstructor;
import mg.talanty.model.Booking;
import mg.talanty.model.ServiceOffer;
import mg.talanty.model.User;
import mg.talanty.repository.BookingRepository;
import mg.talanty.repository.ServiceOfferRepository;
import mg.talanty.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ServiceOfferRepository serviceRepo;

    public Booking create(Long serviceId, String clientNote) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User client = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        ServiceOffer service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

        if (service.getProvider().getEmail().equals(email)) {
            throw new RuntimeException("Vous ne pouvez pas réserver votre propre service");
        }

        Booking booking = Booking.builder()
                .client(client)
                .service(service)
                .clientNote(clientNote)
                .status(Booking.Status.PENDING)
                .build();

        return bookingRepo.save(booking);
    }

    public List<Booking> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return bookingRepo.findByClientOrderByCreatedAtDesc(user);
    }

    public List<Booking> getProviderBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User provider = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider non trouvé"));
        return bookingRepo.findByServiceProvider(provider);
    }

    public Booking updateStatus(Long bookingId, Booking.Status newStatus, String providerNote) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking non trouvé"));

        booking.setStatus(newStatus);
        if (providerNote != null) booking.setProviderNote(providerNote);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepo.save(booking);
    }

    public Map<String, Long> getStats() {
        return Map.of(
            "pending", bookingRepo.countByStatus(Booking.Status.PENDING),
            "confirmed", bookingRepo.countByStatus(Booking.Status.CONFIRMED),
            "completed", bookingRepo.countByStatus(Booking.Status.COMPLETED)
        );
    }
}
