CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    patronymic VARCHAR,
    alias VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL
);

CREATE TABLE spaces (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE spaces_tree_adjacency (
    id UUID PRIMARY KEY REFERENCES spaces(id),
    parent_id UUID REFERENCES spaces(id)
);

CREATE TABLE seatplaces (
    id UUID PRIMARY KEY,
    space_id UUID NOT NULL REFERENCES spaces(id)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    space_id UUID NOT NULL REFERENCES spaces(id),
    seatplace_id UUID NOT NULL REFERENCES seatplaces(id),
    user_id UUID NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    CONSTRAINT valid_booking_time CHECK (end_time > start_time),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_place_time ON bookings(seatplace_id, start_time, end_time);

CREATE INDEX idx_spaces_tree_parent ON spaces_tree_adjacency(parent_id);

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
ADD CONSTRAINT no_time_overlap
EXCLUDE USING gist (
    seatplace_id WITH =,
    tsrange(start_time, end_time) WITH &&
);
