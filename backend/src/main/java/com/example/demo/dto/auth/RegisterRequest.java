package com.example.demo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest
{

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;


    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 18, message = "Password must be between 6 and 18 characters")
    private String password;

    @Pattern(regexp = "^$|^[0-9]{10,15}$", message = "Phone number must contain 10 to 15 digits")
    private String phone;
}
