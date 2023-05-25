const dialogCover = document.getElementById('dialogCover');
const dialogLayer = document.getElementById('dialogLayer');

dialogCover.show = () => {
    document.body.setAttribute('style', 'overflow: hidden');
    dialogCover.classList.add('visible');

};

dialogCover.hide = () => {
    document.body.removeAttribute('style');
    dialogCover.classList.remove('visible');

};


dialogLayer.show = (params) => {
    dialogLayer.querySelector('[rel="title"]').innerText = params.title;
    dialogLayer.querySelector('[rel="content"]').innerHTML = params.content;
    const cancelButton = dialogLayer.querySelector('[rel="cancel"]');
    if (typeof params['onCancel'] === 'function') {
        cancelButton.style.display = 'inline-block';
        cancelButton.onclick = params['onCancel'];
    } else {
        cancelButton.style.display = 'none';
    }
    dialogLayer.querySelector('[rel="confirm"]').onclick = params['onConfirm'];
    dialogLayer.classList.add('visible');
};

dialogLayer.hide = () => {
    dialogLayer.classList.remove('visible');
};