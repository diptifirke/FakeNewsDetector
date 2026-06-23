import { auth } from "./firebase-config.js";
import { setupTrendingNews } from "./detect.js";
import { renderHistoryTimeline } from "./history.js";
import { initCommunityVotes } from "./community.js";
import { renderDashboardStats, renderProfileDetails } from "./dashboard.js";

// Global language localization dictionary
export const translations = {
  en: {
    heroTitle: "TruthLens AI – Detect Fake News Before You Share",
    heroSubtitle: "Analyze articles, URLs, screenshots and videos using AI-powered fact checking, credibility analysis and deepfake detection.",
    analyzeNews: "Analyze News",
    exploreTrending: "Explore Trending News",
    detectTitle: "Fake News Detection Engine",
    trendingTitle: "Trending News Verification",
    historyTitle: "Verification Logs & History",
    communityTitle: "Community Debates & Verification",
    chatbotTitle: "AI Explanation Chatbot",
    dashboardTitle: "User Activity Dashboard",
    profileTitle: "Profile & Gamification Dashboard",
    aboutTitle: "About TruthLens Methodology",
    articlesCount: "Articles Analyzed",
    fakeCount: "Fake News Detected",
    communityCount: "Community Members",
    sourcesCount: "Verified Sources",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "Welcome back",
    runAnalysis: "Run Detection Analysis",
    askBot: "Ask details about a claim (e.g. 'Show me the evidence')..."
  },
  hi: {
    heroTitle: "TruthLens AI - साझा करने से पहले नकली समाचारों का पता लगाएं",
    heroSubtitle: "एआई-संचालित तथ्य जांच, विश्वसनीयता विश्लेषण और डीपफेक डिटेक्शन का उपयोग करके लेखों, यूआरएल, स्क्रीनशॉट और वीडियो का विश्लेषण करें।",
    analyzeNews: "समाचार विश्लेषण करें",
    exploreTrending: "ट्रेंडिंग समाचार खोजें",
    detectTitle: "नकली समाचार जांच इंजन",
    trendingTitle: "ट्रेंडिंग समाचार सत्यापन",
    historyTitle: "सत्यापन लॉग और इतिहास",
    communityTitle: "सामुदायिक चर्चा और सत्यापन",
    chatbotTitle: "एआई स्पष्टीकरण चैटबॉट",
    dashboardTitle: "उपयोगकर्ता गतिविधि डैशबोर्ड",
    profileTitle: "प्रोफ़ाइल और गेमिफ़िकेशन",
    aboutTitle: "ट्रूथलेंस पद्धति के बारे में",
    articlesCount: "विश्लेषण किए गए लेख",
    fakeCount: "नकली समाचार मिले",
    communityCount: "समुदाय के सदस्य",
    sourcesCount: "सत्यापित स्रोत",
    signIn: "लॉग इन करें",
    signOut: "लॉग आउट करें",
    welcome: "स्वागत है",
    runAnalysis: "सत्यापन विश्लेषण शुरू करें",
    askBot: "दावे के बारे में विवरण पूछें (जैसे 'मुझे सबूत दिखाएं')..."
  },
  mr: {
    heroTitle: "TruthLens AI - शेअर करण्यापूर्वी खोट्या बातम्या ओळखा",
    heroSubtitle: "AI-आधारित तथ्य तपासणी, विश्वसनीयता विश्लेषण आणि डीपफेक शोध वापरून लेख, URL, स्क्रीनशॉट आणि व्हिडिओंचे विश्लेषण करा.",
    analyzeNews: "बातम्यांचे विश्लेषण करा",
    exploreTrending: "ट्रेंडिंग बातम्या पहा",
    detectTitle: "खोट्या बातम्या शोधणारा विभाग",
    trendingTitle: "ट्रेंडिंग बातम्यांचे सत्यापन",
    historyTitle: "सत्यापन इतिहास",
    communityTitle: "सामुदायिक चर्चा आणि पडताळणी",
    chatbotTitle: "AI स्पष्टीकरण चॅटबॉट",
    dashboardTitle: "वापरकर्ता क्रियाकलाप डॅशबोर्ड",
    profileTitle: "प्रोफाइल आणि गेमिंग",
    aboutTitle: "आमच्या कार्यपद्धतीबद्दल",
    articlesCount: "विश्लेषण केलेले लेख",
    fakeCount: "खोट्या बातम्या आढळल्या",
    communityCount: "समुदाय सदस्य",
    sourcesCount: "सत्यापित स्त्रोत",
    signIn: "साइन इन करा",
    signOut: "बाहेर पडा",
    welcome: "स्वागत आहे",
    runAnalysis: "पडताळणी सुरू करा",
    askBot: "तपशील विचारा (उदा. 'मला पुरावा दाखवा')..."
  },
  bn: {
    heroTitle: "TruthLens AI - শেয়ার করার আগে জাল খবর সনাক্ত করুন",
    heroSubtitle: "এআই-চালিত তথ্য যাচাই, নির্ভরযোগ্যতা বিশ্লেষণ এবং ডিপফেক সনাক্তকরণ ব্যবহার করে নিবন্ধ, ইউআরএল, স্ক্রিনশট এবং ভিডিও বিশ্লেষণ করুন।",
    analyzeNews: "খবর বিশ্লেষণ করুন",
    exploreTrending: "ট্রেন্ডিং খবর দেখুন",
    detectTitle: "জাল খবর সনাক্তকরণ ইঞ্জিন",
    trendingTitle: "চলতি খবরের সত্যতা যাচাই",
    historyTitle: "যাচাইয়ের ইতিহাস",
    communityTitle: "কমিউনিটি যাচাইকরণ ফোরাম",
    chatbotTitle: "এআই ব্যাখ্যামূলক চ্যাটবট",
    dashboardTitle: "কার্যকলাপ ড্যাশবোর্ড",
    profileTitle: "প্রোফাইল এবং গ্যামিফিকেশন",
    aboutTitle: "আমাদের পদ্ধতি সম্পর্কে",
    articlesCount: "বিশ্লেষিত নিবন্ধ",
    fakeCount: "জাল খবর সনাক্ত",
    communityCount: "কমিউনিটি সদস্য",
    sourcesCount: "যাচাইকৃত সূত্র",
    signIn: "সাইন ইন করুন",
    signOut: "লগ আউট করুন",
    welcome: "স্বাগতম",
    runAnalysis: "বিশ্লেষণ শুরু করুন",
    askBot: "প্রশ্ন করুন (যেমন 'প্রমাণ দেখান')..."
  },
  ta: {
    heroTitle: "TruthLens AI - பகிர்வதற்கு முன் போலிச் செய்திகளைக் கண்டறியவும்",
    heroSubtitle: "செயற்கை நுண்ணறிவு மூலம் செய்திகள், இணையதள இணைப்புகள், படங்கள் மற்றும் காணொளிகளை ஆராய்ந்து உண்மைத் தன்மையைச் சரிபார்க்கவும்.",
    analyzeNews: "செய்தி பகுப்பாய்வு",
    exploreTrending: "டிரெண்டிங் செய்திகள்",
    detectTitle: "போலி செய்தி கண்டறிதல்",
    trendingTitle: "டிரெண்டிங் செய்திகள் சரிபார்ப்பு",
    historyTitle: "சரிபார்ப்பு வரலாறு",
    communityTitle: "சமூக சரிபார்ப்பு மன்றம்",
    chatbotTitle: "AI விளக்க அரட்டை",
    dashboardTitle: "பயனர் டேஷ்போர்டு",
    profileTitle: "சுயவிவரம் மற்றும் புள்ளிகள்",
    aboutTitle: "செயல்பாட்டு முறை பற்றி",
    articlesCount: "ஆராய்ந்த செய்திகள்",
    fakeCount: "போலி செய்திகள்",
    communityCount: "சமூக உறுப்பினர்கள்",
    sourcesCount: "சரிபார்க்கப்பட்ட தளங்கள்",
    signIn: "உள்நுழைக",
    signOut: "வெளியேறுக",
    welcome: "வரவேற்கிறோம்",
    runAnalysis: "ஆராய்ச்சியைத் தொடங்கு",
    askBot: "விவரங்களைக் கேளுங்கள்..."
  },
  te: {
    heroTitle: "TruthLens AI - షేర్ చేయడానికి ముందే నకిలీ వార్తలను గుర్తించండి",
    heroSubtitle: "AI సాంకేతికత ద్వారా ఆర్టికల్స్, లింక్స్, ఇమేజెస్ మరియు వీడియోల విశ్వసనీయత మరియు డీప్‌ఫేక్స్ పరిశీలించండి.",
    analyzeNews: "వార్తలను విశ్లేషించండి",
    exploreTrending: "ట్రెండింగ్ వార్తలు చూడండి",
    detectTitle: "నకిలీ వార్తల శోధన యంత్రం",
    trendingTitle: "ట్రెండింగ్ వార్తల పరిశీలన",
    historyTitle: "విశ్లేషణల చరిత్ర",
    communityTitle: "కమ్యూనిటీ వెరిఫికేషన్",
    chatbotTitle: "AI వివరణాత్మక చాట్ బాట్",
    dashboardTitle: "యూజర్ డ్యాష్‌బోర్డ్",
    profileTitle: "ప్రొఫైల్ మరియు పాయింట్లు",
    aboutTitle: "మా పద్ధతి గురించి",
    articlesCount: "విశ్లేషించిన వార్తలు",
    fakeCount: "నకిలీ వార్తలు",
    communityCount: "కమ్యూనిటీ సభ్యులు",
    sourcesCount: "ధృవీకరించబడిన వనరులు",
    signIn: "లాగిన్ అవ్వండి",
    signOut: "లాగ్ అవుట్",
    welcome: "స్వాగతం",
    runAnalysis: "విశ్లేషణ ప్రారంభించు",
    askBot: "ప్రశ్నలు అడగండి..."
  }
};

