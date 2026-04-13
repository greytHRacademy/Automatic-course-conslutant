window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  var player = GetPlayer();
var email = player.GetVar("UserEmail");
// Check if the email contains "@" and ".com"
if (email.includes("@") && email.includes(".com")) {
    player.SetVar("EmailValid", true);
} else {
    player.SetVar("EmailValid", false);
}

}

window.Script2 = function()
{
  var player = GetPlayer();

// Moodle SCORM exposes learner ID / username
var learnerId = "";

if (typeof pipwerks !== "undefined" &&
    pipwerks.SCORM &&
    pipwerks.SCORM.data &&
    pipwerks.SCORM.data.cmi &&
    pipwerks.SCORM.data.cmi.learner_id) {

  learnerId = pipwerks.SCORM.data.cmi.learner_id;
}

// Fallback for older SCORM versions
if (!learnerId && pipwerks.SCORM.data.cmi.core) {
  learnerId = pipwerks.SCORM.data.cmi.core.student_id;
}

// Set Storyline variable
if (learnerId) {
  player.SetVar("LearnerEmail", learnerId);
}

}

window.Script3 = function()
{
  var player = GetPlayer();
var USER_EMAIL = player.GetVar("UserEmail");
var USER_NAME = player.GetVar("UserName") || "";
var TRANSACTION_ID = player.GetVar("TransactionID") || "";

// ==============================
// CONFIG
// ==============================
var EMAIL_TO = "";
var EMAIL_CC = "academy@greytip.com";
var GOOGLE_FORM_URL = "https://YOUR_GOOGLE_FORM_LINK_HERE";

// ==============================
// Load Poppins font
// ==============================
if (!document.getElementById("poppins-font")) {
  var font = document.createElement("link");
  font.id = "poppins-font";
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
  document.head.appendChild(font);
}

// ==============================
// FIX STORYLINE CLICK BLOCKING
// ==============================
if (!document.getElementById("storyline-click-fix")) {
  var fix = document.createElement("style");
  fix.id = "storyline-click-fix";
  fix.innerHTML = `
    [data-acc-text="RecommendedLinks"],
    [data-acc-text="RecommendedLinks"] * {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(fix);
}

// ==============================
// RECOMMENDATION RULES
// ==============================
var rules = [
  { questions:["Q1","Q2","Q3","Q7","Q9","Q13"], links:[{ text:"greytHR certificate course in Payroll Processing", url:"https://training.greythr.com/course/view.php?id=126"}]},
  { questions:["Q4"], links:[
      { text:"greytHR Certificate Course in Leave Management", url:"https://training.greythr.com/course/view.php?id=145"},
      { text:"greytHR Certificate Course in Attendance Management", url:"https://training.greythr.com/course/view.php?id=144"}
    ]},
  { questions:["Q11"], links:[
      { text:"greytHR Certificate Course in Employee Communication in India - An Introduction", url:"https://training.greythr.com/course/view.php?id=172"},
      { text:"greytHR Certificate Course in Employee Communication for HR Professionals", url:"https://training.greythr.com/course/view.php?id=192"}
    ]},
  { questions:["Q5"], links:[{ text:"greytHR Certificate Course in Employee Onboarding Process", url:"https://training.greythr.com/course/view.php?id=136"}]},
  { questions:["Q10"], links:[{ text:"greytHR Certificate Course in HR Analytics", url:"https://training.greythr.com/course/view.php?id=323"}]},
  { questions:["Q12"], links:[{ text:"greytHR Certificate Course in Learning and Development function in India", url:"https://training.greythr.com/course/view.php?id=239"}]},
  { questions:["Q6","Q15"], links:[{ text:"greytHR Certificate course on HR Functions - Master course on Recruitment function", url:"https://training.greythr.com/course/view.php?id=134"}]},
  { questions:["Q8","Q14"], links:[{ text:"greytHR Certificate course in Performance Management System", url:"https://training.greythr.com/course/view.php?id=135"}]}
];

// ==============================
// BUILD CONTENT + EMAIL TEXT
// ==============================
var html = "<div>";
var emailText =
  "Hi " + USER_NAME + ",\n\n" +
  "Thank you for taking the quiz.\n\n"
  "Based on your assessment, here is your personalized learning plan:\n\n";

var count = 1;
var anyIncorrect = false;

rules.forEach(function(rule){
  if (rule.questions.some(q => player.GetVar(q) === true)) {
    anyIncorrect = true;
    rule.links.forEach(function(link){
      html +=
        "<div style='margin-bottom:12px;font-family:Poppins,Arial,sans-serif;'>" +
          "<span style='font-weight:700;margin-right:6px;'>" + count + ".</span>" +
          "<a href='"+link.url+"' target='_blank' style='color:#0066cc;text-decoration:underline;font-weight:600;'>" +
            link.text +
          "</a>" +
        "</div>";

      emailText += count + ". " + link.text + "\n" + link.url + "\n\n";
      count++;
    });
  }
});


// ALWAYS SHOW → AI in HR
html +=
  "<div style='margin-top:16px;font-family:Poppins,Arial,sans-serif;'>" +
    "<span style='font-weight:700;margin-right:6px;'>" + count + ".</span>" +
    "<a href='https://training.greythr.com/enrol/index.php?id=312' target='_blank' style='color:#0066cc;text-decoration:underline;font-weight:600;'>" +
      "Use of Artificial Intelligence in HR Management" +
    "</a>" +
  "</div>";

emailText += count + ". Use of Artificial Intelligence in HR Management\n" +
             "https://training.greythr.com/enrol/index.php?id=312\n\n";

count++;


// ALL CORRECT → SHOW ALL LINKS (same as incorrect case)
if (!anyIncorrect) {

  rules.forEach(function(rule){
    rule.links.forEach(function(link){

      html +=
        "<div style='margin-bottom:12px;font-family:Poppins,Arial,sans-serif;'>" +
          "<span style='font-weight:700;margin-right:6px;'>" + count + ".</span>" +
          "<a href='"+link.url+"' target='_blank' style='color:#0066cc;text-decoration:underline;font-weight:600;'>" +
            link.text +
          "</a>" +
        "</div>";

      emailText += count + ". " + link.text + "\n" + link.url + "\n\n";
      count++;
    });
  });

}

// APPLY FOR MASTER CERTIFICATE (ALWAYS SHOWN)
html +=
  "<div style='margin-top:16px;font-family:Poppins,Arial,sans-serif;'>" +
    "<span style='font-weight:700;margin-right:6px;'>" + count + ".</span>" +
    "<a href='https://docs.google.com/forms/d/e/1FAIpQLScNDUOvWdArmN0L7MxmFa6qnzoVNSzWTseexIdFm6-6SZAKrA/viewform?usp=publish-editor' target='_blank' style='color:#0066cc;text-decoration:underline;font-weight:600;'>Apply for master certificate</a>" +
  "</div>";

emailText += count + ". Apply for master certificate\n" +
             "https://docs.google.com/forms/d/e/1FAIpQLScNDUOvWdArmN0L7MxmFa6qnzoVNSzWTseexIdFm6-6SZAKrA/viewform?usp=publish-editor\n\n";

count++;

emailText += count + ". Q & A\n" + "https://docs.google.com/forms/d/e/1FAIpQLSeipKpRydPXDuE3-cOHPZDa50LCKJoCwP5fQv5QHMWEfyWLBw/viewform?usp=publish-editor\n\n";

count++;

emailText +=
  "Please pay the course fees Rs. 1000 on the following link and share your payment confirmation screenshot to start taking the courses.\n" +
  "http://www.instamojo.com/@greytip\n\n";

emailText += "Happy learning!\n\ngreytHR Academy";

// ==============================
// GMAIL COMPOSE URL (RELIABLE)
// ==============================
var gmailComposeUrl =
  "https://mail.google.com/mail/?view=cm&fs=1" +
  "&to=" + encodeURIComponent(USER_EMAIL || EMAIL_TO || "") +
  "&cc=" + encodeURIComponent(EMAIL_CC || "") +
  "&su=" + encodeURIComponent("Your Personalized Learning Plan – greytHR Academy") +
  "&body=" + encodeURIComponent(emailText);

// ==============================
// BUTTONS (EMAIL + PRINT + Q&A)
// ==============================
html +=
  "<div style='margin-top:20px;text-align:left;'>" +
    "<div style='display:inline-flex;gap:16px;flex-wrap:wrap;justify-content:center;'>" +

      "<a href='" + gmailComposeUrl + "' target='_blank' " +
         "style='background:#8900C4;color:#fff;text-decoration:none;border-radius:6px;padding:12px 28px;font-family:Poppins,Arial,sans-serif;font-weight:500;font-size:16px;'>" +
        "Email My Growth Map" +
      "</a>" +

      "<a href='https://docs.google.com/forms/d/e/1FAIpQLSeipKpRydPXDuE3-cOHPZDa50LCKJoCwP5fQv5QHMWEfyWLBw/viewform?usp=publish-editor' target='_blank' " +
         "style='background:#8900C4;color:#fff;text-decoration:none;border-radius:6px;padding:12px 28px;font-family:Poppins,Arial,sans-serif;font-weight:500;font-size:16px;'>" +
        "Q & A" +
      "</a>" +

    "</div>" +
  "</div>";

html += "</div>";

// ==============================
// INJECT INTO STORYLINE
// ==============================
var containers = document.querySelectorAll("[data-acc-text='RecommendedLinks'] div");
if (containers.length > 0) {
  containers[containers.length - 1].innerHTML = html;
}



}

};
