package com.bora.d100.service;

import com.bora.d100.dto.LoginRequestDTO;
import com.bora.d100.dto.LoginResponseDTO;
import com.bora.d100.dto.RegisterRequestDTO;
import com.bora.d100.exception.EmailAlreadyExistsException;
import com.bora.d100.exception.UserNotFoundException;
import com.bora.d100.mapper.UserMapper;
import com.bora.d100.model.Role;
import com.bora.d100.model.User;
import com.bora.d100.repository.UserRepository;
import com.bora.d100.security.JwtUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService
{
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, JwtUtils jwtUtils, BCryptPasswordEncoder passwordEncoder, UserMapper userMapper)
    {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public void register(RegisterRequestDTO dto)
    {
        if (userRepository.existsByEmail(dto.getEmail()))
        {
            throw new EmailAlreadyExistsException(dto.getEmail());
        }

        User user = userMapper.fromRegisterDto(dto);
        user.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public LoginResponseDTO login(LoginRequestDTO dto)
    {
        User user = userRepository.findByEmail(dto.getEmail());

        if (user == null)
        {
            throw new UserNotFoundException(dto.getEmail());
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getHashedPassword()))
        {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(
                user.getEmail(),
                Map.of(
                        "userId", user.getId(),
                        "role", user.getRole().name()
                )
        );

        LoginResponseDTO responseDTO = new LoginResponseDTO();
        responseDTO.setToken(token);
        responseDTO.setUsername(user.getUsername());
        return responseDTO;
    }
}
