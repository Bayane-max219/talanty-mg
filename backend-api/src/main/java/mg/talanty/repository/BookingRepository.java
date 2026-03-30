package mg.talanty.repository;

import mg.talanty.model.Booking;
import mg.talanty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClientOrderByCreatedAtDesc(User client);

    @Query("SELECT b FROM Booking b WHERE b.service.provider = :provider ORDER BY b.createdAt DESC")
    List<Booking> findByServiceProvider(@Param("provider") User provider);

    boolean existsByClientAndServiceAndStatusNot(User client, mg.talanty.model.ServiceOffer service, Booking.Status status);

    long countByStatus(Booking.Status status);
}