export let activeLanguage = "en";

// Initialize routing and globals
document.addEventListener("DOMContentLoaded", () => {
  setupRouting();
  setupTheme();
  setupLanguage();
  setupAuthHandlers();
  animateCounterStats();
  
  // Mobile navigation sidebar overlay close
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("sidebar").classList.remove("mobile-open");
    });
  });
  
  // Landing start buttons
  document.querySelectorAll(".btn-landing-start").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#detect";
    });
  });
  
  document.querySelectorAll(".btn-landing-trending").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#trending";
    });
  });
});

// Single Page Application Hash Router with CSS View Transitions
function setupRouting() {
  const handleRouting = () => {
    const hash = window.location.hash.replace("#", "") || "home";
    
    // Update active nav styles
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-target") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const updateDOM = () => {
      // Hide all pages
      document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
      });
      
      // Show targeted page
      const targetPage = document.getElementById(`${hash}-page`);
      if (targetPage) {
        targetPage.classList.add("active");
        
        // Update header title
        const formattedTitle = hash.charAt(0).toUpperCase() + hash.slice(1);
        document.getElementById("current-page-title").innerText = formattedTitle;
        
        // Custom component callbacks
        triggerPageInitCallbacks(hash);
      }
    };

    // Transition wrap
    if (!document.startViewTransition) {
      updateDOM();
      // Accessibility: Focus target heading to preserve logical keyboard tab flow
      document.getElementById("current-page-title")?.focus();
    } else {
      const transition = document.startViewTransition(() => {
        updateDOM();
      });
      transition.finished.finally(() => {
        document.getElementById("current-page-title")?.setAttribute("tabindex", "-1");
        document.getElementById("current-page-title")?.focus();
      });
    }
  };

  window.addEventListener("hashchange", handleRouting);
  // Trigger on load
  handleRouting();
}

