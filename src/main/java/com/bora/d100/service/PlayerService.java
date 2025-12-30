package com.bora.d100.service;

import com.bora.d100.exception.PlayerNotFoundException;
import com.bora.d100.exception.XPCalculationMismatchException;
import com.bora.d100.mapper.PlayerMapper;
import com.bora.d100.model.Player;
import com.bora.d100.model.Role;
import com.bora.d100.model.User;
import com.bora.d100.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {

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
        List<Player> players = playerRepository.findAll()
                .stream()
                //.map(playerMapper::toResponseDto)
                .toList();
        return players;
    }

    public Player getPlayerById(Long playerId)
    {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        return player;//;playerMapper.toResponseDto(player);
    }



    public Player/*ResponseDTO*/ createPlayer(Player/*RequestDTO dto,*/ player, User user) throws XPCalculationMismatchException {
//        Player player = playerMapper.toEntity(dto);
        player.setUser(user);
//        costService.calculateXP(player);
        costServiceByUsage.calculateXP(player);
        player.calculateBuildAndDB();
        player.calculateMPAndHP();
        Player saved = playerRepository.save(player);
        return saved; //playerMapper.toResponseDto(saved);
    }


    public Player updatePlayer(Long id, Player incoming, User user) {
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

        return playerRepository.save(existing);
    }


    public void deletePlayer(Long playerId, User user) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

/*        if (user.getRole() == Role.USER &&
                !player.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this player");
        }*/

        playerRepository.delete(player);
    }

}

