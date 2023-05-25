const addressLayer = document.getElementById('addressLayer');
const registerForm = document.getElementById('registerForm');

addressLayer.show = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            registerForm['addressPostal'].value = data.zonecode;
            registerForm['addressPrimary'].value = data.address;
            registerForm['addressSecondary'].value = '';
            registerForm['addressSecondary'].focus();
            dialogCover.hide();
            addressLayer.hide();
            console.log(data);
        }
    }).embed(addressLayer);
    addressLayer.classList.add('visible');
}
addressLayer.hide = () => addressLayer.classList.remove('visible');

registerForm.onsubmit = e => {
    e.preventDefault();
    if (registerForm.classList.contains('step-1')) {
        if (!registerForm['agreeTerm'].checked) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '서비스 이용약관을 읽고 동의해 주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
            // registerForm['agreeTerm'].focus();
            return;
        }
        if (!registerForm['agreePrivacy'].checked) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '개인정보 처리방침을 읽고 동의해주세요',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
            return;
        }
        registerForm.classList.remove('step-1');
        registerForm.classList.add('step-2');
    } else if (registerForm.classList.contains('step-2')) {
        if (!registerForm['emailSend'].disabled || !registerForm['emailVerify'].disabled) {
            dialogCover.show();
            dialogLayer.show({
                title: '회원가입',
                content: '먼저 이메일 인증을 완료해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                }
            });
            return;
        }
        if (registerForm['nickname'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '별명을 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['nickname'].focus();
                }
            });
            return;
        }
        if (registerForm['password'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '비밀번호를 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['password'].focus();
                }
            });
            return;
        }
        if (registerForm['passwordCheck'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '비밀번호를 다시 한번 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['passwordCheck'].focus();
                }
            });
            return;
        }
        if (registerForm['passwordCheck'].value !== registerForm['password'].value) {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '비밀번호가 일치하지 않습니다.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['passwordCheck'].focus();
                }
            });
            return;
        }
        if (registerForm['addressPostal'].value === '' && registerForm['addressPrimary'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '주소 찾기를 통해 주소를 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['addressPrimary'].focus();
                }
            });
            return;
        }
        if (registerForm['addressSecondary'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '상세 주소를 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['addressSecondary'].focus();
                }
            });
            return;
        }
        if (registerForm['gender'].value === '성별') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '성별을 선택해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['gender'].focus();
                }
            });
            return;
        }
        if (registerForm['name'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '실명을 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['name'].focus();
                }
            });
            return;
        }
        if (registerForm['birth'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '생년월일을 선택해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['birth'].focus();
                }
            });
            return;
        }
        if (registerForm['contact'].value === '') {
            dialogCover.show();
            dialogLayer.show({
                title: '경고',
                content: '연락처를 입력해 주세요.',
                onConfirm: e => {
                    e.preventDefault();
                    dialogCover.hide();
                    dialogLayer.hide();
                    registerForm['contact'].focus();
                }
            });
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('email', registerForm['email'].value);
        formData.append('code', registerForm['emailCode'].value);
        formData.append('salt', registerForm['emailSalt'].value);
        formData.append('password', registerForm['password'].value);
        formData.append('nickname', registerForm['nickname'].value);
        formData.append('addressPostal', registerForm['addressPostal'].value);
        formData.append('addressPrimary', registerForm['addressPrimary'].value);
        formData.append('addressSecondary', registerForm['addressSecondary'].value);
        formData.append('gender', registerForm['gender'].value);
        formData.append('name', registerForm['name'].value);
        formData.append('birthStr', registerForm['birth'].value);
        formData.append('contactProvider', registerForm['contactProvider'].value);
        formData.append('contact', registerForm['contact'].value);

        xhr.open('POST', './register');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // console.log(xhr.responseText)
                    const responseObject = JSON.parse(xhr.responseText);
                    switch (responseObject['result']) {
                        case 'failure_email_duplicate':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '회원가입',
                                content: '이미 존재하는 이메일 입니다.<br><br>다시 작성해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'failure_nickname_duplicate':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '회원가입',
                                content: '이미 존재하는 닉네임 입니다.<br><br>다시 작성해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'failure_email_not_verified':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '회원가입',
                                content: '인증 되지 않은 이메일 입니다.<br><br>다시 확인해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'failure_contact_duplicate':
                            dialogCover.show();
                            dialogLayer.show({
                                title: '회원가입',
                                content: '이미 존재하는 연락처 입니다..<br><br>다시 작성해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                            break;
                        case 'success':
                            registerForm.classList.remove('step-2');
                            registerForm.classList.add('step-3');
                            break;
                        case 'failure':
                        default:
                            dialogCover.show();
                            dialogLayer.show({
                                title: '회원가입',
                                content: '알 수 없는 이유로 회원가입에 실패하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                                onConfirm: e => {
                                    e.preventDefault();
                                    dialogCover.hide();
                                    dialogLayer.hide();
                                }
                            });
                    }
                } else {
                    dialogCover.show();
                    dialogLayer.show({
                        title: '실패',
                        content: '실패 하였습니다<br><br>다시', onConfirm: e => {
                            e.preventDefault();
                            dialogCover.hide();
                            dialogLayer.hide();
                        }
                    });
                }
            }
        };
        xhr.send(formData);
    }
};

