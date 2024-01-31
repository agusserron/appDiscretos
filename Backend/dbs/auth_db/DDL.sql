CREATE TABLE users
(
    id              INT             NOT NULL,
    username        VARCHAR(200)    NOT NULL,
    password        VARCHAR(200)    NOT NULL,
    role            VARCHAR(50)     NOT NULL
    PRIMARY KEY (id)
);

