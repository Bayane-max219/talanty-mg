package mg.talanty.controller;

import lombok.RequiredArgsConstructor;
import mg.talanty.model.Booking;
import mg.talanty.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Map<String, Object> body) {
        Long serviceId = Long.valueOf(body.get("serviceId").toString());
        String note = (String) body.get("clientNote");
        return ResponseEntity.ok(bookingService.create(serviceId, note));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    @GetMapping("/provider")
    public ResponseEntity<List<Booking>> getProviderBookings() {
        return ResponseEntity.ok(bookingService.getProviderBookings());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Booking.Status status = Booking.Status.valueOf(body.get("status"));
        String note = body.get("providerNote");
        return ResponseEntity.ok(bookingService.updateStatus(id, status, note));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(bookingService.getStats());
    }
}
