let video;
let label = "Model yükleniyor";
let classifier;
let modelURL = "https://teachablemachine.withgoogle.com/models/lkxoJtDrs/";
let speech;
let lastLabel = "";
let t = 0;
let isSoundOn = true;
let cam = true;

let objectNameButton;
let objectDescriptionButton;
let soundButton;
let sembolButton;

let supportedLangs = ["tr-TR", "en-US", "fr-FR"];
let lang = navigator.language;
if (!supportedLangs.includes(lang)) lang = "tr-TR";

const texts = {
    "tr-TR": {
        unknownSymbol: "Sembol tanınamadı",
        holdCamera: "Kamerayı sembole yaklaştırınız ve sabit tutunuz.",
        loading: "Yükleniyor...",
        aiChat: "AI Sohbet"
    },
    "en-US": {
        unknownSymbol: "Symbol not recognized",
        holdCamera: "Please move the camera closer to the symbol and keep it steady.",
        loading: "Loading...",
        aiChat: "AI Chat"
    },
    "fr-FR": {
        unknownSymbol: "Symbole non reconnu",
        holdCamera: "Veuillez rapprocher la caméra du symbole et la maintenir immobile.",
        loading: "Chargement...",
        aiChat: "Discussion IA"
    }
};

const labelTranslations = {
    "Azizi Fesli Başlık": {
        "tr-TR": "Azizi Fesli Başlık",
        "en-US": "Azizi Fez Headgear",
        "fr-FR": "Coiffe à fez d’Azizi"
    },
    "Bektaşi Mezar Taşı": {
        "tr-TR": "Bektaşi Mezar Taşı",
        "en-US": "Bektashi Tombstone",
        "fr-FR": "Pierre tombale bektachie"
    },
    "Bektaşi Tacı": {
        "tr-TR": "Bektaşi Tacı",
        "en-US": "Bektashi Crown",
        "fr-FR": "Couronne bektachie"
    },
    "Burma Sarıklı Başlık": {
        "tr-TR": "Burma Sarıklı Başlık",
        "en-US": "Twisted Turban Headgear",
        "fr-FR": "Coiffe à turban torsadé"
    },
    "Dardağan Tipi Başlık": {
        "tr-TR": "Dardağan Tipi Başlık",
        "en-US": "Dardaghan Type Headgear",
        "fr-FR": "Coiffe de type Dardaghan"
    },
    "Destarlı Mevlevi Başlığı": {
        "tr-TR": "Destarlı Mevlevi Başlığı",
        "en-US": "Mevlevi Turban Headgear",
        "fr-FR": "Coiffe mevlevie à turban"
    },
    "Fesli Başlık": {
        "tr-TR": "Fesli Başlık",
        "en-US": "Fez Headgear",
        "fr-FR": "Coiffe à fez"
    },
    "Hotoz Başlık": {
        "tr-TR": "Hotoz Başlık",
        "en-US": "Hotoz Headgear",
        "fr-FR": "Coiffe hotoz"
    },
    "Kadın Mezar Başlığı": {
        "tr-TR": "Kadın Mezar Başlığı",
        "en-US": "Female Tombstone Head",
        "fr-FR": "Tête de pierre tombale féminine"
    },
    "Kallavi Kavuk": {
        "tr-TR": "Kallavi Kavuk",
        "en-US": "Kallavi Turban",
        "fr-FR": "Turban kallavi"
    },
    "Katibi Kavuk": {
        "tr-TR": "Katibi Kavuk",
        "en-US": "Katibi Turban",
        "fr-FR": "Turban katibi"
    },
    "Nakşi Başlığı": {
        "tr-TR": "Nakşi Başlığı",
        "en-US": "Naqshi Headgear",
        "fr-FR": "Coiffe naqshie"
    },
    "Nezbeki Başlık": {
        "tr-TR": "Nezbeki Başlık",
        "en-US": "Nezbeki Headgear",
        "fr-FR": "Coiffe nezbeki"
    },
    "Kafesi Destarlı Başlık": {
        "tr-TR": "Kafesi Destarlı Başlık",
        "en-US": "Headgear with Caged Turban",
        "fr-FR": "Coiffe à turban en cage"
    },
    "Örfi Destarlı Başlık": {
        "tr-TR": "Örfi Destarlı Başlık",
        "en-US": "Orfi Turban Headgear",
        "fr-FR": "Coiffe à turban orfi"
    },
    "Kadiri Başlık": {
        "tr-TR": "Kadiri Başlık",
        "en-US": "Qadiri Headgear",
        "fr-FR": "Coiffe qadirie"
    },
    "Gülşeni Tacı": {
        "tr-TR": "Gülşeni Tacı",
        "en-US": "Gulsheni Crown",
        "fr-FR": "Couronne gülşenie"
    }
}


