package com.bora.d100.mapper;

import com.bora.d100.dto.RegisterRequestDTO;
import com.bora.d100.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper
{
    public User fromRegisterDto(RegisterRequestDTO dto)
    {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        return user;
    }
}
