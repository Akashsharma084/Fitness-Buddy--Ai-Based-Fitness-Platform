
/* 🔐 LOGIN SYSTEM */

const loginScreen = document.getElementById("loginScreen");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const loginName = document.getElementById("loginName");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
/* 👤 PROFILE DASHBOARD */
const profileBox = document.getElementById("profileBox");
const profileName = document.getElementById("profileName");
const logoutBtn = document.getElementById("logoutBtn");

/* REGISTER */
registerBtn.onclick = () => {

    const user = {
        name: loginName.value,
        email: loginEmail.value,
        password: loginPassword.value
    };

    if(!user.email || !user.password){
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("fitnessUser", JSON.stringify(user));

    alert("Registered Successfully 🚀");
};

/* LOGIN */
loginBtn.onclick = () => {

    const stored = JSON.parse(localStorage.getItem("fitnessUser"));

    if(!stored){
        alert("No user found, please register first");
        return;
    }

    if(
        loginEmail.value === stored.email &&
        loginPassword.value === stored.password
    ){
        alert("Login Success 🔥 Welcome " + stored.name);

        loginScreen.style.display = "none"; // hide login

    } else {
        alert("Invalid credentials ❌");
    }
    if(
    loginEmail.value === stored.email &&
    loginPassword.value === stored.password
){
    alert("Login Success 🔥 Welcome " + stored.name);

    loginScreen.style.display = "none";

    /* 👤 SHOW PROFILE */
    profileBox.style.display = "block";
    logoutBtn.style.display = "block";
    profileName.innerText = stored.name;

    localStorage.setItem("loggedIn", "true");
}
};

/* AUTO CHECK LOGIN */
window.onload = () => {

    const stored = localStorage.getItem("fitnessUser");

    if(stored){
        loginScreen.style.display = "none";
    }

    addBotMsg("👋 Hello Buddy..");
    window.onload = () => {

    const stored = JSON.parse(localStorage.getItem("fitnessUser"));
    const loggedIn = localStorage.getItem("loggedIn");

    if(stored && loggedIn === "true"){
        loginScreen.style.display = "none";

        profileBox.style.display = "block";
        logoutBtn.style.display = "block";
        profileName.innerText = stored.name;
    }

    addBotMsg("👋 Hello Buddy..");
};
};
logoutBtn.onclick = () => {

    localStorage.removeItem("loggedIn");

    profileBox.style.display = "none";
    logoutBtn.style.display = "none";

    loginScreen.style.display = "flex";

    alert("Logged out 🚪");
};
/* =========================
   🔽 DROPDOWN
========================= */
const dropdown = document.getElementById("dropdown");
const btn = dropdown?.querySelector(".dropdown-btn");
const items = dropdown?.querySelectorAll(".dropdown-menu div");

if (btn) {
btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
});
}

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
    }
});

/* =========================
   🤖 CHAT SYSTEM
========================= */
const chatToggle = document.getElementById("chatToggle");
const chatbox = document.getElementById("chatbox");
const closeChat = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("userInput");

chatToggle.onclick = () => chatbox.classList.add("active");
closeChat.onclick = () => chatbox.classList.remove("active");

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function scrollBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMsg(text) {
    const div = document.createElement("div");
    div.className = "user-msg";
    div.innerText = text;
    chatBody.appendChild(div);
    scrollBottom();
}

function addBotMsg(text) {
    const div = document.createElement("div");
    div.className = "bot-msg";
    chatBody.appendChild(div);

    let i = 0;
    function typing() {
        if (i < text.length) {
            div.innerText += text.charAt(i);
            i++;
            setTimeout(typing, 10);
        } else {
            scrollBottom();
        }
    }
    typing();

    return div;
}

/* ========================= */
/* 🤖 GEMINI AI */
/* ========================= */

