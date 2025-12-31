Deploy to Render (Docker)

Buildpacks Java is not available; use the provided Dockerfile.

Env vars to set in the Render dashboard:
- SPRING_DATASOURCE_URL: jdbc:postgresql://<host>:5432/<db>
- SPRING_DATASOURCE_USERNAME: <user>
- SPRING_DATASOURCE_PASSWORD: <pass>
- SPRING_PROFILES_ACTIVE: prod

Build: mvn -DskipTests package (handled inside Dockerfile)
Run: java -jar /app/app.jar (handled inside Dockerfile)
Health check: /api/rules

If build fails with "no main manifest attribute", ensure `spring-boot-maven-plugin` repackage goal is present (already added in pom.xml).
