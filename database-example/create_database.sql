drop table if exists posts;
create table posts(
    date int, 
    content varchar(2048)
);

create index date on posts (date);
