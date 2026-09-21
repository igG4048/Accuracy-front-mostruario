/* =========================
   TROCA DE FOTO DE PERFIL
   (webcam ou upload,
   salva no localStorage)
========================= */

const AVATAR_KEY = "accuracy_avatar";

const cameraBtn = document.getElementById("cameraBtn");

const overlay = document.getElementById("avatarModalOverlay");
const modalClose = document.getElementById("avatarModalClose");

const video = document.getElementById("avatarVideo");
const canvas = document.getElementById("avatarCanvas");
const capturedImg = document.getElementById("avatarCapturedImg");
const placeholder = document.getElementById("avatarPlaceholder");
const hint = document.getElementById("avatarHint");

const actionsDefault = document.getElementById("avatarActionsDefault");
const actionsCamera = document.getElementById("avatarActionsCamera");
const actionsConfirm = document.getElementById("avatarActionsConfirm");

const startCameraBtn = document.getElementById("startCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const cancelCameraBtn = document.getElementById("cancelCameraBtn");

const uploadFileBtn = document.getElementById("uploadFileBtn");
const fileInput = document.getElementById("avatarFileInput");

const saveAvatarBtn = document.getElementById("saveAvatarBtn");
const retakeBtn = document.getElementById("retakeBtn");

const navAvatar = document.getElementById("navAvatar");
const bigAvatar = document.getElementById("bigAvatar");

let stream = null;
let pendingDataUrl = null;


/* =========================
   APLICAR FOTO SALVA
========================= */

function applyAvatar(dataUrl) {

    [navAvatar, bigAvatar].forEach(el => {

        if (!el) {
            return;
        }

        el.style.backgroundImage = `url(${dataUrl})`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        el.textContent = "";

    });

}


const savedAvatar = localStorage.getItem(AVATAR_KEY);

if (savedAvatar) {

    applyAvatar(savedAvatar);

}


/* =========================
   ABRIR / FECHAR MODAL
========================= */

function openModal() {

    overlay.classList.add("show");

    resetModalView();

}


function closeModal() {

    overlay.classList.remove("show");

    stopCamera();

    resetModalView();

}


function resetModalView() {

    pendingDataUrl = null;

    video.classList.add("hidden");
    capturedImg.classList.add("hidden");
    placeholder.classList.remove("hidden");

    actionsDefault.classList.remove("hidden");
    actionsCamera.classList.add("hidden");
    actionsConfirm.classList.add("hidden");

    hint.textContent =
        "Tire uma foto com a câmera do seu computador ou envie uma imagem salva no dispositivo.";

}


cameraBtn.addEventListener("click", openModal);

modalClose.addEventListener("click", closeModal);


overlay.addEventListener("click", event => {

    if (event.target === overlay) {

        closeModal();

    }

});


/* =========================
   LIGAR A CÂMERA
========================= */

async function startCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

        placeholder.classList.add("hidden");
        capturedImg.classList.add("hidden");
        video.classList.remove("hidden");

        actionsDefault.classList.add("hidden");
        actionsCamera.classList.remove("hidden");

        hint.textContent =
            "Posicione o rosto no quadro e clique em capturar.";

    } catch (error) {

        hint.textContent =
            "Não foi possível acessar a câmera. Verifique as permissões do navegador ou envie uma foto do computador.";

    }

}


function stopCamera() {

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

        stream = null;

    }

}


startCameraBtn.addEventListener("click", startCamera);


cancelCameraBtn.addEventListener("click", () => {

    stopCamera();

    resetModalView();

});


/* =========================
   CAPTURAR FOTO
========================= */

captureBtn.addEventListener("click", () => {

    const size = Math.min(video.videoWidth, video.videoHeight);

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    context.drawImage(
        video,
        offsetX,
        offsetY,
        size,
        size,
        0,
        0,
        size,
        size
    );

    pendingDataUrl = canvas.toDataURL("image/png");

    stopCamera();

    video.classList.add("hidden");

    capturedImg.src = pendingDataUrl;
    capturedImg.classList.remove("hidden");

    actionsCamera.classList.add("hidden");
    actionsConfirm.classList.remove("hidden");

    hint.textContent = "Gostou do resultado?";

});


/* =========================
   ENVIAR DO COMPUTADOR
========================= */

uploadFileBtn.addEventListener("click", () => {

    fileInput.click();

});


fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        hint.textContent = "Escolha um arquivo de imagem válido.";

        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        pendingDataUrl = reader.result;

        placeholder.classList.add("hidden");
        video.classList.add("hidden");

        capturedImg.src = pendingDataUrl;
        capturedImg.classList.remove("hidden");

        actionsDefault.classList.add("hidden");
        actionsConfirm.classList.remove("hidden");

        hint.textContent = "Gostou do resultado?";

    };

    reader.readAsDataURL(file);

    fileInput.value = "";

});


/* =========================
   TENTAR NOVAMENTE
========================= */

retakeBtn.addEventListener("click", () => {

    pendingDataUrl = null;

    capturedImg.classList.add("hidden");

    resetModalView();

});


/* =========================
   SALVAR FOTO
========================= */

saveAvatarBtn.addEventListener("click", () => {

    if (!pendingDataUrl) {
        return;
    }

    localStorage.setItem(AVATAR_KEY, pendingDataUrl);

    applyAvatar(pendingDataUrl);

    closeModal();

});