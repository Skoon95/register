package com.ghchoi.studywebuser.mappes;

import com.ghchoi.studywebuser.entities.RegisterCodeEntity;
import com.ghchoi.studywebuser.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int insertRegisterCode(RegisterCodeEntity registerCodeEntity);
    RegisterCodeEntity selectRegisterCodeByEmailCodeSalt(@Param(value = "email") String email,
                                                         @Param(value = "code") String code,
                                                         @Param(value = "salt") String salt);

    UserEntity selectUserByEmail(@Param(value = "email") String email);
    UserEntity selectUserByNickname(@Param(value = "nickname") String nickname);
    UserEntity selectUserByContact(@Param(value = "contact") String contact);

    UserEntity selectUserByEmailPassword(@Param(value = "email") String email,
                                         @Param(value = "password") String password);


    int updateRegisterCode(RegisterCodeEntity registerCodeEntity);

    int insertUser(UserEntity user);
}
