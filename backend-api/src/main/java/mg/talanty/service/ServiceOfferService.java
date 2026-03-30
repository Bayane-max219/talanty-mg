package mg.talanty.service;

import lombok.RequiredArgsConstructor;
import mg.talanty.model.ServiceOffer;
import mg.talanty.model.User;
import mg.talanty.repository.ServiceOfferRepository;
import mg.talanty.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceOfferService {

    private final ServiceOfferRepository serviceRepo;
    private final UserRepository userRepo;

    public Page<ServiceOffer> getAll(Pageable pageable) {
        return serviceRepo.findByIsActiveTrue(pageable);
    }

    public Page<ServiceOffer> getByCategory(ServiceOffer.Category category, Pageable pageable) {
        return serviceRepo.findByCategoryAndIsActiveTrue(category, pageable);
    }

    public Page<ServiceOffer> search(String keyword, Pageable pageable) {
        return serviceRepo.searchByKeyword(keyword, pageable);
    }

    public ServiceOffer getById(Long id) {
        return serviceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));
    }

    public ServiceOffer create(ServiceOffer offer) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User provider = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider non trouvé"));
        offer.setProvider(provider);
        return serviceRepo.save(offer);
    }

    public ServiceOffer update(Long id, ServiceOffer updated) {
        ServiceOffer existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setDeliveryDays(updated.getDeliveryDays());
        existing.setImageUrl(updated.getImageUrl());
        return serviceRepo.save(existing);
    }

    public void delete(Long id) {
        ServiceOffer offer = getById(id);
        offer.setIsActive(false);
        serviceRepo.save(offer);
    }

    public List<ServiceOffer> getMyServices() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User provider = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Provider non trouvé"));
        return serviceRepo.findByProvider(provider);
    }

    public long countActive() {
        return serviceRepo.countByIsActiveTrue();
    }
}
