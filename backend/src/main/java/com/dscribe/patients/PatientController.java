package com.dscribe.patients;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class PatientController {
    private final PatientRepository repo;
    private final PatientValidator validator;

    public PatientController(PatientRepository repo, PatientValidator validator) {
        this.repo = repo;
        this.validator = validator;
    }

    @GetMapping("/options")
    public Map<String, List<String>> options() { return Options.all(); }

    @GetMapping("/patients")
    public List<Patient> list(@RequestParam(required = false) String search,
                              @RequestParam(required = false) String ward,
                              @RequestParam(required = false) String department,
                              @RequestParam(required = false) String doctor,
                              @RequestParam(required = false) String status) {
        return repo.filter(blank(search), blank(ward), blank(department), blank(doctor), blank(status));
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> create(@RequestBody PatientRequest req) {
        validator.validate(req);
        Patient p = new Patient();
        apply(p, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
    }

    @PutMapping("/patients/{id}")
    public Patient update(@PathVariable Long id, @RequestBody PatientRequest req) {
        validator.validate(req);
        Patient p = find(id);
        apply(p, req);
        return repo.save(p);
    }

    @PatchMapping("/patients/{id}/discharge")
    public Patient discharge(@PathVariable Long id) {
        Patient p = find(id);
        p.setStatus("Discharged");
        return repo.save(p);
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.delete(find(id));
        return ResponseEntity.noContent().build();
    }

    private Patient find(Long id) {
        return repo.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    private void apply(Patient p, PatientRequest r) {
        p.setName(r.name().trim());
        p.setAge(r.age());
        p.setGender(r.gender());
        p.setWard(r.ward());
        p.setDepartment(r.department());
        p.setDoctor(r.doctor());
        p.setAdmissionDate(r.admissionDate());
    }

    private String blank(String s) { return s == null ? "" : s.trim(); }
}
