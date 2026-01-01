# Quick Start: Deploy and Test the D100 Application

## 🚀 One-Command Deployment

After all configuration is complete, deploy with:

```bash
cd c:\workspace\d100
git add -A
git commit -m "CORS for GitHub Pages + comprehensive logging"
git push origin main
```

Then in Render dashboard: Click "Redeploy" on your D100 service.

---

## ✅ Verification Checklist (Post-Deployment)

### Step 1: Check Server Health (5 min after deployment)
```
Visit: https://your-service.onrender.com/api/rules

Expected: JSON response with game rules
If error: Check Render logs for startup issues
```

### Step 2: Check Logs for Startup Messages (Render Dashboard)
Look for these lines in Render logs:
```
✅ "Starting D100 Application..."
✅ "D100 Application started successfully!"
```

If missing: Application didn't start. Check full logs for errors.

### Step 3: Test GitHub Pages Frontend
1. Open: `https://mustafabora.github.io/call-of-cthulhu-homebrew-ui/`
2. Open browser DevTools (F12)
3. Click "Create New Character"
4. Fill in the form and submit

**Check Network Tab:**
- ✅ OPTIONS request → Status 200 (CORS preflight)
- ✅ POST request → Status 201 (Character created)
- ❌ No CORS errors in console

### Step 4: Monitor Logs for XP Calculation
In Render logs, search for these patterns:

**For Successful Creation:**
```
POST /players - creating new player with character name: [name]
Calculating XP for player [name] | Received UsedXP: [value]
XP calculation successful for [name] | Total XP: [value] | Remaining: [value]
Character created successfully with ID: [id]
```

**For XP Mismatch (ERROR):**
```
XP MISMATCH for [name] | Frontend: [value] | Backend calculated: [different_value]
```

---

## 🔍 Troubleshooting Guide

### Problem: "No 'Access-Control-Allow-Origin' header"
**Symptom:** CORS error in browser console when creating character
**Cause:** CORS not configured for GitHub Pages
**Check:** Is `https://mustafabora.github.io` in SecurityConfig.java?
**Fix:** 
1. Add to allowedOrigins
2. Redeploy
3. Clear browser cache (Ctrl+Shift+Delete)

### Problem: Character creation returns 500
**Symptom:** POST /players returns status 500
**Check Logs For:**
- "XP MISMATCH" → Skill calculation mismatch (check CostServiceByUsage)
- "Cannot resolve reference to bean" → Database connection (check env vars)
- "WeakKeyException" → JWT key too short (already fixed in code)

### Problem: Logs not showing DEBUG messages
**Symptom:** Only INFO level messages in Render logs
**Check:**
1. application.properties has `logging.level.com.bora.d100=DEBUG`? 
2. Was the new version deployed? (check deployment finished)
3. Is service running the latest code? (check git hash in logs)

### Problem: Database connection fails
**Symptom:** Logs show "Cannot connect to database"
**Check Environment Variables in Render:**
- ✅ SPRING_DATASOURCE_URL = `jdbc:postgresql://dpg-d5ai6mer433s738e5rdg-a.frankfurt-postgres.render.com:5432/cthulhu?sslmode=require`
- ✅ SPRING_DATASOURCE_USERNAME = `cthulhu_user`
- ✅ SPRING_DATASOURCE_PASSWORD = `seYct7kVsVl0e71W9CECPhz4xNxjaxR3`
- ✅ SPRING_PROFILES_ACTIVE = `prod`

---

## 📊 Expected Log Timeline

### Deployment Starts
```
Building Docker image...
Running Maven build...
[INFO] BUILD SUCCESS
Creating runtime image...
Image ready for deployment
```

### Application Starts
```
Started D100Application in X seconds
Starting D100 Application...
D100 Application started successfully!
[Ready for requests]
```

