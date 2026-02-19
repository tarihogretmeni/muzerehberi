let video;
let label = "Model yükleniyor";
let classifier;
let modelURL = "./model/";
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

// ESKİ labelTranslations BLOĞUNU SİL ve yerine bunu yapıştır:
const labelTranslations = {
  "Ağabani - Tüccar Sarığı": {
    "tr-TR": "Ağabani - Tüccar Sarığı",
    "en-US": "Aghabani Merchant Turban",
    "fr-FR": "Turban marchand aghabani"
  },
  "Mücevveze Başlık": {
    "tr-TR": "Mücevveze Başlık",
    "en-US": "Mucevveze Headgear",
    "fr-FR": "Coiffe mucevveze"
  },
  "Sarıklı Fes": {
    "tr-TR": "Sarıklı Fes",
    "en-US": "Turbaned Fez",
    "fr-FR": "Fès avec turban"
  },
  "Azizi Fes": {
    "tr-TR": "Azizi Fes",
    "en-US": "Azizi Fez",
    "fr-FR": "Fès azizi"
  },
  "Hamidi Fes": {
    "tr-TR": "Hamidi Fes",
    "en-US": "Hamidi Fez",
    "fr-FR": "Fès hamidi"
  },
  "Mahmudi Fes": {
    "tr-TR": "Mahmudi Fes",
    "en-US": "Mahmudi Fez",
    "fr-FR": "Fès mahmudi"
  },
  "Hartavi Başlık": {
    "tr-TR": "Hartavi Başlık",
    "en-US": "Hartavi Headgear",
    "fr-FR": "Coiffe hartavi"
  },
  "Horasani Başlık": {
    "tr-TR": "Horasani Başlık",
    "en-US": "Khorasani Headgear",
    "fr-FR": "Coiffe khorasani"
  },
  "İlmiye Sarığı": {
    "tr-TR": "İlmiye Sarığı",
    "en-US": "Ilmiye Turban",
    "fr-FR": "Turban ilmiye"
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
  "Katibi Başlık": {
    "tr-TR": "Katibi Başlık",
    "en-US": "Katibi Headgear",
    "fr-FR": "Coiffe katibi"
  },
  "Selimi": {
    "tr-TR": "Selimi",
    "en-US": "Selimi Headgear",
    "fr-FR": "Coiffe selimi"
  },
  "Nezkep Başlık": {
    "tr-TR": "Nezkep Başlık",
    "en-US": "Nezkep Headgear",
    "fr-FR": "Coiffe nezkeep"
  },
  "Paşalı Kavuk": {
    "tr-TR": "Paşalı Kavuk",
    "en-US": "Pashali Turban",
    "fr-FR": "Turban pacha"
  },
  "Ulema Sarığı": {
    "tr-TR": "Ulema Sarığı",
    "en-US": "Ulema Turban",
    "fr-FR": "Turban ouléma"
  },
  "Börk - Yeniçeri Başlığı": {
    "tr-TR": "Börk - Yeniçeri Başlığı",
    "en-US": "Janissary Bork Headgear",
    "fr-FR": "Börk de janissaire"
  },
  "Çatal Kalafat": {
    "tr-TR": "Çatal Kalafat",
    "en-US": "Forked Kalafat",
    "fr-FR": "Kalafat bifurqué"
  },
  "Dardağan Başlık": {
    "tr-TR": "Dardağan Başlık",
    "en-US": "Dardaghan Headgear",
    "fr-FR": "Coiffe dardağan"
  },
  "Kuka Başlık": {
    "tr-TR": "Kuka Başlık",
    "en-US": "Kuka Headgear",
    "fr-FR": "Coiffe kuka"
  },
  "Üsküf Yeniçeri Başlığı": {
    "tr-TR": "Üsküf Yeniçeri Başlığı",
    "en-US": "Janissary Uskuf Headgear",
    "fr-FR": "Üsküf de janissaire"
  },
  "Serdengeçti Başlığı": {
    "tr-TR": "Serdengeçti Başlığı",
    "en-US": "Serdengeçti Headgear",
    "fr-FR": "Coiffe serdengeçti"
  },
  "Zerrin Başlık": {
    "tr-TR": "Zerrin Başlık",
    "en-US": "Zerrin Headgear",
    "fr-FR": "Coiffe zerrin"
  },
  "Mevlevi Tacı": {
    "tr-TR": "Mevlevi Tacı",
    "en-US": "Mevlevi Crown",
    "fr-FR": "Couronne mevlevie"
  },
  "Kadiri Tacı": {
    "tr-TR": "Kadiri Tacı",
    "en-US": "Qadiri Crown",
    "fr-FR": "Couronne qadirie"
  },
  "Akantus Motifi": {
    "tr-TR": "Akantus Motifi",
    "en-US": "Acanthus Motif",
    "fr-FR": "Motif d’acanthe"
  },
  "Asma-Üzüm Motifi": {
    "tr-TR": "Asma-Üzüm Motifi",
    "en-US": "Vine & Grape Motif",
    "fr-FR": "Motif vigne et raisin"
  },
  "Gül Motifi": {
    "tr-TR": "Gül Motifi",
    "en-US": "Rose Motif",
    "fr-FR": "Motif de rose"
  },
  "Penç Motifi": {
    "tr-TR": "Penç Motifi",
    "en-US": "Penc Motif",
    "fr-FR": "Motif penç"
  },
  "Servi Ağacı Motifi": {
    "tr-TR": "Servi Ağacı Motifi",
    "en-US": "Cypress Tree Motif",
    "fr-FR": "Motif cyprès"
  },
  "Şukufe": {
    "tr-TR": "Şukufe",
    "en-US": "Floral Ornament (Şukufe)",
    "fr-FR": "Ornement floral (şukufe)"
  },
  "Vazo": {
    "tr-TR": "Vazo",
    "en-US": "Vase",
    "fr-FR": "Vase"
  },
  "Lale": {
    "tr-TR": "Lale",
    "en-US": "Tulip",
    "fr-FR": "Tulipe"
  }
};



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
    // Eğer offline isek, direkt mesaj göster
    if (!navigator.onLine) {
        const msg = "İnternet yok, açıklama gösterilemiyor.";
        objectDescriptionButton.html(msg);

        if (isSoundOn && speech) {
            speech.cancel();
            speech.speak(msg);
        }
        return;
    }

    // Online isek ChatGPT'den çek
    objectDescriptionButton.html(texts[lang].loading);

    try {
        const response = await fetch("https://muzerehberi.com.tr/api/chatgpt.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemPrompt: `Sen Osmanlı Mezar Taşı başlıkları ve sembolleri konusunda uzmansın. Kullanıcının kamerasında görünen sembolün adını söyle ve bir cümle ile bu başlığın sosyal hayatta kimler tarafından kullanıldığını açıkla. Açıklama ${lang} dilinde olmalı. Açıklamanın sonunda sohbet sayfasına yönlendiren sıcak bir cümleyle bitir. Bilgiler Osmanlı taşındaki başlıklar ve semboller hakkında olacak. Başka bir bağlamda bilgi verilmeyecek. Ekranda görsel değiştiğinde konuşmayı bitir.`,
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

        if (isSoundOn && speech) {
            speech.cancel();
            speech.speak(description);
        }

    } catch (error) {
        console.error("API hatası:", error);
        const msg = "Açıklama alınamadı.";
        objectDescriptionButton.html(msg);

        if (isSoundOn && speech) {
            speech.cancel();
            speech.speak(msg);
        }
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
