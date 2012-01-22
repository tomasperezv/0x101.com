drop table if exists posts;
create table posts(
	id INTEGER PRIMARY KEY,
    date int, 
    content varchar(2048)
);

create index date on posts (date);

create table users(
	id INTEGER PRIMARY KEY,
	login string,
	password string,
	name string,
	permissions int
);

create table salts(
	id INTEGER PRIMARY KEY,
	user_id int not null,   
	salt string
);

create index user_id on salts (user_id);

create table sessions(
	id INTEGER PRIMARY KEY,
	user_id int not null,   
	creation_date int,
	challenge string
);

create index user_id on sessions (user_id);
create index creation_date on sessions (creation_date);
