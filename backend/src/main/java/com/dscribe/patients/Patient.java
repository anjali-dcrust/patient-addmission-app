package com.dscribe.patients;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String ward;
    private String department;
    private String doctor;
    private LocalDate admissionDate;
    private String status = "Admitted";

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public Integer getAge() { return age; }
    public void setAge(Integer v) { age = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { gender = v; }
    public String getWard() { return ward; }
    public void setWard(String v) { ward = v; }
    public String getDepartment() { return department; }
    public void setDepartment(String v) { department = v; }
    public String getDoctor() { return doctor; }
    public void setDoctor(String v) { doctor = v; }
    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate v) { admissionDate = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status = v; }
}
