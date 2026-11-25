package com.dscribe.patients;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("""
        SELECT p FROM Patient p
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
          AND (:ward = '' OR p.ward = :ward)
          AND (:department = '' OR p.department = :department)
          AND (:doctor = '' OR p.doctor = :doctor)
          AND (:status = '' OR p.status = :status)
        ORDER BY p.id DESC
        """)
    List<Patient> filter(@Param("search") String search, @Param("ward") String ward,
                         @Param("department") String department, @Param("doctor") String doctor,
                         @Param("status") String status);
}
