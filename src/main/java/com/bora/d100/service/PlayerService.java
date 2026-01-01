package com.bora.d100.service;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.stereotype.Service;

import com.bora.d100.exception.PlayerNotFoundException;
import com.bora.d100.exception.XPCalculationMismatchException;
import com.bora.d100.mapper.PlayerMapper;
import com.bora.d100.model.Player;
import com.bora.d100.model.User;
import com.bora.d100.repository.PlayerRepository;

@Service
public class PlayerService {
    
    private static final Logger logger = Logger.getLogger(PlayerService.class.getName());

    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;
    private final CostService costService;
    private final CostServiceByUsage costServiceByUsage;

    public PlayerService(PlayerRepository playerRepository, PlayerMapper playerMapper, CostService costService, CostServiceByUsage costServiceByUsage)
    {
        this.playerRepository = playerRepository;
        this.playerMapper = playerMapper;
        this.costService = costService;
        this.costServiceByUsage = costServiceByUsage;
    }

    public List<Player> getAllPlayers()
    {
        logger.info("PlayerService.getAllPlayers() - fetching all players from database");
        List<Player> players = playerRepository.findAll()
                .stream()
                //.map(playerMapper::toResponseDto)
                .toList();
        logger.info("Found " + players.size() + " players");
        return players;
    }

    public Player getPlayerById(Long playerId)
    {
        logger.info("PlayerService.getPlayerById(" + playerId + ")");
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        return player;//;playerMapper.toResponseDto(player);
    }



    public Player/*ResponseDTO*/ createPlayer(Player/*RequestDTO dto,*/ player, User user) throws XPCalculationMismatchException {
        logger.info("PlayerService.createPlayer() - creating character: " + player.getName());
//        Player player = playerMapper.toEntity(dto);
        player.setUser(user);
//        costService.calculateXP(player);
        costServiceByUsage.calculateXP(player);
        player.calculateBuildAndDB();
        player.calculateMPAndHP();
        Player saved = playerRepository.save(player);
        logger.info("Character created successfully with ID: " + saved.getId());
        return saved; //playerMapper.toResponseDto(saved);
    }


    public Player updatePlayer(Long id, Player incoming, User user) {
        logger.info("PlayerService.updatePlayer(" + id + ") - updating character");
        Player existing = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));

        /*if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot edit someone else's player");
        }*/

        existing.setValuesFromAnother(incoming);

//        costService.calculateXP(existing);
        costServiceByUsage.calculateXP(existing);
        existing.calculateBuildAndDB();
        existing.calculateMPAndHP();

        Player result = playerRepository.save(existing);
        logger.info("Character " + id + " updated successfully");
        return result;
    }


    public void deletePlayer(Long playerId, User user) {
        logger.info("PlayerService.deletePlayer(" + playerId + ")");
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

/*        if (user.getRole() == Role.USER &&
                !player.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this player");
        }*/

        playerRepository.delete(player);
    }

}

