package com.bora.d100.mapper;

import org.springframework.stereotype.Component;

import com.bora.d100.dto.PlayerDTO;
import com.bora.d100.model.Player;

@Component
public class PlayerMapper {
    
    public Player toEntity(PlayerDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Player player = new Player();
        player.setId(dto.getId());
        
        // Character Basics
        player.setAvatar(dto.getAvatar());
        player.setAvatarLink(dto.getAvatarLink());
        player.setPlayer(dto.getPlayer());
        player.setName(dto.getName());
        player.setBirthPlace(dto.getBirthPlace());
        player.setPronoun(dto.getPronoun());
        player.setOccupation(dto.getOccupation());
        player.setResidence(dto.getResidence());
        
        // Character Background & Description
        player.setPersonalDescription(dto.getPersonalDescription());
        player.setTraits(dto.getTraits());
        player.setIdeology(dto.getIdeology());
        player.setBeliefs(dto.getBeliefs());
        
        // Inventory
        player.setBagSurface(dto.getBagSurface());
        player.setBagMiddle(dto.getBagMiddle());
        player.setBagDeep(dto.getBagDeep());
        
        // Relationships & History
        player.setSignificantPeople(dto.getSignificantPeople());
        player.setInjuries(dto.getInjuries());
        player.setScars(dto.getScars());
        player.setPhobies(dto.getPhobies());
        player.setManias(dto.getManias());
        player.setTreasuredPossesions(dto.getTreasuredPossesions());
        
        // Mystical Elements
        player.setArcaneTomes(dto.getArcaneTomes());
        player.setSpells(dto.getSpells());
        player.setArtifacts(dto.getArtifacts());
        
        // World Knowledge
        player.setMeaningfulLocations(dto.getMeaningfulLocations());
        player.setEncountersWithStrangeEntities(dto.getEncountersWithStrangeEntities());
        player.setInspiration(dto.getInspiration());
        player.setAlliesAndOrganisations(dto.getAlliesAndOrganisations());
        player.setNotes(dto.getNotes());
        
        // Character Stats
        player.setAge(dto.getAge());
        player.setTotalXP(dto.getTotalXP());
        player.setUsedXP(dto.getUsedXP());
        player.setRemainingXP(dto.getRemainingXP());
        player.setLevel(dto.getLevel());
        player.setBuild(dto.getBuild());
        player.setDamageBonus(dto.getDamageBonus());
        player.setMP(dto.getMP());
        player.setHP(dto.getHP());
        player.setMOVE(dto.getMOVE());
        
        // Characteristics
        player.setAPP(dto.getAPP());
        player.setBONUS(dto.getBONUS());
        player.setBRV(dto.getBRV());
        player.setCON(dto.getCON());
        player.setDEX(dto.getDEX());
        player.setEDU(dto.getEDU());
        player.setINT(dto.getINT());
        player.setLUCK(dto.getLUCK());
        player.setSENSE(dto.getSENSE());
        player.setWILL(dto.getWILL());
        player.setSAN(dto.getSAN());
        player.setSIZ(dto.getSIZ());
        player.setSTR(dto.getSTR());
        player.setARMOR(dto.getARMOR());
        player.setRES(dto.getRES());
        
        // Skills
        player.setAccounting(dto.getAccounting());
        player.setAnimalHandling(dto.getAnimalHandling());
        player.setAnthropology(dto.getAnthropology());
        player.setAppraise(dto.getAppraise());
        player.setArcheology(dto.getArcheology());
        player.setArtCraft(dto.getArtCraft());
        player.setArtCraft2(dto.getArtCraft2());
        player.setArtillery(dto.getArtillery());
        player.setCharm(dto.getCharm());
        player.setClimb(dto.getClimb());
        player.setComputerUse(dto.getComputerUse());
        player.setCreditRating(dto.getCreditRating());
        player.setCthulhuMythos(dto.getCthulhuMythos());
        player.setDemolitions(dto.getDemolitions());
        player.setDisguise(dto.getDisguise());
        player.setDodge(dto.getDodge());
        player.setDriveAuto(dto.getDriveAuto());
        player.setElectronics(dto.getElectronics());
        player.setElectricalRepair(dto.getElectricalRepair());
        player.setFastTalk(dto.getFastTalk());
        player.setFightingBrawl(dto.getFightingBrawl());
        player.setFightingOther(dto.getFightingOther());
        player.setFirearmsHandgun(dto.getFirearmsHandgun());
        player.setFirearmsOther(dto.getFirearmsOther());
        player.setFirearmsRifleShotgun(dto.getFirearmsRifleShotgun());
        player.setFirstAid(dto.getFirstAid());
        player.setHistory(dto.getHistory());
        player.setHypnosis(dto.getHypnosis());
        player.setIntimidate(dto.getIntimidate());
        player.setJump(dto.getJump());
        player.setLanguageOther1(dto.getLanguageOther1());
        player.setLanguageOther2(dto.getLanguageOther2());
        player.setLanguageOther3(dto.getLanguageOther3());
        player.setLanguageOwn(dto.getLanguageOwn());
        player.setLaw(dto.getLaw());
        player.setLibraryUse(dto.getLibraryUse());
        player.setListen(dto.getListen());
        player.setLocksmith(dto.getLocksmith());
        player.setMechanicalRepair(dto.getMechanicalRepair());
        player.setMedicine(dto.getMedicine());
        player.setNaturalWorld(dto.getNaturalWorld());
        player.setNavigate(dto.getNavigate());
        player.setOccult(dto.getOccult());
        player.setOperateHeavyMachinery(dto.getOperateHeavyMachinery());
        player.setPersuade(dto.getPersuade());
        player.setPilot(dto.getPilot());
        player.setPsychoanalysis(dto.getPsychoanalysis());
        player.setPsychology(dto.getPsychology());
        player.setReadLips(dto.getReadLips());
        player.setRide(dto.getRide());
        player.setScience(dto.getScience());
        player.setScienceOther(dto.getScienceOther());
        player.setScienceOther2(dto.getScienceOther2());
        player.setSignLanguage(dto.getSignLanguage());
        player.setDeception(dto.getDeception());
        player.setSleightOfHand(dto.getSleightOfHand());
        player.setSPOT(dto.getSPOT());
        player.setStatus(dto.getStatus());
        player.setStealth(dto.getStealth());
        player.setSurvival(dto.getSurvival());
        player.setSwim(dto.getSwim());
        player.setThrow(dto.getThrow());
        player.setTrack(dto.getTrack());
        player.setUncommonLanguage(dto.getUncommonLanguage());
        player.setOther1(dto.getOther1());
        player.setOther2(dto.getOther2());
        player.setOther3(dto.getOther3());
        
        // Status
        player.setReadonly(dto.isReadonly());
        
        return player;
    }

