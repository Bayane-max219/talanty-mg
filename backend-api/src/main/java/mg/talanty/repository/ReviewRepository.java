package mg.talanty.repository;

import mg.talanty.model.Review;
import mg.talanty.model.ServiceOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.OptionalDouble;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByServiceOrderByCreatedAtDesc(ServiceOffer service);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service = :service")
    Double findAverageRatingByService(@Param("service") ServiceOffer service);

    long countByService(ServiceOffer service);
}
