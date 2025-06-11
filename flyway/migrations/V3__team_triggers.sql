CREATE OR REPLACE FUNCTION add_team_member_on_accept()
RETURNS TRIGGER AS $$
BEGIN
    -- Only insert when status is updated to 2 (accepted)
    IF NEW.status = 2 AND OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO team_members (team_id, user_id,joined_at)
        VALUES (NEW.team_id, NEW.invited_user_id, CURRENT_TIMESTAMP);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_team_member
AFTER UPDATE ON team_invites
FOR EACH ROW
EXECUTE FUNCTION add_team_member_on_accept();