    public PlayerDTO toResponseDto(Player player) {
        if (player == null) {
            return null;
        }
        
        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        
        // Character Basics
        dto.setAvatar(player.getAvatar());
        dto.setAvatarLink(player.getAvatarLink());
        dto.setPlayer(player.getPlayer());
        dto.setName(player.getName());
        dto.setBirthPlace(player.getBirthPlace());
        dto.setPronoun(player.getPronoun());
        dto.setOccupation(player.getOccupation());
        dto.setResidence(player.getResidence());
        
        // Character Background & Description
        dto.setPersonalDescription(player.getPersonalDescription());
        dto.setTraits(player.getTraits());
        dto.setIdeology(player.getIdeology());
        dto.setBeliefs(player.getBeliefs());
        
        // Inventory
        dto.setBagSurface(player.getBagSurface());
        dto.setBagMiddle(player.getBagMiddle());
        dto.setBagDeep(player.getBagDeep());
        
        // Relationships & History
        dto.setSignificantPeople(player.getSignificantPeople());
        dto.setInjuries(player.getInjuries());
        dto.setScars(player.getScars());
        dto.setPhobies(player.getPhobies());
        dto.setManias(player.getManias());
        dto.setTreasuredPossesions(player.getTreasuredPossesions());
        
        // Mystical Elements
        dto.setArcaneTomes(player.getArcaneTomes());
        dto.setSpells(player.getSpells());
        dto.setArtifacts(player.getArtifacts());
        
        // World Knowledge
        dto.setMeaningfulLocations(player.getMeaningfulLocations());
        dto.setEncountersWithStrangeEntities(player.getEncountersWithStrangeEntities());
        dto.setInspiration(player.getInspiration());
        dto.setAlliesAndOrganisations(player.getAlliesAndOrganisations());
        dto.setNotes(player.getNotes());
        
        // Character Stats
        dto.setAge(player.getAge());
        dto.setTotalXP(player.getTotalXP());
        dto.setUsedXP(player.getUsedXP());
        dto.setRemainingXP(player.getRemainingXP());
        dto.setLevel(player.getLevel());
        dto.setBuild(player.getBuild());
        dto.setDamageBonus(player.getDamageBonus());
        dto.setMP(player.getMP());
        dto.setHP(player.getHP());
        dto.setMOVE(player.getMOVE());
        
        // Characteristics
        dto.setAPP(player.getAPP());
        dto.setBONUS(player.getBONUS());
        dto.setBRV(player.getBRV());
        dto.setCON(player.getCON());
        dto.setDEX(player.getDEX());
        dto.setEDU(player.getEDU());
        dto.setINT(player.getINT());
        dto.setLUCK(player.getLUCK());
        dto.setSENSE(player.getSENSE());
        dto.setWILL(player.getWILL());
        dto.setSAN(player.getSAN());
        dto.setSIZ(player.getSIZ());
        dto.setSTR(player.getSTR());
        dto.setARMOR(player.getARMOR());
        dto.setRES(player.getRES());
        
        // Skills
        dto.setAccounting(player.getAccounting());
        dto.setAnimalHandling(player.getAnimalHandling());
        dto.setAnthropology(player.getAnthropology());
        dto.setAppraise(player.getAppraise());
        dto.setArcheology(player.getArcheology());
        dto.setArtCraft(player.getArtCraft());
        dto.setArtCraft2(player.getArtCraft2());
        dto.setArtillery(player.getArtillery());
        dto.setCharm(player.getCharm());
        dto.setClimb(player.getClimb());
        dto.setComputerUse(player.getComputerUse());
        dto.setCreditRating(player.getCreditRating());
        dto.setCthulhuMythos(player.getCthulhuMythos());
        dto.setDemolitions(player.getDemolitions());
        dto.setDisguise(player.getDisguise());
        dto.setDodge(player.getDodge());
        dto.setDriveAuto(player.getDriveAuto());
        dto.setElectronics(player.getElectronics());
        dto.setElectricalRepair(player.getElectricalRepair());
        dto.setFastTalk(player.getFastTalk());
        dto.setFightingBrawl(player.getFightingBrawl());
        dto.setFightingOther(player.getFightingOther());
        dto.setFirearmsHandgun(player.getFirearmsHandgun());
        dto.setFirearmsOther(player.getFirearmsOther());
        dto.setFirearmsRifleShotgun(player.getFirearmsRifleShotgun());
        dto.setFirstAid(player.getFirstAid());
        dto.setHistory(player.getHistory());
        dto.setHypnosis(player.getHypnosis());
        dto.setIntimidate(player.getIntimidate());
        dto.setJump(player.getJump());
        dto.setLanguageOther1(player.getLanguageOther1());
        dto.setLanguageOther2(player.getLanguageOther2());
        dto.setLanguageOther3(player.getLanguageOther3());
        dto.setLanguageOwn(player.getLanguageOwn());
        dto.setLaw(player.getLaw());
        dto.setLibraryUse(player.getLibraryUse());
        dto.setListen(player.getListen());
        dto.setLocksmith(player.getLocksmith());
        dto.setMechanicalRepair(player.getMechanicalRepair());
        dto.setMedicine(player.getMedicine());
        dto.setNaturalWorld(player.getNaturalWorld());
        dto.setNavigate(player.getNavigate());
        dto.setOccult(player.getOccult());
        dto.setOperateHeavyMachinery(player.getOperateHeavyMachinery());
        dto.setPersuade(player.getPersuade());
        dto.setPilot(player.getPilot());
        dto.setPsychoanalysis(player.getPsychoanalysis());
        dto.setPsychology(player.getPsychology());
        dto.setReadLips(player.getReadLips());
        dto.setRide(player.getRide());
        dto.setScience(player.getScience());
        dto.setScienceOther(player.getScienceOther());
        dto.setScienceOther2(player.getScienceOther2());
        dto.setSignLanguage(player.getSignLanguage());
        dto.setDeception(player.getDeception());
        dto.setSleightOfHand(player.getSleightOfHand());
        dto.setSPOT(player.getSPOT());
        dto.setStatus(player.getStatus());
        dto.setStealth(player.getStealth());
        dto.setSurvival(player.getSurvival());
        dto.setSwim(player.getSwim());
        dto.setThrow(player.getThrow());
        dto.setTrack(player.getTrack());
        dto.setUncommonLanguage(player.getUncommonLanguage());
        dto.setOther1(player.getOther1());
        dto.setOther2(player.getOther2());
        dto.setOther3(player.getOther3());
        
        // Status
        dto.setReadonly(player.isReadonly());
        
        return dto;
    }
}