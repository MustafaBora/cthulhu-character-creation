package com.bora.d100.controller;

import com.bora.d100.exception.InvalidTokenException;
import com.bora.d100.model.Player;
import com.bora.d100.model.User;
import com.bora.d100.service.PlayerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/players")
public class PlayerController
{
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService)
    {
        this.playerService = playerService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPlayers()
    {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlayerById(@PathVariable Long id)
    {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PostMapping
    public ResponseEntity<?> createPlayer(
            @Valid @RequestBody Player/*RequestDTO dto*/ player,
            @AuthenticationPrincipal User user ) {
        if (user == null)  throw new InvalidTokenException("Missing or invalid token");
        Player/*ResponseDTO*/ created = playerService.createPlayer(player, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody Player/*RequestDTO dto*/ player,
            @AuthenticationPrincipal User user ) {
        if (user == null) throw new InvalidTokenException("Missing or invalid token");
        Player/*ResponseDTO*/ updated = playerService.updatePlayer(id, player, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    )
    {
        if (user == null) throw new InvalidTokenException("Missing or invalid token");
        playerService.deletePlayer(id, user);
        return ResponseEntity.ok("Player deleted successfully");
    }
}