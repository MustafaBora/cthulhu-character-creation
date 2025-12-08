package com.bora.d100.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

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
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expiration = expiration;
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
