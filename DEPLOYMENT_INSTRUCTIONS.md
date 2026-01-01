# Deployment Instructions for Render

## Current Status

✅ **Completed:**
- CORS configuration for GitHub Pages frontend
- Comprehensive DEBUG logging
- Spring Boot application configured
- render.yaml blueprint with all environment variables
- Docker multi-stage build setup
- JWT key derivation with fallback for short secrets
- All 60+ skills included in XP calculations

## Pre-Deployment Checklist

Before pushing to GitHub and triggering Render deployment:

- [ ] Commit all changes locally:
  ```bash
  cd c:\workspace\d100
  git add -A
  git commit -m "Add CORS for GitHub Pages frontend and comprehensive logging configuration"
  ```

- [ ] Verify pom.xml is valid and has spring-boot-maven-plugin configured

- [ ] Check that Dockerfile exists and is correct

- [ ] Verify render.yaml blueprint has all environment variables:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME` 
  - `SPRING_DATASOURCE_PASSWORD`
  - `SPRING_PROFILES_ACTIVE` (set to "prod")
  - `APP_JWT_SECRET`

## Deployment Steps

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Trigger Render Deployment

**Option A - Automatic (if connected):**
- Render automatically detects push and deploys if connected to your GitHub repo
- Watch the deployment logs in Render dashboard

**Option B - Manual Redeploy:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your D100 service
3. Click "Redeploy latest commit" or "Deploy"
4. Monitor the build progress

### Step 3: Monitor Build Logs

In Render dashboard, you should see:

**Build Phase (Docker build):**
```
Building D100 application...
Running maven build
[INFO] Building d100 4.0.0
[INFO] Downloading dependencies...
[INFO] BUILD SUCCESS
Creating runtime Docker image...
Image successfully built
```

**Runtime Phase (Application startup):**
```
Starting D100 Application...
Hibernate: create table player (...)
Hibernate: create table user (...)
D100 Application started successfully!
```

### Step 4: Verify Health Check

Once deployed, check if the service is healthy by visiting:
```
https://your-service-name.onrender.com/api/rules
```

Should return JSON with the rules specification.

If you see a 500 error, check logs for:
- Database connection errors
- JWT key generation errors
- Datasource configuration errors

## Troubleshooting During Deployment

### Build Fails with Maven Errors
- **Check:** pom.xml is properly formatted
- **Look for:** Nested `<build>` inside `<licenses>` 
- **Fix:** Ensure dependencies and build sections are at root level

### Build Succeeds but App Won't Start
- **Check logs for:** "Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory'"
- **Cause:** Missing SPRING_DATASOURCE_URL environment variable
- **Fix:** Verify all 5 env vars are set in Render service settings (or in render.yaml)

### Database Connection Fails
```
Connection refused: no further information
```
- **Check:** PostgreSQL hostname is correct: `dpg-d5ai6mer433s738e5rdg-a.frankfurt-postgres.render.com`
- **Check:** Credentials are correct
- **Check:** JDBC URL includes `?sslmode=require`

### WeakKeyException for JWT
```
The specified key byte array is 48 bits which is not secure enough
```
- **Cause:** APP_JWT_SECRET too short or not Base64
- **Fix:** Already fixed in code with SHA-256 fallback, but check it's actually deployed

## Testing After Deployment

### Test 1: Health Check (Rules Endpoint)
```bash
curl https://your-service.onrender.com/api/rules
```

### Test 2: CORS Check
From your frontend at `https://mustafabora.github.io/call-of-cthulhu-homebrew-ui/`:

Open DevTools → Network tab → Try creating a character

Should see:
- ✅ OPTIONS request (CORS preflight) - Status 200
- ✅ POST request - Status 201
- ❌ No CORS errors in console

### Test 3: Character Creation
POST to `https://your-service.onrender.com/players`

With body:
```json
{
  "name": "Test Character",
  "APP": 60,
  "BRV": 70,
  "usedXP": 0,
  "totalXP": 1000000
}
```

Should return:
- Status 201
- Player object with ID

### Test 4: Check Logs for Our Debug Messages
In Render logs, search for:
- "POST /players - creating new player"
- "Calculating XP"
- "XP calculation successful"

If you see these, logging is working!

## Common Issues and Solutions

| Issue | Logs Show | Solution |
|-------|-----------|----------|
| CORS blocks requests | No "Access-Control-Allow-Origin" header | Check SecurityConfig allows frontend URL |
| Database not connecting | "Cannot resolve reference to bean" | Verify SPRING_DATASOURCE_* env vars |
| JWT fails | "WeakKeyException" | Already fixed, but redeploy if needed |
| Logs not appearing | No debug output | Check application.properties logging config is deployed |
| Character creation fails | "XP MISMATCH" | Check all skills in CostServiceByUsage.calculateXP |

## Monitoring Commands

### View Recent Logs (last 100 lines)
Use Render dashboard Logs tab, or with API:
```bash
curl -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  https://api.render.com/v1/services/YOUR_SERVICE_ID/logs
```

### Restart Service
```bash
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.render.com/v1/services/YOUR_SERVICE_ID/restart
```

## Environment Variables Reference

These must be set in Render service settings:

| Variable | Value | Notes |
|----------|-------|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://dpg-d5ai6mer433s738e5rdg-a.frankfurt-postgres.render.com:5432/cthulhu?sslmode=require` | Full JDBC URL with SSL |
| `SPRING_DATASOURCE_USERNAME` | `cthulhu_user` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `seYct7kVsVl0e71W9CECPhz4xNxjaxR3` | Database password |
| `SPRING_PROFILES_ACTIVE` | `prod` | Production profile |
| `APP_JWT_SECRET` | Long random string (min 32 chars) | JWT signing key |
| `PORT` | `8080` | Spring Boot port (Render will override) |

## After Successful Deployment

1. ✅ Share the backend URL with frontend developers
2. ✅ Test character creation from GitHub Pages frontend
3. ✅ Monitor logs for errors over next 24 hours
4. ✅ If XP mismatches occur, check logs for skill name mismatches
5. ✅ Document the deployment for future reference

---

**Need Help?**

If deployment fails:
1. Check Render logs for specific error message
2. Verify environment variables are set
3. Ensure GitHub push was successful
4. Check database credentials are correct
5. Review application.properties for typos