async function getAIResponse(userMsg){

    const API_KEY = "AIzaSyDn0Kr2dh-dPQYmRZp_EenPtuZBrlo7sV4";

    try{
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "You are a fitness trainer. Give short clean answers.\nUser: " + userMsg
                        }]
                    }]
                })
            }
        );

        const data = await res.json();

        if(data.candidates?.length){
            return data.candidates[0].content.parts[0].text;
        }

        return "No response";

    }catch(err){
        return "Error";
    }
}

/* ========================= */
/* SEND MESSAGE */
/* ========================= */

async function sendMessage(){
    let msg = input.value.trim();
    if(!msg) return;

    addUserMsg(msg);
    input.value="";

    addBotMsg("Typing...");

    const reply = await getAIResponse(msg);
    chatBody.lastChild.innerText = reply;
    scrollBottom();
}


/* =========================
   🏋️ WORKOUT SYSTEM (FIXED)
========================= */
const panel = document.getElementById("workoutPanel");
const closePanel = document.getElementById("closePanel");
const slider = document.getElementById("gifContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let autoSlide;

const workoutData = {
    chest: ["chest1.gif","chest2.gif","chest3.gif","chest4.gif","chest5.gif"],
    back: ["back1.gif","back2.gif","back3.gif","back4.gif","back5.gif"],
    shoulder: ["shoulder1.gif","shoulder2.gif","shoulder3.gif","shoulder4.gif","shoulder5.gif"],
    arms: ["biceps1.gif","biceps2.gif","biceps3.gif","triceps1.gif","triceps2.gif"],
    all: ["chest1.gif","chest2.gif","chest3.gif","chest4.gif","chest5.gif","back1.gif","back2.gif","back3.gif","back4.gif","back5.gif","shoulder1.gif","shoulder2.gif","shoulder3.gif","shoulder4.gif","shoulder5.gif","biceps1.gif","biceps2.gif","biceps3.gif","triceps1.gif","triceps2.gif"]
};

function openWorkout(type) {
    slider.innerHTML = "";
    currentIndex = 0;

    const gifs = workoutData[type];
    if (!gifs) return;

    gifs.forEach(g => {
        const div = document.createElement("div");
        div.className = "gif-slide";
        div.innerHTML = `<img src="${g}">`;
        slider.appendChild(div);
    });

    document.getElementById("panelTitle").innerText = type;
    panel.classList.add("active");

    startAuto();
}

function goToSlide(index) {
    const cards = document.querySelectorAll(".gif-slide");
    if (!cards.length) return;

    currentIndex = (index + cards.length) % cards.length;

    const cardWidth = cards[0].offsetWidth + 20;

    slider.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth"
    });
}

function startAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 3000);
}

nextBtn.onclick = () => goToSlide(currentIndex + 1);
prevBtn.onclick = () => goToSlide(currentIndex - 1);

closePanel.onclick = () => {
    panel.classList.remove("active");
    clearInterval(autoSlide);
};

/* dropdown */
items.forEach(item => {
    item.addEventListener("click", () => {
        const text = item.innerText.toLowerCase();

        let type = "all";
        if (text.includes("chest")) type = "chest";
        else if (text.includes("back")) type = "back";
        else if (text.includes("shoulder")) type = "shoulder";
        else if (text.includes("biceps")) type = "arms";
        else if (text.includes("all")) type = "all";

        openWorkout(type);

        dropdown.classList.remove("active");
    });
});

/* =========================
   🎤 VOICE ASSISTANT (FIXED)
========================= */
const voiceToggle = document.getElementById("voiceToggle");
const voiceAssistant = document.getElementById("voiceAssistant");
const closeVoice = document.getElementById("closeVoice");
const voiceStatus = document.getElementById("voiceStatus");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
}

voiceToggle.onclick = () => {
    voiceAssistant.classList.add("active");
    voiceStatus.innerText = "Listening...";

    if ("speechSynthesis" in window) {
    speechSynthesis.speak(
        new SpeechSynthesisUtterance("Hello Akash")
    );
}

    if (recognition) recognition.start();
};

closeVoice.onclick = () => {
    voiceAssistant.classList.remove("active");
};