registerForm['addressFind'].onclick = () => {
    dialogCover.show(); // 우편번호 찾기 눌렀을시 나머지 배경 회색
    addressLayer.show();

};

registerForm['emailSend'].onclick = () => {
    if (registerForm['email'].value === '') {
        dialogLayer.show({
            title: '경고',
            content: '이메일을 입력해 주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                registerForm['email'].focus();
            }
        });
        return;
    }
    dialogCover.show(); // 인증번호 보낸후 검은창화면 서버 부담을 줄여주기위해서 중복클릭 방지.
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', registerForm['email'].value);
    xhr.open('POST', './registerSendEmail')
    xhr.onreadystatechange = () => {
        //돌아오는 응답(RegisterSendEmailResult) 확인해서 DialogLayer 띄우기
        //failure -> 알수 없는 이유로 실패했다 ~
        //failure_email_duplicate -> 이미 사용 중인 이메일이다.
        //success -> 이메일로 인증 번호를 전송했다 확인해라 제한시간은 10분이다.
        // >> email, emailSend 비활성화 시키고
        // >> emailCode, emailVerify 활성화시키고
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText); // JASON.parse(x) : 문자열인 x를 JS 오브젝트(혹은 배열)로 변환해
                switch (responseObject['result']) {
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '알 수 없는 이유로 이메일 인증코드 전송에 실패하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                        break;
                    case 'failure_email_duplicate':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '입력하신 이메일 주소는 이미 사용 중입니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                                registerForm['email'].focus();
                                registerForm['email'].select();
                            }
                        });
                        break;
                    case 'success':
                        registerForm['email'].setAttribute('disabled', 'disabled');
                        registerForm['emailSend'].setAttribute('disabled', 'disabled');
                        registerForm['emailCode'].removeAttribute('disabled');
                        registerForm['emailVerify'].removeAttribute('disabled');
                        registerForm['emailSalt'].value = responseObject['salt']
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '입력한 이메일로 인증번호 여섯자리를 전송하였습니다.<br><br>전송된 인증번호는 10분간 유효합니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                                registerForm['emailCode'].focus();
                            }
                        });
                        break;
                    default:


                }
            } else {
                dialogCover.show();
                dialogLayer.show({
                    title: '통신 오류',
                    content: '서버와 통신하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                    onConfirm: e => {
                        e.preventDefault();
                        dialogCover.hide();
                        dialogLayer.hide();
                    }
                });
            }
        }
    };
    xhr.send(formData);
};

