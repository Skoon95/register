const loginForm = document.getElementById('loginForm');

loginForm.onsubmit = e => {
    e.preventDefault();

    if (loginForm['email'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '로그인',
            content: '이메일을 입력해주세요',
            onConfirm: e => {
                e.preventDefault()
                dialogCover.hide();
                dialogLayer.hide();
                loginForm['email'].focus();
            }
        });
        return;
    }
    if (loginForm['password'].value === '') {
        dialogCover.show();
        dialogLayer.show({
            title: '비밀번호',
            content: '비밀번호를 입력해주세요',
            onConfirm: e => {
                e.preventDefault()
                dialogCover.hide();
                dialogLayer.hide();
                loginForm['password'].focus();
            }
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginForm['email'].value);
    formData.append('password', loginForm['password'].value);
    xhr.open('POST', '/login')
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject['result']) {
                    case 'success':
                        location.href += '';
                        break;
                    case 'failure':
                    default:
                        dialogCover.show();
                        dialogLayer.show({
                            title: '실패!',
                            content: ' 아이디 및 비밀번호가 틀렸습니다.',
                            onConfirm: e => {
                                e.preventDefault();
                                dialogCover.hide();
                                dialogLayer.hide();
                                loginForm['email'].focus();
                                loginForm['email'].select();
                            }
                        });

                }

            } else {
                dialogCover.show();
                dialogLayer.show({
                    title: '통신오류',
                    content: '다시 시도해주세요',
                    onConfirm: e => {
                        e.preventDefault()
                        dialogCover.hide();
                        dialogLayer.hide();
                        loginForm['password'].focus();
                    }
                });
                return;
            }
        }
    };
    xhr.send(formData);

};