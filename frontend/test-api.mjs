const API_BASE = 'http://localhost:8080/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} | URL: ${url} | Error: ${errText}`);
  }
  return res.json();
}

async function runCheck() {
  console.log('--- STARTING ELITE VOYAGE END-TO-END CHECK ---');
  
  // 1. Fetch routes
  let routes = await fetchJSON(`${API_BASE}/routes`);
  console.log(`✅ Fetched ${routes.length} existing routes.`);

  // 2. Create Bus
  console.log('\n--- Creating New Luxury Asset (Bus) ---');
  const newBus = await fetchJSON(`${API_BASE}/buses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      busName: 'The Maharaja Express Gold',
      busNumber: `MH-01-ELITE-${Math.floor(Math.random()*10000)}`,
      busType: 'SLEEPER',
      totalSeats: 30,
      operatorName: 'Elite Voyage Corp',
      amenities: 'WiFi, Personal Screen, Concierge'
    })
  });
  console.log(`✅ Created Bus: ${newBus.busName} (ID: ${newBus.id})`);

  // 3. Create Route
  console.log('\n--- Establishing New Route ---');
  const newRoute = await fetchJSON(`${API_BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'Kochi ' + Date.now(),
      destination: 'Trivandrum ' + Date.now(),
      distanceKm: 210,
      estimatedDuration: '4h 15m'
    })
  });
  console.log(`✅ Created Route: ${newRoute.source} -> ${newRoute.destination} (ID: ${newRoute.id})`);

  // 4. Create Schedule
  console.log('\n--- Publishing Voyage Schedule ---');
  const newSchedule = await fetchJSON(`${API_BASE}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      busId: newBus.id,
      routeId: newRoute.id,
      departureTime: '22:00:00',
      arrivalTime: '02:15:00',
      journeyDate: '2026-12-01',
      fare: 2500.00
    })
  });
  console.log(`✅ Scheduled Voyage on ${newSchedule.journeyDate} for ₹${newSchedule.fare} (ID: ${newSchedule.id})`);

  // 5. Register User
  console.log('\n--- Registering Elite Member ---');
  const newUserRes = await fetchJSON(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Vikram Singh ' + Date.now(),
      email: `vikram.elite.${Date.now()}@example.com`,
      password: 'luxury_password',
      phone: '+91' + Math.floor(Math.random()*1000000000)
    })
  });
  console.log(`✅ Registered User: ${newUserRes.fullName} (ID: ${newUserRes.id})`);

  // 6. Create Booking
  console.log('\n--- Reserving First Class Ticket ---');
  const newBooking = await fetchJSON(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': newUserRes.id.toString() },
    body: JSON.stringify({
      scheduleId: newSchedule.id,
      seatNumbers: 'A1, A2',
      seatCount: 2,
      passengerAge: 35,
      passengerGender: 'MALE',
      totalFare: 5000.00
    })
  });
  console.log(`✅ Created Booking Reference #${newBooking.id} with status ${newBooking.status}`);

  // 7. Approve Booking
  console.log('\n--- Admin Approval Process ---');
  const approvedBooking = await fetchJSON(`${API_BASE}/bookings/${newBooking.id}/approve`, {
    method: 'PUT',
    headers: { 'X-User-Id': '1' }
  });
  console.log(`✅ Approved Booking Reference #${approvedBooking.id}! Final Status: ${approvedBooking.status}`);

  console.log('\n🚀 ALL SYSTEMS CHECKED AND FULLY OPERATIONAL 🚀');
}

runCheck().catch(err => {
  console.error("❌ E2E Check Failed:", err.message);
});
