delimiter //
create trigger crimetrig after insert on safewalk_la.Cases
for each row
begin
    set @new_weapon_check = (
        select distinct CrimeCode
        from safewalk_la.Crime c
        where c.CrimeCode = new.CrimeCode);
        
    if @new_weapon_check is null then 
        insert into Crime(CrimeCode, CrimeCodeDesc) values(new.CrimeCode, 'Unidentified crime type');
    end if;
end;
//
delimiter ;

drop trigger crimetrig;