registerForm['emailVerify'].onclick = () => {
    if (registerForm['emailCode'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '경고',
            content: '이메일 인증번호를 입력해 주세요.',
            onConfirm: e => {
                e.preventDefault();
                dialogCover.hide();
                dialogLayer.hide();
                registerForm['emailCode'].focus();
            }
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', registerForm['email'].value);
    formData.append('code', registerForm['emailCode'].value);
    formData.append('salt', registerForm['emailSalt'].value);
    xhr.open('POST', './registerVerifyEmail');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject['result']) {
                    case 'failure':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '알 수 없는 이유로 이메일 인증에 실패하였습니다 <br><br>잠시 후 다시 시도해주세요',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                        break;
                    case 'failure_expired':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '해당 코드는 이미 만료되었습니다. <br><br> 처음부터 다시 진행해 주세요.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                            }
                        });
                        break;
                    case 'success':
                        dialogCover.show();
                        dialogLayer.show({
                            title: '이메일 인증',
                            content: '이메일 인증에 성공하였습니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                                registerForm['emailCode'].setAttribute('disabled', 'disabled');
                                registerForm['emailVerify'].setAttribute('disabled', 'disabled');
                                registerForm['nickname'].focus();
                            }
                        });
                        break;
                    default:
                }
            }
        }

    };
    xhr.send(formData)
    // 클라이언트 측
    // 요청 방식 : POST
    // 요청 주소 : /registerVerifyEmail
    // 보낼 데이터 :
    //      - 'email' : registerForm['email'].value
    //      - 'code'  : registerForm['emailCode'].value
    //      - 'salt' : registerForm['emailSalt'].value

    //  서버측
    // (1) RegisterVerifyEmailResult 열거형을 만들고 아래 인자를 추가한다.
    //      - FAILURE
    //      - FAILURE_EXPIRED
    //      - SUCCESS
    // (2) 전달 받은 email, code, salt를 기준으로 RegisterCodeEntity를 DB에서 SELECT 해온다.
    // (3) 위 '(2)'의 결과가 null일 경우 email, code, salt 중 하나 이상에 문제가 있다는 의미임으로 FAILURE를 반환한다.
    // (4) 위 '(2)'의 결과가 null은 아닌데, 현재 시간보다 expiresAt이 과거인 경우, 만료되었다는 의미임으로 FAILURE_EXPIRED를 반환한다.
    //  Java에서 두 개의 Date 타입 객체를 비교하기 위한 메서드 compareTo가 존재한다. x.compareTo(y)의 결과가 양수일 경우 x가 큼을, 음수일 경수 y가 큼을 의미한다.
    // (5) 위 '(3)' 및 '(4)'가 거짓일때, 정상 인증시켜야 함으로 '(2)'의 객체의 'isVerified'를 true로 설정하고 UPDATE한 뒤 SUCCESS를 반환한다.

    // 클라이언트 측
    // (1) 위 요청에 대한 응답 결과에 따른 올바른 처리를한다.
    //      - 단, 그결과가 SUCCESS에 준할 경우 registerForm['emailCode'] 및 registerForm['emailVerify']를 비활성화한다.

}


// const xhr = new XMLHttpRequest();
// const formData = new FormData();
// formData.append('email', registerForm['email'].value);
// xhr.open('POST', './registerSendEmail')
// xhr.onreadystatechange = () => {
//     //돌아오는 응답(RegisterSendEmailResult) 확인해서 DialogLayer 띄우기
//     //failure -> 알수 없는 이유로 실패했다 ~
//     //failure_email_duplicate -> 이미 사용 중인 이메일이다.
//     //success -> 이메일로 인증 번호를 전송했다 확인해라 제한시간은 10분이다.
//     // >> email, emailSend 비활성화 시키고
//     // >> emailCode, emailVerify 활성화시키고
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status >= 200 && xhr.status < 300)
//             if (responseText === 'success') {
//                 // // location.href += '';
//                 // dialogLayer.show({
//                 //     title: 'SUCCESS',
//                 //     content: '이메일로 인증 번호를 전송했다 확인해라 제한시간은 10분입니다..'
//                 // })
//                 dialogCover.show();
//                 dialogLayer.show({
//                     title: '성공',
//                     content: '이메일로 인증 번호를 전송했습니다. 제한시간은 10분입니다.',
//                     onConfirm: e => {
//                         e.preventDefault();
//                         dialogCover.hide();
//                         dialogLayer.hide();
//                         registerForm['email'].disabled = true;
//                         // registerForm에서 html에 name의 값 'email'을 불러와서 .disabled를 이용하여 true 값을 주면 비활성화가 되고 false 값을 주면 활성화가 된다.
//                         registerForm['emailSend'].disabled = true;
//                         registerForm['emailVerify'].disabled = false;
//                         registerForm['emailCode'].disabled = false;
//                     }
//                 });
//                 // registerForm['agreeTerm'].focus();
//                 return;
//
//             } else if (responseText === 'FAILURE'){
//                 dialogCover.show();
//                 dialogLayer.show({
//                     title: '실패',
//                     content: '알 수 없는 이유로 전송을 실패했습니다.',
//                     onConfirm: e => {
//                         e.preventDefault();
//                         dialogCover.hide();
//                         dialogLayer.hide();
//                     }
//                 })
//             } else if (responseText === 'FAILURE_EMAIL_DUPLICATE') {
//                 dialogCover.show();
//                 dialogLayer.show({
//                     title: '중복',
//                     content: '이미 사용 중인 이메일입니다.',
//                     onConfirm: e => {
//                         e.preventDefault();
//                         dialogCover.hide();
//                         dialogLayer.hide();
//                     }
//                 })
//             }
//         }
//     }
// };

// // 'POST : ./registerSendEmail' 로, email로, INSERT 되는지 확인





