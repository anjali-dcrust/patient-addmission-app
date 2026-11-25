package com.dscribe.patients;

import java.time.LocalDate;

public record PatientRequest(String name, Integer age, String gender, String ward,
                             String department, String doctor, LocalDate admissionDate) {}
