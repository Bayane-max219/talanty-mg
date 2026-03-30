package mg.talanty.repository;

import mg.talanty.model.ServiceOffer;
import mg.talanty.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceOfferRepository extends JpaRepository<ServiceOffer, Long> {

    Page<ServiceOffer> findByIsActiveTrue(Pageable pageable);

    Page<ServiceOffer> findByCategoryAndIsActiveTrue(ServiceOffer.Category category, Pageable pageable);

    @Query("SELECT s FROM ServiceOffer s WHERE s.isActive = true AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<ServiceOffer> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<ServiceOffer> findByProvider(User provider);

    long countByIsActiveTrue();
}
