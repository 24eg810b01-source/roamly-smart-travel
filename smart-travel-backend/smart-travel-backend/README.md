# Smart Travel Management System — Backend

Java 17 + Spring Boot REST API + Spring Data JPA + MySQL.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check that API is running |
| GET | `/api/destinations` | List destinations |
| GET | `/api/destinations?search=jaipur` | Search destinations |
| GET | `/api/destinations?category=Beach` | Filter by category |
| POST | `/api/bookings` | Save a booking in MySQL |
| GET | `/api/bookings` | List saved bookings |
| GET | `/api/bookings/{id}` | Get one booking |
| DELETE | `/api/bookings/{id}` | Delete a booking |

## Requirements
- JDK 17 or newer
- MySQL Server
- VS Code with Java Extension Pack (or another Java IDE)

## 1. Create the database
Open MySQL Workbench or the MySQL command line and run:

```sql
CREATE DATABASE smart_travel_db;
```

## 2. Set database credentials on Windows PowerShell
Run these in the terminal you will use to start Spring Boot (replace the example password with your real MySQL root password):

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
```

Do not commit your real password to GitHub.

## 3. Start the backend
Open this backend folder in VS Code, then run:

```powershell
.\mvnw.cmd spring-boot:run
```

If this ZIP does not include the Maven Wrapper, use an installed Maven command instead:

```powershell
mvn spring-boot:run
```

The first run needs internet access to download Maven dependencies.

## 4. Test the API
Open these URLs in your browser:
- http://localhost:8080/api/health
- http://localhost:8080/api/destinations

To create a booking, use Postman or curl:

```powershell
$body = @{
  travelerName = "Test Traveler"
  email = "traveler@example.com"
  destination = "Jaipur, India"
  startDate = "2027-01-15"
  travelers = 2
  budget = 360
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/bookings" -Method Post -ContentType "application/json" -Body $body
```

List bookings at `http://localhost:8080/api/bookings`.

## Frontend integration note
The React ZIP provided separately currently saves trip requests to browser local storage. It must be updated to send `POST http://localhost:8080/api/bookings` and load destinations from `/api/destinations` before the whole project is truly connected end-to-end.

## Deployment
Deploy this backend as a Java web service on a host that supports Java/Maven builds, and configure `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` as service environment variables. Use a separately hosted MySQL database with a publicly reachable, secured connection. Do not expose database credentials in frontend code.
