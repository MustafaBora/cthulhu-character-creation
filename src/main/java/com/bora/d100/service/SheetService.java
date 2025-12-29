package com.bora.d100.service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.bora.d100.model.Player;

@Service
public class SheetService {

    @Value("classpath:templates/character-sheet.html")
    private Resource htmlTemplate;

    public byte[] generateCharacterHtml(Player player) {
        try {
            String html = new String(htmlTemplate.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            Map<String, String> values = buildPlaceholderMap(player);

            for (Map.Entry<String, String> entry : values.entrySet()) {
                String placeholder = "${" + entry.getKey() + "}";
                html = html.replace(placeholder, entry.getValue() != null ? entry.getValue() : "");
            }

            return html.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Character HTML sheet oluşturulurken hata oluştu", e);
        }
    }

    private Map<String, String> buildPlaceholderMap(Player p) {
        Map<String, String> m = new HashMap<>();

        // Temel bilgiler
        m.put("PLAYER", safe(p.getPlayer()));
        m.put("NAME", safe(p.getName()));
        m.put("BIRTH_PLACE", safe(p.getBirthPlace()));
        m.put("PRONOUN", safe(p.getPronoun()));
        m.put("OCCUPATION", safe(p.getOccupation()));
        m.put("RESIDENCE", safe(p.getResidence()));
        m.put("AGE", String.valueOf(p.getAge()));

        // Meta
        m.put("TOTAL_XP", String.valueOf(p.getTotalXP()));
        m.put("USED_XP", String.valueOf(p.getUsedXP()));
        m.put("REMAINING_XP", String.valueOf(p.getRemainingXP()));

        // HP/MP/Build/DB/MOVE
        m.put("HP", String.valueOf(p.getHP()));
        m.put("MP", String.valueOf(p.getMP()));
        m.put("MOVE", String.valueOf(p.getMOVE()));
        m.put("BUILD", String.valueOf(p.getBuild()));
        m.put("DAMAGE_BONUS", safe(p.getDamageBonus()));

        // Ana özellikler
        m.put("APP", String.valueOf(p.getAPP()));
        m.put("BONUS", String.valueOf(p.getBONUS()));
        m.put("BRV", String.valueOf(p.getBRV()));
        m.put("STA", String.valueOf(p.getCON()));
        m.put("AGI", String.valueOf(p.getDEX()));
        m.put("EDU", String.valueOf(p.getEDU()));
        m.put("INT", String.valueOf(p.getINT()));
        m.put("LUCK", String.valueOf(p.getLUCK()));
        m.put("SENSE", String.valueOf(p.getSENSE()));
        m.put("WILL", String.valueOf(p.getWILL()));
        m.put("STATUS", String.valueOf(p.getSTATUS()));
        m.put("SAN", String.valueOf(p.getSAN()));
        m.put("SIZ", String.valueOf(p.getSIZ()));
        m.put("STR", String.valueOf(p.getSTR()));

        // Skill'ler – JSON / entity’ndeki isimlerle senkron
        m.put("ACCOUNTING", String.valueOf(p.getAccounting()));
        m.put("ANTHROPOLOGY", String.valueOf(p.getAnthropology()));
        m.put("APPRAISE", String.valueOf(p.getAppraise()));
        m.put("ARCHEOLOGY", String.valueOf(p.getArcheology()));
        m.put("ARTCRAFT", String.valueOf(p.getArtCraft()));
        m.put("ARTCRAFT2", String.valueOf(p.getArtCraft2()));
        m.put("CHARM", String.valueOf(p.getCharm()));
        m.put("CLIMB", String.valueOf(p.getClimb()));
        m.put("CREDIT_RATING", String.valueOf(p.getCreditRating()));
        m.put("CTHULHU_MYTHOS", String.valueOf(p.getCthulhuMythos()));
        m.put("DISGUISE", String.valueOf(p.getDisguise()));
        m.put("DODGE", String.valueOf(p.getDodge()));
        m.put("DRIVE_AUTO", String.valueOf(p.getDriveAuto()));
        m.put("ELECTRICAL_REPAIR", String.valueOf(p.getElectricalRepair()));
        m.put("FAST_TALK", String.valueOf(p.getFastTalk()));
        m.put("FIGHTING_BRAWL", String.valueOf(p.getFightingBrawl()));
        m.put("FIGHTING_OTHER", String.valueOf(p.getFightingOther()));
        m.put("FIREARMS_HANDGUN", String.valueOf(p.getFirearmsHandgun()));
        m.put("FIREARMS_OTHER", String.valueOf(p.getFirearmsOther()));
        m.put("FIREARMS_RIFLE_SHOTGUN", String.valueOf(p.getFirearmsRifleShotgun()));
        m.put("FIRST_AID", String.valueOf(p.getFirstAid()));
        m.put("HISTORY", String.valueOf(p.getHistory()));
        m.put("INTIMIDATE", String.valueOf(p.getIntimidate()));
        m.put("JUMP", String.valueOf(p.getJump()));
        m.put("LANG_OTHER1", String.valueOf(p.getLanguageOther1()));
        m.put("LANG_OTHER2", String.valueOf(p.getLanguageOther2()));
        m.put("LANG_OTHER3", String.valueOf(p.getLanguageOther3()));
        m.put("LANG_OWN", String.valueOf(p.getLanguageOwn()));
        m.put("LAW", String.valueOf(p.getLaw()));
        m.put("LIBRARY_USE", String.valueOf(p.getLibraryUse()));
        m.put("LISTEN", String.valueOf(p.getListen()));
        m.put("LOCKSMITH", String.valueOf(p.getLocksmith()));
        m.put("MECH_REPAIR", String.valueOf(p.getMechanicalRepair()));
        m.put("MEDICINE", String.valueOf(p.getMedicine()));
        m.put("NATURAL_WORLD", String.valueOf(p.getNaturalWorld()));
        m.put("NAVIGATE", String.valueOf(p.getNavigate()));
        m.put("OCCULT", String.valueOf(p.getOccult()));
        m.put("PERSUADE", String.valueOf(p.getPersuade()));
        m.put("PILOT", String.valueOf(p.getPilot()));
        m.put("PSYCHOANALYSIS", String.valueOf(p.getPsychoanalysis()));
        m.put("PSYCHOLOGY", String.valueOf(p.getPsychology()));
        m.put("RIDE", String.valueOf(p.getRide()));
        m.put("SCIENCE", String.valueOf(p.getScience()));
        m.put("SCIENCE_OTHER", String.valueOf(p.getScienceOther()));
        m.put("SCIENCE_OTHER2", String.valueOf(p.getScienceOther2()));
        m.put("SLEIGHT_OF_HAND", String.valueOf(p.getSleightOfHand()));
        m.put("SPOT", String.valueOf(p.getSPOT()));
        m.put("STEALTH", String.valueOf(p.getStealth()));
        m.put("SURVIVAL", String.valueOf(p.getSurvival()));
        m.put("SWIM", String.valueOf(p.getSwim()));
        m.put("THROW", String.valueOf(p.getThrow()));
        m.put("TRACK", String.valueOf(p.getTrack()));

        return m;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
