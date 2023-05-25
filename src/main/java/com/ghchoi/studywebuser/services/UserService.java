package com.ghchoi.studywebuser.services;

import com.ghchoi.studywebuser.entities.RegisterCodeEntity;
import com.ghchoi.studywebuser.entities.UserEntity;
import com.ghchoi.studywebuser.enums.user.LoginResult;
import com.ghchoi.studywebuser.enums.user.RegisterResult;
import com.ghchoi.studywebuser.enums.user.RegisterSendEmailResult;
import com.ghchoi.studywebuser.enums.user.RegisterVerifyEmailResult;
import com.ghchoi.studywebuser.mappes.UserMapper;
import com.ghchoi.studywebuser.utils.CryptoUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Service
public class UserService {
    private final JavaMailSender javaMailSender;
    // 빨간줄 뜨면 alt+enter 매개변수 추가! 26번27번줄 추가됨
    private final UserMapper userMapper;

    @Autowired
    public UserService(JavaMailSender javaMailSender, UserMapper userMapper) {
        this.javaMailSender = javaMailSender;
        this.userMapper = userMapper;
    }

//    public LoginResult login(UserEntity user) throws NoSuchAlgorithmException {
//        String password = String.format("%s", user.getPassword());
//        MessageDigest md = MessageDigest.getInstance("SHA-512");
//        md.update(password.getBytes(StandardCharsets.UTF_8));
//        password = String.format("%0128x", new BigInteger(1, md.digest()));
//        user.setPassword(password);
//        user = this.userMapper.selectUserByEmailPassword(
//                user.getEmail(),
//                user.getPassword());
//        return user == null ? LoginResult.FAILURE : LoginResult.SUCCESS;
//    }

    public LoginResult login(UserEntity user) throws NoSuchAlgorithmException {
        user.setPassword(CryptoUtil.hashSha512(user.getPassword())); // 위치가 중요하다. null 값이기 때문에!
        UserEntity existingUser = this.userMapper.selectUserByEmailPassword(user.getEmail(), user.getPassword());
        if(existingUser == null){
            return LoginResult.FAILURE;
        }
        if(!user.getPassword().equals(existingUser.getPassword())){
            return LoginResult.FAILURE;
        }
        user.setNickname(existingUser.getNickname())
                .setAddressPostal(existingUser.getAddressPostal())
                .setAddressPrimary(existingUser.getAddressPrimary())
                .setAddressSecondary(existingUser.getAddressSecondary())
                .setGender(existingUser.getGender())
                .setName(existingUser.getName())
                .setBirth(existingUser.getBirth())
                .setContactProvider(existingUser.getContactProvider())
                .setContact(existingUser.getContact())
                .setRegisteredAt(existingUser.getRegisteredAt()); // 얘는 쿠키야!
        return LoginResult.SUCCESS;
    }


    public RegisterResult register(RegisterCodeEntity registerCode, UserEntity user) throws NoSuchAlgorithmException {
        registerCode = this.userMapper.selectRegisterCodeByEmailCodeSalt(
                registerCode.getEmail(),
                registerCode.getCode(),
                registerCode.getSalt());
        if (registerCode == null || !registerCode.isVerified()) {
            // 이메일 번호가 인증되지 않았다면
            return RegisterResult.FAILURE_EMAIL_NOT_VERIFIED;
        }
        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return RegisterResult.FAILURE_EMAIL_DUPLICATE;
            // 동시에 이메일 인증을 받고 회원가입을 받았을때 늦게 한 사람을 막아주는!
        }
        if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
            return RegisterResult.FAILURE_NICKNAME_DUPLICATE;
        }
        if (this.userMapper.selectUserByContact(user.getContact()) != null) {
            return RegisterResult.FAILURE_CONTACT_DUPLICATE;
        }
        String password = String.format("%s", user.getPassword());
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(password.getBytes(StandardCharsets.UTF_8));
        password = String.format("%0128x", new BigInteger(1, md.digest()));
        user.setPassword(password);
        return this.userMapper.insertUser(user) > 0
                ? RegisterResult.SUCCESS
                : RegisterResult.FAILURE;
    }

    public RegisterSendEmailResult registerSendEmailResult(RegisterCodeEntity registerCodeEntity) throws NoSuchAlgorithmException {
        //1. 전달 받은 email 기준으로 UserEntity를 받아온다.
        //2. <1>에서 받아온 UserEntity가 null이 아닐 경우, 이미 사용중인 이메일임으로 이에 맞는 결과값을 반환한다.
        UserEntity existingUserEntity = this.userMapper.selectUserByEmail(registerCodeEntity.getEmail());
        if (existingUserEntity != null) {
            return RegisterSendEmailResult.FAILURE_EMAIL_DUPLICATE;
        }
        String code = RandomStringUtils.randomNumeric(6);
        String salt = String.format("%s%s%f%f",
                registerCodeEntity.getEmail(),
                code,
                Math.random(),
                Math.random()); // sample@sample.com5337190.4564546645~~~
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(salt.getBytes(StandardCharsets.UTF_8));
        salt = String.format("%0128x", new BigInteger(1, md.digest()));
        registerCodeEntity
                .setCode(code)
                .setSalt(salt)
                .setCreatedAt(new Date())
                .setExpiresAt(DateUtils.addMinutes(registerCodeEntity.getCreatedAt(), 10))
                .setVerified(false);
        int insertResult = this.userMapper.insertRegisterCode(registerCodeEntity);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(registerCodeEntity.getEmail());
        mail.setSubject("[Study Web] 인증번호");
        mail.setText(code);
        this.javaMailSender.send(mail);

        return insertResult > 0
                ? RegisterSendEmailResult.SUCCESS
                : RegisterSendEmailResult.FAILURE;


    }

    public RegisterVerifyEmailResult registerVerifyEmailResult(RegisterCodeEntity registerCodeEntity) throws NoSuchAlgorithmException {
        RegisterCodeEntity existingRegisterCodeEntity = this.userMapper.selectRegisterCodeByEmailCodeSalt(
                registerCodeEntity.getEmail(),
                registerCodeEntity.getCode(),
                registerCodeEntity.getSalt());
        if (existingRegisterCodeEntity == null) {
            return RegisterVerifyEmailResult.FAILURE;
        }
        Date currentDate = new Date();
        if (currentDate.compareTo(existingRegisterCodeEntity.getExpiresAt()) > 0) {
            return RegisterVerifyEmailResult.FAILURE_EXPIRED;
            // 인증번호 시간초과에 대한 것
        }
        existingRegisterCodeEntity.setVerified(true);
        return this.userMapper.updateRegisterCode(existingRegisterCodeEntity) > 0
                ? RegisterVerifyEmailResult.SUCCESS
                : RegisterVerifyEmailResult.FAILURE;
    }


}
