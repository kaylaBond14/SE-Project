package com.cinema.backend.factory;

import org.springframework.stereotype.Service;

import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.model.User;

/*
 * This class is part of our implemnetation of the Factory Design Pattern.
 * We are using the Simple Factory Idiom instead of a full implementation of the Factory Method Pattern
 */
@Service
public class UserFactory {

    private final ConcreteUserFactory factory;

    public UserFactory(ConcreteUserFactory factory) {
        this.factory = factory;
    }

    public User createUser(RegisterRequest req) {
        User user = factory.createUser(req);
        return user;
    }

}