function triggerPageInitCallbacks(pageId) {
  // Trigger loading views when navigated
  if (pageId === "dashboard") {
    renderDashboardStats();
  } else if (pageId === "community") {
    initCommunityVotes();
  } else if (pageId === "trending") {
    setupTrendingNews();
  } else if (pageId === "profile") {
    renderProfileDetails();
  } else if (pageId === "history") {
    renderHistoryTimeline();
  }
}

// Light & Dark theme preference and toggle toggling
function setupTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("truthlens_theme", theme);
    if (theme === "dark") {
      themeText.textContent = "Dark Mode";
      themeToggle.querySelector(".sun-icon").style.stroke = "var(--text-primary)";
    } else {
      themeText.textContent = "Light Mode";
    }
  };

  // Check saved or default
  const savedTheme = localStorage.getItem("truthlens_theme") || "dark";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
}

// Multilingual translations switcher
function setupLanguage() {
  const langSelector = document.getElementById("lang-selector");
  
  const applyLanguage = (lang) => {
    activeLanguage = lang;
    localStorage.setItem("truthlens_lang", lang);
    const data = translations[lang];
    if (!data) return;

    // Localize elements with matching IDs
    const homeTitle = document.querySelector("#home-page h2");
    if (homeTitle) homeTitle.innerText = data.heroTitle;
    
    const homeSubtitle = document.querySelector("#home-page p");
    if (homeSubtitle) homeSubtitle.innerText = data.heroSubtitle;

    const btnLandingStart = document.querySelector(".btn-landing-start");
    if (btnLandingStart) btnLandingStart.innerText = data.analyzeNews;

    const btnLandingTrending = document.querySelector(".btn-landing-trending");
    if (btnLandingTrending) btnLandingTrending.innerText = data.exploreTrending;

    // Update form attributes
    const chatInput = document.getElementById("chat-user-input");
    if (chatInput) chatInput.placeholder = data.askBot;

    const analyzeBtn = document.getElementById("detect-trigger-btn");
    if (analyzeBtn) analyzeBtn.innerText = data.runAnalysis;

    // Update Counter Headings
    const statsTitles = document.querySelectorAll("#home-page .card h4");
    if (statsTitles.length === 4) {
      statsTitles[0].innerText = data.articlesCount;
      statsTitles[1].innerText = data.fakeCount;
      statsTitles[2].innerText = data.communityCount;
      statsTitles[3].innerText = data.sourcesCount;
    }

    // Refresh active nav link titles or sub-sections dynamically if needed
    window.dispatchEvent(new CustomEvent("lang-changed", { detail: { lang } }));
  };

  const savedLang = localStorage.getItem("truthlens_lang") || "en";
  langSelector.value = savedLang;
  applyLanguage(savedLang);

  langSelector.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });
}