if (recognition) {

    recognition.onresult = async (event) => {

        const text =
        event.results[0][0].transcript.toLowerCase();

        voiceStatus.innerText = text;

        addUserMsg(text);

        voiceAssistant.classList.remove("active");
        chatbox.classList.add("active");

        let commandReply = "";

        /* 🔥 WORKOUT COMMANDS */

        if (text.includes("chest")) {

            openWorkout("chest");
            commandReply = "Opening chest workout";

        }

        else if (text.includes("back")) {

            openWorkout("back");
            commandReply = "Opening back workout";

        }
         else if (text.includes("all workout")) {

            openWorkout("shoulder");
            commandReply = "Opening all workout";

        }

        else if (text.includes("shoulder")) {

            openWorkout("shoulder");
            commandReply = "Opening shoulder workout";

        }

        else if (text.includes("biceps") || text.includes("triceps")) {

            openWorkout("arms");
            commandReply = "Opening arms workout";

        }

        /* 🧮 BMI */

        else if (text.includes("bmi")) {

            document.getElementById("bmiBtn").click();

            commandReply = document
            .getElementById("bmiResult")
            .innerText;

        }

        /* 🔥 CALORIES */

        else if (text.includes("calorie")) {

            document.getElementById("calorieBtn").click();

            commandReply = document
            .getElementById("calorieResult")
            .innerText;

        }

        /* 🍎 DIET */

        else if (text.includes("diet")) {

            document.getElementById("dietBtn").click();

            commandReply =
            "Generating your AI diet plan";

        }

        /* 🤖 NORMAL AI CHAT */

        else {

            const botDiv = addBotMsg("Thinking...");

            const reply =
            await getAIResponse(text);

            botDiv.innerText = reply;

            speechSynthesis.cancel();

            const aiVoice =
            new SpeechSynthesisUtterance(reply);

            aiVoice.rate = 1;
            aiVoice.pitch = 1;
            aiVoice.volume = 1;

            speechSynthesis.speak(aiVoice);

            return;
        }

        /* 🔊 SPEAK COMMAND REPLY */

        addBotMsg(commandReply);

        speechSynthesis.cancel();

        const speech =
        new SpeechSynthesisUtterance(commandReply);

        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speechSynthesis.speak(speech);
    };
}

/* =========================
   INIT
========================= */
window.onload = () => {
    addBotMsg("👋 Welcome to Fitness Buddy AI");
};
/* =========================
   🧮 BMI CALCULATOR
========================= */

const bmiBtn = document.getElementById("bmiBtn");

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");

const bmiResult = document.getElementById("bmiResult");
const bmiStatus = document.getElementById("bmiStatus");
const bmiIdeal = document.getElementById("bmiIdeal");

bmiBtn.addEventListener("click", () => {

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    // validation
    if (!height || !weight || height <= 0 || weight <= 0) {

        bmiResult.innerText = "⚠ Enter valid values";
        bmiStatus.innerText = "";
        bmiIdeal.innerText = "";

        return;
    }

    // BMI formula
    const bmi = weight / ((height / 100) * (height / 100));

    bmiResult.innerText = `Your BMI: ${bmi.toFixed(1)}`;

    // status
    if (bmi < 18.5) {

        bmiStatus.innerText = "Underweight";
        bmiStatus.style.color = "#00bfff";

        bmiIdeal.innerText =
            "You should focus on healthy weight gain and protein-rich foods.";

    }

    else if (bmi >= 18.5 && bmi < 25) {

        bmiStatus.innerText = "Normal Weight";
        bmiStatus.style.color = "#00ff99";

        bmiIdeal.innerText =
            "Great! Maintain your healthy lifestyle and balanced diet.";

    }

    else if (bmi >= 25 && bmi < 30) {

        bmiStatus.innerText = "Overweight";
        bmiStatus.style.color = "#ffcc00";

        bmiIdeal.innerText =
            "Focus on cardio, calorie control, and regular workouts.";

    }

    else {

        bmiStatus.innerText = "Obese";
        bmiStatus.style.color = "#ff4444";

        bmiIdeal.innerText =
            "Consult a fitness expert and follow a structured fat-loss plan.";

    }

});
/* =========================
   🔥 CALORIE CALCULATOR
========================= */