function preload() {
    classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    let constraints = { video: { facingMode: { exact: "environment" } } };
    video = createCapture(constraints);
    video.size(windowWidth, windowHeight);
    video.hide();

    classifyVideo();

    speech = new p5.Speech();
    speech.setLang(lang);

    let homeButton = createImg("anasayfa.png", "Anasayfa");
    homeButton.position(10, 10);
    homeButton.size(40, 35);
    styleButton(homeButton, "#4285F4", "white");
    homeButton.mousePressed(() => { window.location.href = "../index.html"; });

    let cameraButton = createImg("camera.png", "Kamera");
    cameraButton.position(width - 130, 10);
    cameraButton.size(40, 35);
    styleButton(cameraButton, "#4285F4", "white");
    cameraButton.mousePressed(switchCamera);

    soundButton = createImg("ses.png", "Ses");
    soundButton.position(width - 70, 10);
    soundButton.size(40, 35);
    styleButton(soundButton, "#4285F4", "white");
    soundButton.mousePressed(toggleSound);

    sembolButton = createButton("Sembol Ekle");
    sembolButton.position(width - 230, 10);
    sembolButton.size(70, 35);
    styleButton(sembolButton, "#4285F4", "white");
    sembolButton.mousePressed(giveVideo);

    objectNameButton = createButton(label);
    objectNameButton.position(10, height / 2 + 70);
    objectNameButton.size((width * 0.7) - 20, 50);
    styleButton(objectNameButton, "#4285F4", "white");

    let linkButton = createButton(texts[lang].aiChat);
    linkButton.position(width * 0.7, height / 2 + 70);
    linkButton.size((width * 0.3) - 20, 50);
    styleButton(linkButton, "#34A853", "white");
    linkButton.mousePressed(() => {
        window.open("../sohbet.html");
    });

    objectDescriptionButton = createButton(texts[lang].holdCamera);
    objectDescriptionButton.position(10, height / 2 + 130);
    objectDescriptionButton.size(width - 20, height / 2.1 - 120);
    styleButton(objectDescriptionButton, "#F0F2F5", "#607D8B");
}

function styleButton(button, bgColor, textColor) {
    button.style("background-color", bgColor);
    button.style("color", textColor);
    button.style("border", "none");
    button.style("border-radius", "25px");
    button.style("font-size", "16px");
    button.style("font-family", "Arial, sans-serif");
    button.style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.2)");
    button.style("cursor", "pointer");
    button.style("text-align", "center");
}

function gotResults(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    label = results[0].label;
    const translatedLabel = labelTranslations[label]?.[lang] || label;

    if (label !== lastLabel) {
        t = 0;
        lastLabel = label;
        objectNameButton.html(texts[lang].unknownSymbol);
        objectDescriptionButton.html(texts[lang].holdCamera);
        classifyVideo();
    } else {
        if (t >= 2000) {
            t = -Infinity;
            objectNameButton.html(translatedLabel);
            fetchDescriptionFromChatGPT(translatedLabel);  // Bu artık her durumda çağrılır
        }
        classifyVideo();
    }
}

async function fetchDescriptionFromChatGPT(objectName) {
    objectDescriptionButton.html(texts[lang].loading);

    try {
        const response = await fetch("api/chatgpt.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemPrompt: `Sen Osmanlı Mezar Taşı başlıkları ve sembolleri konusunda uzmansın. Kullanıcının kamerasında görünen sembolün kısa, anlaşılır ve eğitici açıklamasını yap. Açıklama ${lang} dilinde olmalı. Açıklamanın sonunda sohbet sayfasına yönlendiren sıcak bir cümleyle bitir. Bilgiler Osmanlı taşındaki başlıklar ve semboller hakkında olacak. Başka bir bağlamda bilgi verilmeyecek. Ekranda görsel değiştiğinde konuşmayı bitir.`,
                userPrompt: `Lütfen şu sembolü ${lang} dilinde açıkla ve sohbet sayfasına yönlendir: ${objectName}`,
                lang: lang
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const description = data.message.trim();
        objectDescriptionButton.html(description);

        if (isSoundOn) {
            speech.cancel();
            speech.speak(description);
        }

    } catch (error) {
        console.error("API hatası:", error);
        objectDescriptionButton.html("Açıklama alınamadı.");
    }
}


function classifyVideo() {
    classifier.classify(video, gotResults);
}

function switchCamera() {
    cam = !cam;
    video.remove();
    let facingMode = cam ? "environment" : "user";
    video = createCapture({ video: { facingMode: facingMode } });
    video.size(windowWidth, windowHeight);
    video.hide();
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    soundButton.attribute("src", isSoundOn ? "ses.png" : "sessiz.png");
}

function giveVideo() {
    let onay = confirm("UYARI !!! Çekeceğiniz fotoğraf veri setine eklenmek üzere veri tabanımıza yüklenecektir. Sadece sembol görünecek şekilde fotoğraf çekiniz");
    if (onay) {
        let cevap = confirm("Sembolün adını biliyor musunuz?");
        video.loadPixels();
        let img = video.canvas.toDataURL("image/png");
        let veri = { image: img };
        if (cevap) {
            let metin = prompt("Sembolün adını yazınız:");
            if (metin) veri.text = metin;
        }
        fetch("kaydet.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(veri)
        }).then(() => alert("Sembol kaydedildi. Katkınız için teşekkür ederiz. Kamera görüntüsü gelmezse ekranı yenileyiniz."));
    }
}

function draw() {
    background("#F5F5F5");
    fill("#FFFFFF");
    noStroke();
    rect(0, 0, width, 60);

    let videoWidth, videoHeight;
    let x, y;

    if (windowWidth < 768) {
        videoHeight = windowHeight * 0.8;
        videoWidth = videoHeight * (video.width / video.height);
        x = (windowWidth - videoWidth) / 2;
        y = 65;
    } else {
        videoHeight = 360;
        videoWidth = videoHeight * (video.width / video.height);
        x = (windowWidth - videoWidth) / 2;
        y = 50;
    }

    rect(x, y, videoWidth, videoHeight, 20);
    image(video, x, y, videoWidth, videoHeight);

    t += deltaTime;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(windowWidth, windowHeight);
}