// Stats counter count-up animation
function animateCounterStats() {
  const counters = document.querySelectorAll(".stats-counter");
  const speed = 100; // The higher the slower

  counters.forEach(counter => {
    const updateCount = () => {
      const target = parseInt(counter.getAttribute("data-target"));
      const count = parseInt(counter.innerText.replace(/,/g, ''));
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = (count + increment).toLocaleString();
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    updateCount();
  });
}

// Authentication handling
function setupAuthHandlers() {
  const authMainBtn = document.getElementById("auth-main-btn");
  const authModal = document.getElementById("auth-modal");
  const authModalClose = document.getElementById("auth-modal-close");
  const authSubmitForm = document.getElementById("auth-credentials-form");
  const authGoogleBtn = document.getElementById("auth-google-btn");
  const switchAuthModeBtn = document.getElementById("auth-modal-switch-btn");
  const switchAuthModeText = document.getElementById("auth-modal-switch-text");
  const modalTitle = document.getElementById("auth-modal-title");
  const submitBtn = document.getElementById("auth-submit-btn");
  
  const sidebarUserBlock = document.getElementById("sidebar-user-block");
  const sidebarAvatar = document.getElementById("sidebar-avatar");
  const sidebarUsername = document.getElementById("sidebar-user-name");
  const sidebarUserPoints = document.getElementById("sidebar-user-points");
  
  const mobileToggle = document.getElementById("mobile-sidebar-toggle");
  
  let isSignUpMode = false;

  // Toggle mobile drawer
  mobileToggle.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("mobile-open");
  });

  const toggleAuthModal = (forceClose = false) => {
    if (forceClose || authModal.classList.contains("active")) {
      authModal.classList.remove("active");
    } else {
      authModal.classList.add("active");
    }
  };

  authMainBtn.addEventListener("click", () => {
    if (authMainBtn.classList.contains("logout-btn")) {
      // Trigger logout
      auth.signOut().then(() => {
        alert("Logged out successfully.");
      });
    } else {
      toggleAuthModal();
    }
  });

  authModalClose.addEventListener("click", () => toggleAuthModal(true));
  
  // Close modal when overlay is clicked
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) toggleAuthModal(true);
  });

  switchAuthModeBtn.addEventListener("click", () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
      modalTitle.innerText = "Create TruthLens Account";
      submitBtn.innerText = "Sign Up";
      switchAuthModeText.innerText = "Already have an account? ";
      switchAuthModeBtn.innerText = "Login";
    } else {
      modalTitle.innerText = "Sign in to TruthLens AI";
      submitBtn.innerText = "Login";
      switchAuthModeText.innerText = "New to TruthLens? ";
      switchAuthModeBtn.innerText = "Create account";
    }
  });

  // Handle Form Sign In
  authSubmitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    const promise = isSignUpMode 
      ? auth.signUpWithEmail(email, password)
      : auth.signInWithEmail(email, password);

    promise.then(() => {
      toggleAuthModal(true);
      authSubmitForm.reset();
    }).catch(err => {
      alert("Auth Error: " + err.message);
    });
  });

  // Google Login
  authGoogleBtn.addEventListener("click", () => {
    auth.signInWithGoogle().then(() => {
      toggleAuthModal(true);
    }).catch(err => {
      alert("Google Login Error: " + err.message);
    });
  });

  // Listen for user changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Logged in
      authMainBtn.innerText = "Logout";
      authMainBtn.classList.add("logout-btn");
      
      // Display user data
      const initials = (user.displayName || user.email || "G").charAt(0).toUpperCase();
      sidebarAvatar.innerText = initials;
      sidebarUsername.innerText = user.displayName || user.email.split("@")[0];
      
      const pts = user.points || 450;
      const lvl = user.level || "Expert Fact Checker";
      sidebarUserPoints.innerText = `${pts} XP • ${lvl}`;
      
      // Update custom dashboards
      window.dispatchEvent(new CustomEvent("user-login-changed", { detail: { user } }));
    } else {
      // Logged out
      authMainBtn.innerText = "Sign In";
      authMainBtn.classList.remove("logout-btn");
      sidebarAvatar.innerText = "?";
      sidebarUsername.innerText = "Guest User";
      sidebarUserPoints.innerText = "0 XP • Level 1";
      
      window.dispatchEvent(new CustomEvent("user-login-changed", { detail: { user: null } }));
    }
  });
}
