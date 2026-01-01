# Logging Configuration for D100 Application

## Overview
Comprehensive DEBUG-level logging has been configured for the D100 Spring Boot application to provide visibility into API requests, XP calculations, and error handling.

## Configuration Files

### application.properties
Located at: `src/main/resources/application.properties`

**Logging Levels:**
```
logging.level.root=INFO
logging.level.com.bora.d100=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

**Log Pattern:**
```
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

## Classes with Added Logging

### 1. D100Application (Startup Logging)
- **File:** `src/main/java/com/bora/d100/D100Application.java`
- **Logs:**
  - "Starting D100 Application..." (on startup)
  - "D100 Application started successfully!" (after successful startup)

### 2. JwtAuthenticationFilter (Request Logging)
- **File:** `src/main/java/com/bora/d100/security/JwtAuthenticationFilter.java`
- **Logs:**
  - HTTP method and URI for all requests
  - Authorization header presence/absence
  - Example: "JwtAuthenticationFilter: GET /players | Authorization: present"

### 3. PlayerController (API Endpoint Logging)
- **File:** `src/main/java/com/bora/d100/controller/PlayerController.java`
- **Logs:**
  - GET /players - retrieving all players
  - GET /players/{id} - retrieving single player
  - POST /players - creating new player with character name
  - PUT /players/{id} - updating player
  - DELETE /players/{id} - deleting player
  - GET /players/rules - serving rules specification

### 4. PlayerService (Business Logic Logging)
- **File:** `src/main/java/com/bora/d100/service/PlayerService.java`
- **Logs:**
  - getAllPlayers() - count of players retrieved
  - getPlayerById(id) - player lookup with ID
  - createPlayer() - character creation with name
  - updatePlayer(id) - character update with ID
  - deletePlayer(id) - character deletion with ID

### 5. CostServiceByUsage (XP Calculation Logging)
- **File:** `src/main/java/com/bora/d100/service/CostServiceByUsage.java`
- **Logs:**
  - XP calculation start: "Calculating XP for player {name} | Received UsedXP: {value}"
  - XP mismatch warning: "XP MISMATCH for {name} | Frontend: {frontend} | Backend calculated: {backend}"
  - XP calculation success: "XP calculation successful for {name} | Total XP: {total} | Remaining: {remaining}"

## Expected Log Output

When creating a character, you should see logs like:

```
2024-01-15 10:23:45 - Starting D100 Application...
2024-01-15 10:23:46 - D100 Application started successfully!
2024-01-15 10:24:12 - JwtAuthenticationFilter: POST /players | Authorization: missing
2024-01-15 10:24:12 - POST /players - creating new player with character name: John Smith
2024-01-15 10:24:12 - PlayerService.createPlayer() - creating character: John Smith
2024-01-15 10:24:12 - Calculating XP for player John Smith | Received UsedXP: 123456
2024-01-15 10:24:12 - XP calculation successful for John Smith | Total XP: 123456 | Remaining: 876544
2024-01-15 10:24:12 - Character created successfully with ID: 42
2024-01-15 10:24:12 - Player created successfully with ID: 42
```

## Troubleshooting with Logs

### If you see "XP MISMATCH":
- The frontend calculated XP doesn't match backend calculation
- Check the Frontend and Backend values in the log message
- Verify all skills are present in CostServiceByUsage.calculateXP()
- Verify skill base values in RulesService

### If API requests aren't showing:
- Check `org.springframework.web=DEBUG` is set in application.properties
- Verify PlayerController logs are appearing
- If no logs at all, check database connection (should see Hibernate logs)

### If database queries aren't visible:
- Set `logging.level.org.hibernate.SQL=DEBUG` or `TRACE` for detailed query information
- Also enable `spring.jpa.properties.hibernate.format_sql=true` for readable SQL

### For CORS issues:
- Set `logging.level.org.springframework.security=DEBUG` (already configured)
- Look for Spring Security CORS preflight request logs
- Check if `https://mustafabora.github.io` appears in allowed origins logs

## Viewing Logs on Render

1. Open Render dashboard
2. Select your service
3. Click "Logs" tab
4. You should see all DEBUG-level logs in real-time
5. Use the search/filter to find specific patterns like "XP MISMATCH" or "POST /players"

## Log Levels Explained

- **TRACE**: Most detailed, shows SQL with bindings
- **DEBUG**: Application logic flow, XP calculations, request details
- **INFO**: General information, application start/stop, player creation (default for root)
- **WARN**: XP mismatches, validation issues
- **ERROR**: Exceptions, database errors, missing players
- **FATAL**: Application shutdown errors

## Performance Note

DEBUG-level logging has minimal performance impact in Spring Boot, especially with file I/O via Render's log aggregation. String concatenation in logs should use proper logger methods (e.g., `logger.info("msg {}: {}", var1, var2)`) but simple concatenation still works for debugging purposes.
