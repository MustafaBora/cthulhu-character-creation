package com.bora.d100.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils
{
    private final Key key;
    private final long expiration ;

    public JwtUtils(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expiration
    )
    {
        this.key = buildKey(secret);
        this.expiration = expiration;
    }

    private Key buildKey(String secret) {
        if (secret == null) secret = "";

        // First try Base64-decoded value if it is long enough
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded != null && decoded.length >= 32) {
                return Keys.hmacShaKeyFor(decoded);
            }
        } catch (IllegalArgumentException ignored) {
            // fall back to hash-based key generation
        }

        // Deterministic 256-bit key derived from the provided secret (even if short/plaintext)
        byte[] utf8 = secret.getBytes(StandardCharsets.UTF_8);
        byte[] digest = sha256(utf8);
        byte[] keyBytes = Arrays.copyOf(digest, 32); // ensure 256 bits
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] sha256(byte[] input) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(input);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public String generateToken(String subject, Map<String, Object> claims)
    {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key)
                .compact();
    }

    public boolean isValid(String token)
    {
        try
        {
            Date expiration = parse(token).getBody().getExpiration();
            return expiration.after(new Date());
        }
        catch (JwtException | IllegalArgumentException e)
        {
            return false;
        }
    }

    public String getSubject(String token)
    {
        return parse(token).getBody().getSubject();
    }

    private Jws<Claims> parse(String token)
    {
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
