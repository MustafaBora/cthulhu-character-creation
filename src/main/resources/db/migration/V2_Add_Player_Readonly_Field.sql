-- Migration: Add readonly field to Player entity
-- Description: Adds a readonly boolean field to the player table
-- This prevents readonly players from being updated or deleted

ALTER TABLE player ADD COLUMN readonly BOOLEAN DEFAULT FALSE;

-- Create an index for readonly status for efficient queries
CREATE INDEX idx_player_readonly ON player(readonly);
