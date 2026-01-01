package com.bora.d100.controller;

import java.util.logging.Logger;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bora.d100.dto.RulesSpec;
import com.bora.d100.exception.InvalidTokenException;
import com.bora.d100.model.Player;
import com.bora.d100.model.User;
import com.bora.d100.service.PlayerService;
import com.bora.d100.service.RulesService;
import com.bora.d100.service.SheetService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/players")
public class PlayerController
{
    private static final Logger logger = Logger.getLogger(PlayerController.class.getName());
    
    private final PlayerService playerService;
    private final SheetService sheetService;
    private final RulesService rulesService;

    public PlayerController(PlayerService playerService, SheetService sheetService, RulesService rulesService)
    {
        this.playerService = playerService;
        this.sheetService = sheetService;
        this.rulesService = rulesService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPlayers()
    {
        logger.info("GET /players - retrieving all players");
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlayerById(@PathVariable Long id)
    {
        logger.info("GET /players/" + id + " - retrieving player");
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PostMapping
    public ResponseEntity<?> createPlayer(
            @Valid @RequestBody Player/*RequestDTO dto*/ player,
            @AuthenticationPrincipal User user ) {
        logger.info("POST /players - creating new player with character name: " + player.getName());
        //if (user == null)  throw new InvalidTokenException("Missing or invalid token");
        Player/*ResponseDTO*/ created = playerService.createPlayer(player, user);
        logger.info("Player created successfully with ID: " + created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody Player/*RequestDTO dto*/ player,
            @AuthenticationPrincipal User user ) {
        logger.info("PUT /players/" + id + " - updating player");
        //if (user == null) throw new InvalidTokenException("Missing or invalid token");
        Player/*ResponseDTO*/ updated = playerService.updatePlayer(id, player, user);
        logger.info("Player " + id + " updated successfully");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    )
    {
        logger.info("DELETE /players/" + id + " - deleting player");
        //if (user == null) throw new InvalidTokenException("Missing or invalid token");
        playerService.deletePlayer(id, user);
        logger.info("Player " + id + " deleted successfully");
        return ResponseEntity.ok("Player deleted successfully");
    }

    /**
     * GET /players/rules
     * Serves the rules specification (JSON) to the frontend.
     * Frontend loads this to drive calculations consistently with backend.
     */
    @GetMapping("/rules")
    public ResponseEntity<RulesSpec> getRulesSpec() {
        logger.info("GET /players/rules - serving rules specification");
        return ResponseEntity.ok(rulesService.getRulesSpec());
    }

    @GetMapping("/{id}/sheet.html")
    public ResponseEntity<byte[]> downloadHtmlSheet(@PathVariable Long id) {
        //bunu kullanacaksan pronoun ve birthplace isimlerinde hata olabilir frontende bak
        Player p = playerService.getPlayerById(id);

        byte[] bytes = sheetService.generateCharacterHtml(p);

        String fileName = (p.getName() != null ? p.getName() : "character") + "-sheet.html";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.TEXT_HTML)
                .body(bytes);
    }
}