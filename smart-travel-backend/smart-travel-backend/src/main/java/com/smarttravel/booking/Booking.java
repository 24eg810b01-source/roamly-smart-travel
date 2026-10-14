package com.smarttravel.booking;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(nullable = false, length = 100)
    private String travelerName;

    @NotBlank
    @Email
    @Column(nullable = false, length = 160)
    private String email;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String destination;

    @NotNull
    @FutureOrPresent
    @Column(nullable = false)
    private LocalDate startDate;

    @Min(1)
    @Column(nullable = false)
    private int travelers;

    @NotNull
    @Min(1)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Booking() {}

    @PrePersist
    public void beforeSave() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTravelerName() { return travelerName; }
    public void setTravelerName(String travelerName) { this.travelerName = travelerName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }
    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}