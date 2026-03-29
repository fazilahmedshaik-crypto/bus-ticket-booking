package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.enums.BookingStatus;
import com.example.demo.enums.BusType;
import com.example.demo.enums.Role;
import com.example.demo.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, BusRepository busRepository,
                           RouteRepository routeRepository, ScheduleRepository scheduleRepository,
                           BookingRepository bookingRepository,
                           org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("========== DATA INITIALIZATION START ==========");
        if (userRepository.count() == 0) seedUsers();
        if (routeRepository.count() == 0) seedData();
        log.info("========== DATA INITIALIZATION COMPLETE ==========");
    }

    private void seedUsers() {
        userRepository.save(User.builder().fullName("Admin User").email("admin@busbook.com").password(passwordEncoder.encode("admin123")).phone("9999999999").role(Role.ADMIN).build());
        userRepository.save(User.builder().fullName("John Doe").email("john@example.com").password(passwordEncoder.encode("user123")).phone("8888888888").role(Role.USER).build());
        userRepository.save(User.builder().fullName("Priya Sharma").email("priya@example.com").password(passwordEncoder.encode("user123")).phone("7777777777").role(Role.USER).build());
        userRepository.save(User.builder().fullName("Ravi Kumar").email("ravi@example.com").password(passwordEncoder.encode("user123")).phone("6666666666").role(Role.USER).build());
    }

    private void seedData() {
        User john = userRepository.findByEmail("john@example.com").orElse(null);
        LocalDate today = LocalDate.now();
        Random random = new Random();

        // --- BUS FLEET (30+ PREMIUM BUSES) ---
        List<Bus> fleet = new ArrayList<>();
        fleet.add(sv(bus("Airavat Gold Class", "KA-01-F-1111", BusType.AC, 40, "KSRTC", "WiFi, AC, Blanket, Water")));
        fleet.add(sv(bus("Ambaari Utsav", "KA-01-F-2222", BusType.SLEEPER, 30, "KSRTC", "Lux Sleeper, AC, Blanket, Snack")));
        fleet.add(sv(bus("GreenLine Scania", "KA-05-GL-3333", BusType.AC, 45, "GreenLine", "Eco-Friendly, AC, WiFi, Snacks")));
        fleet.add(sv(bus("GreenLine Sleeper", "KA-05-GL-4444", BusType.SLEEPER, 32, "GreenLine", "Eco-Friendly, AC, Blanket")));
        fleet.add(sv(bus("Intercity SmartBus", "MH-01-IC-5555", BusType.AC, 40, "IntrCity", "AI Monitoring, WiFi, Snacks")));
        fleet.add(sv(bus("VRL Multi-Axle", "KA-25-V-6666", BusType.AC, 48, "VRL Travels", "Smooth Ride, AC, WiFi")));
        fleet.add(sv(bus("VRL Sleeper", "KA-25-V-7777", BusType.SLEEPER, 30, "VRL Travels", "Semi-Sleeper, Blanket, USB")));
        fleet.add(sv(bus("Orange Scania", "TS-09-O-8888", BusType.AC, 44, "Orange Travels", "Premium AC, Snacks, Water")));
        fleet.add(sv(bus("Orange Grand", "TS-09-O-9999", BusType.SLEEPER, 30, "Orange Travels", "AC Sleeper, GPS, Blanket")));
        fleet.add(sv(bus("Parveen Classic", "TN-01-P-1234", BusType.AC, 45, "Parveen Travels", "AC, Recliner, WiFi")));
        fleet.add(sv(bus("Parveen Sleeper", "TN-01-P-5678", BusType.SLEEPER, 30, "Parveen Travels", "AC Sleeper, Clean Linens")));
        fleet.add(sv(bus("Zingbus Platinum", "DL-01-Z-1111", BusType.AC, 40, "Zingbus", "WiFi, AC, Blanket, Snacks")));
        fleet.add(sv(bus("Zingbus Gold", "DL-01-Z-2222", BusType.SEMI_SLEEPER, 42, "Zingbus", "AC, Recliner, USB Port")));
        fleet.add(sv(bus("SRS Star Class", "KA-51-S-3333", BusType.AC, 45, "SRS Travels", "WiFi, AC, Water Bottle")));
        fleet.add(sv(bus("SRS Premium", "KA-51-S-4444", BusType.SLEEPER, 30, "SRS Travels", "AC Sleeper, Blanket, USB")));
        fleet.add(sv(bus("Paulo Grand", "GA-01-P-5555", BusType.SLEEPER, 28, "Paulo Travels", "Luxury Sleeper, Snacks, WiFi")));
        fleet.add(sv(bus("Hans Volvo", "MP-09-H-6666", BusType.AC, 40, "Hans Travels", "Volvo B11R, AC, Snacks")));
        fleet.add(sv(bus("BigBus Deluxe", "MH-43-B-7777", BusType.NON_AC, 50, "BigBus", "Value Seater, Fan, Charging")));
        fleet.add(sv(bus("Shivshahi AC", "MH-01-SS-8888", BusType.AC, 40, "MSRTC", "State Luxury, AC, Recliner")));
        fleet.add(sv(bus("National Express", "DL-01-NE-9999", BusType.SLEEPER, 32, "National", "AC Sleeper, WiFi, GPS")));
        fleet.add(sv(bus("KPN Premium", "TN-02-K-1111", BusType.AC, 45, "KPN Travels", "AC, Snacks, Water Bottle")));
        fleet.add(sv(bus("Jabbar Travels", "KA-01-J-2222", BusType.SLEEPER, 30, "Jabbar Travels", "AC Sleeper, Blanket, USB")));
        fleet.add(sv(bus("Kallada G4", "KL-01-K-3333", BusType.AC, 45, "Kallada Travels", "Scania G410, AC, WiFi")));
        fleet.add(sv(bus("Evacay Travels", "KA-01-E-4444", BusType.SLEEPER, 20, "Evacay Travels", "Super Luxury, Meals, WiFi")));
        fleet.add(sv(bus("SeaBird Volvo", "KA-01-S-5555", BusType.AC, 40, "SeaBird Travels", "AC, WiFi, Water Bottle")));
        fleet.add(sv(bus("Shyamoli Paribahan","WB-01-S-6666", BusType.AC, 45, "Shyamoli", "Cross-Border Luxury, AC")));
        fleet.add(sv(bus("Royal Cruiser", "UP-32-R-7777", BusType.SLEEPER, 30, "Royal Cruiser", "VIP Sleeper, Snacks, WiFi")));
        fleet.add(sv(bus("Safar Travels", "MH-01-S-8888", BusType.NON_AC, 55, "Safar", "Economy Seater, Fan")));
        fleet.add(sv(bus("Golden Era", "DL-01-G-9999", BusType.AC, 40, "Golden Era", "Vintage Premium, AC, WiFi")));
        fleet.add(sv(bus("Zatka Travels", "MH-12-Z-0000", BusType.AC, 45, "Zatka", "High Speed, AC, Snacks")));

        // --- ROUTES (ENHANCED VARIETY: 40+ MAJOR ROUTES) ---
        // North
        Route delJai = sv(route("Delhi", "Jaipur", 280, "5h 30m"));
        Route jaiDel = sv(route("Jaipur", "Delhi", 280, "5h 30m"));
        Route delAgr = sv(route("Delhi", "Agra", 230, "4h 00m"));
        Route agrDel = sv(route("Agra", "Delhi", 230, "4h 00m"));
        Route delLuc = sv(route("Delhi", "Lucknow", 550, "9h 30m"));
        Route lucDel = sv(route("Lucknow", "Delhi", 550, "9h 30m"));
        Route delCha = sv(route("Delhi", "Chandigarh", 250, "5h 00m"));
        Route chaDel = sv(route("Chandigarh", "Delhi", 250, "5h 00m"));
        
        // South
        Route blrChe = sv(route("Bangalore", "Chennai", 350, "6h 30m"));
        Route cheBlr = sv(route("Chennai", "Bangalore", 350, "6h 30m"));
        Route blrHyd = sv(route("Bangalore", "Hyderabad", 570, "9h 00m"));
        Route hydBlr = sv(route("Hyderabad", "Bangalore", 570, "9h 00m"));
        Route blrKoc = sv(route("Bangalore", "Kochi", 550, "10h 00m"));
        Route kocBlr = sv(route("Kochi", "Bangalore", 550, "10h 00m"));
        Route blrMys = sv(route("Bangalore", "Mysore", 150, "3h 30m"));
        Route mysBlr = sv(route("Mysore", "Bangalore", 150, "3h 30m"));
        Route cheHyd = sv(route("Chennai", "Hyderabad", 630, "11h 30m"));
        Route hydChe = sv(route("Hyderabad", "Chennai", 630, "11h 30m"));
        
        // West
        Route mumPun = sv(route("Mumbai", "Pune", 150, "3h 00m"));
        Route punMum = sv(route("Pune", "Mumbai", 150, "3h 00m"));
        Route mumGoa = sv(route("Mumbai", "Goa", 590, "10h 00m"));
        Route goaMum = sv(route("Goa", "Mumbai", 590, "10h 00m"));
        Route mumSur = sv(route("Mumbai", "Surat", 280, "5h 00m"));
        Route surMum = sv(route("Surat", "Mumbai", 280, "5h 00m"));
        Route mumAhm = sv(route("Mumbai", "Ahmedabad", 530, "9h 30m"));
        Route ahmMum = sv(route("Ahmedabad", "Mumbai", 530, "9h 30m"));
        Route punHyd = sv(route("Pune", "Hyderabad", 560, "11h 00m"));
        Route hydPun = sv(route("Hyderabad", "Pune", 560, "11h 00m"));
        
        // Central
        Route indBho = sv(route("Indore", "Bhopal", 195, "4h 00m"));
        Route bhoInd = sv(route("Bhopal", "Indore", 195, "4h 00m"));
        Route nagInd = sv(route("Nagpur", "Indore", 450, "8h 30m"));
        Route indNag = sv(route("Indore", "Nagpur", 450, "8h 30m"));
        Route nagPun = sv(route("Nagpur", "Pune", 720, "12h 00m"));
        Route punNag = sv(route("Pune", "Nagpur", 720, "12h 00m"));
        
        // Major Long Distance
        Route delMum = sv(route("Delhi", "Mumbai", 1400, "24h 00m"));
        Route mumDel = sv(route("Mumbai", "Delhi", 1400, "24h 00m"));
        Route blrMum = sv(route("Bangalore", "Mumbai", 980, "16h 00m"));
        Route mumBlr = sv(route("Mumbai", "Bangalore", 980, "16h 00m"));

        List<Route> routes = List.of(
            delJai, jaiDel, delAgr, agrDel, delLuc, lucDel, delCha, chaDel,
            blrChe, cheBlr, blrHyd, hydBlr, blrKoc, kocBlr, blrMys, mysBlr, cheHyd, hydChe,
            mumPun, punMum, mumGoa, goaMum, mumSur, surMum, mumAhm, ahmMum, punHyd, hydPun,
            indBho, bhoInd, nagInd, indNag, nagPun, punNag, delMum, mumDel, blrMum, mumBlr
        );

        // --- SCHEDULES (7 DAYS, HIGH DENSITY) ---
        for (int d = 0; d < 7; d++) {
            LocalDate date = today.plusDays(d);
            for (Route r : routes) {
                // Add 8-12 schedules per route per day
                int numSchedules = 8 + random.nextInt(5);
                for (int i = 0; i < numSchedules; i++) {
                    Bus b = fleet.get(random.nextInt(fleet.size()));
                    int hour = (6 + (i * 2) + random.nextInt(3)) % 24;
                    int minute = (random.nextInt(4)) * 15;
                    double baseFare = (r.getDistanceKm() * 1.5) + (b.getBusType() == BusType.SLEEPER ? 400 : 200);
                    baseFare += (hour < 6 || hour > 20) ? 150 : 0; // Night surcharge
                    
                    sc(b, r, date, hour, minute, (hour + 6) % 24, minute, (int)baseFare);
                }
            }
        }

        // --- Demo Bookings (Realistic Activity) ---
        if (routeRepository.count() > 0) {
            User johnUser = userRepository.findByEmail("john@example.com").orElse(null);
            User priyaUser = userRepository.findByEmail("priya@example.com").orElse(null);
            User raviUser = userRepository.findByEmail("ravi@example.com").orElse(null);
            
            List<Schedule> allSchedules = scheduleRepository.findAll();
            if (allSchedules.size() >= 15 && johnUser != null) {
                // John's Bookings
                bookingRepository.save(sdBooking(johnUser, allSchedules.get(0), 2, "John Doe", "8888888888", "john@example.com"));
                bookingRepository.save(sdBooking(johnUser, allSchedules.get(5), 1, "John Doe", "8888888888", "john@example.com"));
                
                // Priya's Bookings
                bookingRepository.save(sdBooking(priyaUser, allSchedules.get(1), 3, "Priya Sharma", "7777777777", "priya@example.com"));
                bookingRepository.save(sdBooking(priyaUser, allSchedules.get(8), 2, "Priya Sharma", "7777777777", "priya@example.com"));
                
                // Ravi's Bookings
                bookingRepository.save(sdBooking(raviUser, allSchedules.get(2), 2, "Ravi Kumar", "6666666666", "ravi@example.com"));
                bookingRepository.save(sdBooking(raviUser, allSchedules.get(12), 4, "Ravi Kumar", "6666666666", "ravi@example.com"));
            }
        }
    }

    private Booking sdBooking(User u, Schedule s, int count, String name, String ph, String em) {
        return Booking.builder()
            .user(u).schedule(s).seatCount(count).totalFare(s.getFare() * count)
            .status(BookingStatus.CONFIRMED).passengerName(name)
            .passengerPhone(ph).passengerEmail(em)
            .bookingTime(LocalDateTime.now()).build();
    }

    private Bus sv(Bus b)   { return busRepository.save(b); }
    private Route sv(Route r) { return routeRepository.save(r); }

    private Bus bus(String name, String no, BusType type, int seats, String op, String amen) {
        return Bus.builder().busName(name).busNumber(no).busType(type)
                .totalSeats(seats).operatorName(op).amenities(amen).build();
    }

    private Route route(String src, String dst, double km, String dur) {
        return Route.builder().source(src).destination(dst).distanceKm(km).estimatedDuration(dur).build();
    }

    private void sc(Bus b, Route r, LocalDate d, int dH, int dM, int aH, int aM, double fare) {
        scheduleRepository.save(Schedule.builder()
            .bus(b).route(r).journeyDate(d)
            .departureTime(LocalTime.of(dH, dM)).arrivalTime(LocalTime.of(aH, aM))
            .fare(fare).availableSeats(b.getTotalSeats()).active(true).build());
    }
}
