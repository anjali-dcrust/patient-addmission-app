package com.dscribe.patients;

import java.util.List;
import java.util.Map;

/** Single source of truth for the dropdown lists (served to the frontend via /api/options). */
public final class Options {
    private Options() {}
    public static final List<String> GENDERS = List.of("Male", "Female", "Other");
    public static final List<String> WARDS = List.of("General Ward", "ICU", "Emergency", "Maternity", "Pediatrics", "Surgical");
    public static final List<String> DEPARTMENTS = List.of("Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Gynecology");
    public static final List<String> DOCTORS = List.of("Dr. Anil Sharma", "Dr. Priya Nair", "Dr. Rahul Mehta", "Dr. Sneha Iyer", "Dr. Vikram Singh", "Dr. Kavita Rao");
    public static final List<String> STATUSES = List.of("Admitted", "Discharged");

    public static Map<String, List<String>> all() {
        return Map.of("genders", GENDERS, "wards", WARDS, "departments", DEPARTMENTS,
                      "doctors", DOCTORS, "statuses", STATUSES);
    }
}