### First Character Creation (from GitHub Pages)
```
JwtAuthenticationFilter: OPTIONS /players | Authorization: missing
JwtAuthenticationFilter: POST /players | Authorization: missing
POST /players - creating new player with character name: John Smith
PlayerService.createPlayer() - creating character: John Smith
Calculating XP for player John Smith | Received UsedXP: 91520
XP calculation successful for John Smith | Total XP: 91520 | Remaining: 908480
Character created successfully with ID: 1
Player created successfully with ID: 1
```

---

## 🛠️ Manual Testing Commands

### Test 1: Rules Endpoint
```bash
curl https://your-service.onrender.com/api/rules
```

**Expected:** Returns JSON with:
- Characteristics (APP, BRV, STA, etc.)
- Skills (Accounting, Animal Handling, etc.)
- Base values for each
- Costs for improvements
- Penalty thresholds

### Test 2: Create Character (via cURL)
```bash
curl -X POST https://your-service.onrender.com/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Character",
    "APP": 60,
    "BRV": 70,
    "STA": 75,
    "usedXP": 0,
    "totalXP": 1000000
  }'
```

**Expected:** Status 201, returns Player object with ID

### Test 3: Get All Characters
```bash
curl https://your-service.onrender.com/players
```

**Expected:** Returns array of Player objects

---

## 📋 Configuration Summary

### Files Modified:
1. ✅ `src/main/java/com/bora/d100/security/SecurityConfig.java` - Added GitHub Pages to CORS
2. ✅ `src/main/resources/application.properties` - Added DEBUG logging
3. ✅ `src/main/java/com/bora/d100/D100Application.java` - Added startup logs
4. ✅ `src/main/java/com/bora/d100/security/JwtAuthenticationFilter.java` - Request logging
5. ✅ `src/main/java/com/bora/d100/controller/PlayerController.java` - Endpoint logging
6. ✅ `src/main/java/com/bora/d100/service/PlayerService.java` - Service logging
7. ✅ `src/main/java/com/bora/d100/service/CostServiceByUsage.java` - XP calculation logging

### Environment Variables (Render):
1. ✅ SPRING_DATASOURCE_URL
2. ✅ SPRING_DATASOURCE_USERNAME
3. ✅ SPRING_DATASOURCE_PASSWORD
4. ✅ SPRING_PROFILES_ACTIVE=prod
5. ✅ APP_JWT_SECRET

### Features Enabled:
- ✅ GitHub Pages frontend can create characters
- ✅ CORS handling for preflight requests
- ✅ DEBUG logging for all operations
- ✅ XP mismatch detection and reporting
- ✅ Database query logging
- ✅ Request/response logging

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Health check returns rules JSON
2. ✅ Browser shows no CORS errors when creating character
3. ✅ Render logs show "D100 Application started successfully!"
4. ✅ Character creation returns ID (status 201)
5. ✅ Render logs show XP calculation messages
6. ✅ GitHub Pages frontend loads character data

If all checks pass: **Deployment is complete and working!**

---

## 🆘 Need Help?

**If deployment fails:**
1. Check Render logs for specific error
2. Verify environment variables are set
3. Ensure latest code is pushed to GitHub
4. Check database credentials
5. Review application.properties for typos

**For CORS issues:**
1. Verify frontend URL in SecurityConfig
2. Check browser console for exact error
3. Ensure OPTIONS method is allowed
4. Clear browser cache

**For XP calculation mismatches:**
1. Check Render logs for "XP MISMATCH" message
2. Note Frontend vs Backend values
3. Verify CostServiceByUsage has all skills
4. Check RulesService has correct costs

---

## 📚 Additional Documentation

- `LOGGING_CONFIGURATION.md` - Detailed logging setup
- `CORS_AND_LOGGING_SETUP.md` - Configuration details and examples
- `DEPLOYMENT_INSTRUCTIONS.md` - Full deployment guide
- `IMPLEMENTATION_SUMMARY_CORS_LOGGING.md` - Implementation overview

---

**Status:** ✅ Ready to Deploy

All configuration complete. Push to GitHub and deploy to Render!
