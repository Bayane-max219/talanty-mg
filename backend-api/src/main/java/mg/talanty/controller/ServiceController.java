package mg.talanty.controller;

import lombok.RequiredArgsConstructor;
import mg.talanty.model.ServiceOffer;
import mg.talanty.service.ServiceOfferService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceOfferService serviceOfferService;

    @GetMapping
    public ResponseEntity<Page<ServiceOffer>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(serviceOfferService.search(keyword, pageable));
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(serviceOfferService.getByCategory(
                    ServiceOffer.Category.valueOf(category), pageable));
        }
        return ResponseEntity.ok(serviceOfferService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOffer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceOfferService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceOffer> create(@RequestBody ServiceOffer offer) {
        return ResponseEntity.ok(serviceOfferService.create(offer));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceOffer> update(@PathVariable Long id, @RequestBody ServiceOffer offer) {
        return ResponseEntity.ok(serviceOfferService.update(id, offer));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceOfferService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<ServiceOffer>> getMyServices() {
        return ResponseEntity.ok(serviceOfferService.getMyServices());
    }
}