const calorieBtn = document.getElementById("calorieBtn");

const calAge = document.getElementById("calAge");
const calHeight = document.getElementById("calHeight");
const calWeight = document.getElementById("calWeight");
const calGender = document.getElementById("calGender");

const calorieResult = document.getElementById("calorieResult");
const calorieInfo = document.getElementById("calorieInfo");

calorieBtn.addEventListener("click", () => {

    const age = parseFloat(calAge.value);
    const height = parseFloat(calHeight.value);
    const weight = parseFloat(calWeight.value);
    const gender = calGender.value;

    // validation
    if (!age || !height || !weight) {

        calorieResult.innerText = "⚠ Enter valid values";
        calorieInfo.innerText = "";

        return;
    }

    let calories;

    // BMR Formula
    if (gender === "male") {

        calories =
            10 * weight +
            6.25 * height -
            5 * age +
            5;

    } else {

        calories =
            10 * weight +
            6.25 * height -
            5 * age -
            161;
    }

    calories = Math.round(calories);

    calorieResult.innerText =
        `Daily Calories: ${calories} kcal`;

    // suggestion
    if (calories < 1600) {

        calorieInfo.innerText =
            "Low calorie requirement. Maintain balanced nutrition.";

    }

    else if (calories >= 1600 && calories < 2200) {

        calorieInfo.innerText =
            "Moderate calorie requirement. Good for maintenance.";

    }

    else {

        calorieInfo.innerText =
            "High calorie requirement. Ideal for active lifestyle or muscle gain.";

    }

});
/* =========================
   🍎 AI DIET PLANNER (UPDATED & FIXED)
========================= */

const dietBtn = document.getElementById("dietBtn");

const dietWeight = document.getElementById("dietWeight");
const dietHeight = document.getElementById("dietHeight");
const dietAge = document.getElementById("dietAge");
const dietGoal = document.getElementById("dietGoal");

const dietResult = document.getElementById("dietResult");

/* 🔑 YOUR GEMINI API KEY */
const GEMINI_API_KEY = "AIzaSyDn0Kr2dh-dPQYmRZp_EenPtuZBrlo7sV4";

dietBtn.addEventListener("click", async () => {

    const weight = dietWeight.value.trim();
    const height = dietHeight.value.trim();
    const age = dietAge.value.trim();
    const goal = dietGoal.value;

    /* VALIDATION */
    if (!weight || !height || !age || !goal) {

        dietResult.innerHTML =
        "⚠ Please fill all fields.";

        return;
    }

    /* LOADING */
    dietResult.innerHTML =
    "🤖 Generating AI Diet Plan...";

    /* AI PROMPT */
    const prompt = `
You are an expert Indian fitness dietitian.

Create a professional Indian diet plan.

User Details:
Weight: ${weight}kg
Height: ${height}cm
Age: ${age}
Goal: ${goal}

Give:
1. Breakfast
2. Lunch
3. Evening Snacks
4. Dinner
5. Water Intake
6. Workout Tips

Keep answer short, stylish and easy to read.
`;

    try {

      const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
{
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    })
}
);
        /* API ERROR */
        if (!response.ok) {

            dietResult.innerHTML =
            `⚠ API Error : ${response.status}`;

            return;
        }

        const data = await response.json();

        console.log("DIET AI RESPONSE:", data);

        /* RESPONSE */
        const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiReply) {

            dietResult.innerHTML =
            "⚠ AI failed to generate plan.";

            return;
        }

        /* SHOW RESULT */
        dietResult.innerHTML =
        aiReply.replace(/\n/g, "<br>");

    }

    catch (error) {

        console.log(error);

        dietResult.innerHTML =
        "⚠ Network Error / Invalid API Key";
    }

});
