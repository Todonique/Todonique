CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    password_salt VARCHAR(32) NOT NULL,
    protected_form VARCHAR(128),
    two_fa_secret VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(16) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL,
    team_lead_id INTEGER NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (team_lead_id) REFERENCES users(user_id)
);

CREATE TABLE team_members (
    team_member_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE todo_status (
    todo_status_id SERIAL PRIMARY KEY,
    todo_status_name VARCHAR(32) NOT NULL
);

CREATE TABLE todos (
    todo_id SERIAL PRIMARY KEY,
    title VARCHAR(32) NOT NULL,
    description VARCHAR(256),
    todo_status_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_to INTEGER,
    created_by INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    FOREIGN KEY (todo_status_id) REFERENCES todo_status(todo_status_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE todo_history (
    todo_history_id SERIAL PRIMARY KEY,
    todo_id INTEGER,
    updated_at TIMESTAMP,
    old_assigned_to_value INTEGER,
    new_assigned_to_value INTEGER,
    old_status_value INTEGER,
    new_status_value INTEGER,
    FOREIGN KEY (todo_id) REFERENCES todos(todo_id)
);

CREATE TABLE team_invite_status (
    team_invite_status_id SERIAL PRIMARY KEY,
    team_invite_status_name VARCHAR(8) NOT NULL
);

CREATE TABLE team_invites (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    invited_user_id INTEGER NOT NULL,
    invited_by INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (invited_user_id) REFERENCES users(user_id),
    FOREIGN KEY (invited_by) REFERENCES users(user_id),
    FOREIGN KEY (status) REFERENCES team_invite_status(team_invite_status_id)
);