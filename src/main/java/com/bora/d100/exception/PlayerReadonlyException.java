package com.bora.d100.exception;

/**
 * Exception thrown when attempting to modify a readonly Player.
 * This prevents bypass attempts from the frontend.
 */
public class PlayerReadonlyException extends RuntimeException {

    public PlayerReadonlyException(Long playerId) {
        super("Player with ID " + playerId + " is readonly and cannot be modified.");
    }

    public PlayerReadonlyException(String message) {
        super(message);
    }

    public PlayerReadonlyException(String message, Throwable cause) {
        super(message, cause);
    }
}
