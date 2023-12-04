delimiter //
drop procedure if exists myProcedure;
create procedure myProcedure ()
begin
    
    declare done int default 0;
    declare currCrimeCode int;
    declare currAvgVictAge int;
    declare currCrimeDesc varchar(255);
    declare agecur cursor for 
        select CrimeCode, round(avg(VictimAge)) avgVictimAge, CrimeCodeDesc
        from (
            select CrimeCode, VictimAge, CrimeCodeDesc
            from safewalk_la.Cases NATURAL JOIN safewalk_la.Crime
        ) t0
        group by t0.CrimeCode;
    
    declare continue handler for not found set done = 1;

    /* Create tables */
    drop table if exists CrimeVictimAgeRels;
    drop table if exists CrimeIncreaseByMonth;
    create table CrimeVictimAgeRels (
        CrimeCode int primary key,
        avgVictimAgeGroup varchar(7),
        avgVictimAge int,
        CrimeDesc varchar(255)
    );
    create table CrimeIncreaseByMonth (
        mth VARCHAR(2) PRIMARY key,
        y21cnt int,
        y20cnt int,
        diff int,
        rate float
    );

    /* Turn on cursors */
    open agecur;

    /* Loop */
    repeat
        fetch agecur into currCrimeCode, currAvgVictAge, currCrimeDesc;
        if currAvgVictAge >= 65 then 
            insert ignore into CrimeVictimAgeRels values (currCrimeCode, 'Old', currAvgVictAge, currCrimeDesc);
        elseif currAvgVictAge >= 21 then
            insert ignore into CrimeVictimAgeRels values (currCrimeCode, 'Mid-age', currAvgVictAge, currCrimeDesc);
        else  
            insert ignore into CrimeVictimAgeRels values (currCrimeCode, 'Young', currAvgVictAge, currCrimeDesc);
        end if;
    until
        done
    end repeat;

    /* Turn off cursors */
    close agecur;

    insert into CrimeIncreaseByMonth
    select mth, y21cnt, y20cnt, y21cnt-y20cnt diff, (y21cnt-y20cnt)/y20cnt rate
    from (
        select y21.mth, y21.casescnt y21cnt, y20.casescnt y20cnt
        from (
            select *
            from (
                select count(1) casescnt, substr(DateOccurred,7,4) yr, substr(DateOccurred,1,2) mth
                from Cases
                where substr(DateOccurred,7,4) = '2021'
                group by substr(DateOccurred,7,4), substr(DateOccurred,1,2)
            ) a
        ) y21
        left join (
            select *
            from (
                select count(1) casescnt, substr(DateOccurred,7,4) yr, substr(DateOccurred,1,2) mth
                from Cases
                where substr(DateOccurred,7,4) = '2020'
                group by substr(DateOccurred,7,4), substr(DateOccurred,1,2)
            ) a
        ) y20
        on y21.mth = y20.mth
    ) b;
END
//
delimiter ;

call myProcedure;

select * from CrimeVictimAgeRels;