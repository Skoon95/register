package com.ghchoi.studywebuser.controllers;


import com.ghchoi.studywebuser.entities.RegisterCodeEntity;
import com.ghchoi.studywebuser.entities.UserEntity;
import com.ghchoi.studywebuser.enums.user.LoginResult;
import com.ghchoi.studywebuser.enums.user.RegisterResult;
import com.ghchoi.studywebuser.enums.user.RegisterSendEmailResult;
import com.ghchoi.studywebuser.enums.user.RegisterVerifyEmailResult;
import com.ghchoi.studywebuser.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping(value = "/")
public class HomeController {

    private final UserService userService;

    @Autowired
    public HomeController(UserService userService) {
        this.userService = userService;
    }


    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public ModelAndView getLogout(HttpSession session) {
        session.setAttribute("user", null);
        ModelAndView modelAndView = new ModelAndView("redirect:/login");
        return modelAndView;
    }

    @RequestMapping(value = "register", method = RequestMethod.GET)
    public ModelAndView getRegister() {
        ModelAndView modelAndView = new ModelAndView("home/register");
        return modelAndView;
    }


    @RequestMapping(value = "register", method = RequestMethod.POST)
    @ResponseBody
    public String postRegister(RegisterCodeEntity registerCode,
                               UserEntity user,
                               @RequestParam(value = "birthStr") String birthStr) throws ParseException, NoSuchAlgorithmException {
        Date birth = new SimpleDateFormat("yyyy-MM-dd").parse(birthStr);
        user.setBirth(birth);
        RegisterResult result = this.userService.register(registerCode, user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public ModelAndView getLogin() {
        ModelAndView modelAndView = new ModelAndView("home/login");
        return modelAndView;
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public String postLogin(HttpSession session,
                            UserEntity user) throws NoSuchAlgorithmException {
        LoginResult result = this.userService.login(user);
        if (result == LoginResult.SUCCESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
            // -> 이 부분을 함축 한 것. responseObject.put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "registerSendEmail", method = RequestMethod.POST)
    @ResponseBody
    public String postRegisterSendEmail(RegisterCodeEntity registerCodeEntity) throws NoSuchAlgorithmException {
        RegisterSendEmailResult result = this.userService.registerSendEmailResult(registerCodeEntity);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == RegisterSendEmailResult.SUCCESS) {
            responseObject.put("salt", registerCodeEntity.getSalt());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "registerVerifyEmail", method = RequestMethod.POST)
    @ResponseBody
    public String postRegisterVerifyEmail(RegisterCodeEntity registerCodeEntity) throws
            NoSuchAlgorithmException {
        RegisterVerifyEmailResult result = this.userService.registerVerifyEmailResult(registerCodeEntity);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

}


// 클라이언트 측
// 요청 방식 : POST
// 요청 주소 : /registerVerifyEmail
// 보낼 데이터 :
//      - 'email' : registerForm['email'].value
//      - 'code'  : registerForm['emailCode'].value
//      - 'salt' : registerForm['emailSalt'].value
