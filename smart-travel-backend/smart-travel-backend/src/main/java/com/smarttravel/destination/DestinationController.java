package com.smarttravel.destination;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final List<Destination> destinations = List.of(
            new Destination(1L, "Bali, Indonesia", "Indonesia", "Beach", new BigDecimal("420"), "5 days", 4.9,
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
                    "Popular", "Lush rice terraces, turquoise waters and peaceful island escapes."),
            new Destination(2L, "Swiss Alps", "Switzerland", "Mountain", new BigDecimal("890"), "7 days", 4.8,
                    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85",
                    "Scenic", "Snow-dusted peaks, alpine villages and unforgettable train rides."),
            new Destination(3L, "Jaipur, India", "India", "Culture", new BigDecimal("180"), "3 days", 4.7,
                    "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85",
                    "Heritage", "Royal palaces, vibrant bazaars and rich Rajasthani culture."),
            new Destination(4L, "Santorini, Greece", "Greece", "Beach", new BigDecimal("640"), "4 days", 4.9,
                    "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85",
                    "Romantic", "Whitewashed villages, blue domes and golden-hour sea views."),
            new Destination(5L, "Kyoto, Japan", "Japan", "Culture", new BigDecimal("560"), "5 days", 4.8,
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
                    "Must visit", "Quiet shrines, bamboo paths and timeless Japanese traditions."),
            new Destination(6L, "Queenstown, New Zealand", "New Zealand", "Adventure", new BigDecimal("720"), "6 days", 4.8,
                    "https://images.unsplash.com/photo-1589491106922-a8e1f8c6e4f7?auto=format&fit=crop&w=1000&q=85",
                    "Adventure", "Dramatic lakes, mountain trails and outdoor adventures.")
    );

    @GetMapping
    public List<Destination> getDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return destinations.stream()
                .filter(d -> search == null || search.isBlank()
                        || (d.name() + " " + d.country() + " " + d.category())
                        .toLowerCase(Locale.ROOT).contains(search.toLowerCase(Locale.ROOT)))
                .filter(d -> category == null || category.isBlank()
                        || category.equalsIgnoreCase("All places")
                        || d.category().equalsIgnoreCase(category))
                .toList();
    }
}