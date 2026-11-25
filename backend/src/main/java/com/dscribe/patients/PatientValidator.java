package com.dscribe.patients;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class PatientValidator {
    private static final Pattern LETTERS_ONLY = Pattern.compile("^[A-Za-z]+( [A-Za-z]+)*$");
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    public void validate(PatientRequest r) {
        Map<String, String> e = new LinkedHashMap<>();

        if (r.name() == null || r.name().isBlank()) e.put("name", "Name is required");
        else if (!LETTERS_ONLY.matcher(r.name().trim()).matches()) e.put("name", "Name must contain letters only");

        if (r.age() == null) e.put("age", "Age is required");
        else if (r.age() < 0 || r.age() > 120) e.put("age", "Age must be between 0 and 120");

        pick(e, "gender", "Gender", r.gender(), Options.GENDERS);
        pick(e, "ward", "Ward", r.ward(), Options.WARDS);
        pick(e, "department", "Department", r.department(), Options.DEPARTMENTS);
        pick(e, "doctor", "Doctor", r.doctor(), Options.DOCTORS);

        if (r.admissionDate() == null) e.put("admissionDate", "Admission date is required");
        else if (r.admissionDate().isAfter(LocalDate.now(IST))) e.put("admissionDate", "Admission date cannot be in the future");

        if (!e.isEmpty()) throw new ValidationException(e);
    }

    private void pick(Map<String, String> e, String key, String label, String value, List<String> allowed) {
        if (value == null || value.isBlank()) e.put(key, label + " is required");
        else if (!allowed.contains(value)) e.put(key, label + " must be one of: " + String.join(", ", allowed));
    }
}
