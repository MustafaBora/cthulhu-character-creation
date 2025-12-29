package com.bora.d100.security;


import java.io.IOException;

import org.springframework.stereotype.Component;

import com.bora.d100.repository.UserRepository;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtAuthenticationFilter implements Filter
{
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserRepository userRepository)
    {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException
    {
        HttpServletRequest request = (HttpServletRequest) req;
        String header = request.getHeader("Authorization");
        // Temporarily skip JWT validation while frontend login is disabled
        // if (header != null && header.startsWith("Bearer "))
        // {
        //     String token = header.substring(7);
        //
        //     if (jwtUtils.isValid(token))
        //     {
        //         String email = jwtUtils.getSubject(token);
        //         User user = userRepository.findByEmail(email);
        //
        //         if (user != null)
        //         {
        //             // Build Spring Security authority from user's role
        //             var authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        //
        //             // Store authenticated user in Spring Security context
        //             UsernamePasswordAuthenticationToken auth =
        //                     new UsernamePasswordAuthenticationToken(
        //                             user,
        //                             null,
        //                             List.of(authority)
        //                     );
        //
        //             SecurityContextHolder.getContext().setAuthentication(auth);
        //         }
        //     }
        // }

        chain.doFilter(req, res);
    }
}
