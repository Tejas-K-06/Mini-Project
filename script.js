"use strict";

// DOM Elements
const input = document.getElementById('textInput');
const characterCount = document.querySelector('#characterCount');
const wordCount = document.querySelector('#wordCount');
const sentenceCount = document.querySelector('#sentenceCount');
const paragraphCount = document.querySelector('#paragraphCount');
const readingTime = document.querySelector('#readingTime');
const readability = document.querySelector('#readability');
const topKeywords = document.querySelector('#topKeywords');
const keywordsDiv = document.querySelector('.keywords');
const charLimit = document.querySelector('#charLimit');
const wordCloud = document.querySelector('#wordCloud');

// UI Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const clearBtn = document.querySelector('#clearBtn');
const copyBtn = document.querySelector('#copyBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const saveBtn = document.querySelector('#saveBtn');
const navLinks = document.querySelectorAll('.nav-link');
const footerLinks = document.querySelectorAll('.footer-links a');

// Text Tool Buttons
const uppercaseBtn = document.querySelector('#uppercaseBtn');
const lowercaseBtn = document.querySelector('#lowercaseBtn');
const capitalizeBtn = document.querySelector('#capitalizeBtn');
const sentenceCaseBtn = document.querySelector('#sentenceCaseBtn');
const removeSpacesBtn = document.querySelector('#removeSpacesBtn');
const sortLinesBtn = document.querySelector('#sortLinesBtn');
const reverseBtn = document.querySelector('#reverseBtn');
const findReplaceBtn = document.querySelector('#findReplaceBtn');
const performReplaceBtn = document.querySelector('#performReplaceBtn');
const findReplaceContainer = document.querySelector('.find-replace-container');

// Settings
const charLimitSetting = document.querySelector('#charLimitSetting');
const readingSpeedSetting = document.querySelector('#readingSpeedSetting');
const showWordCloudSetting = document.querySelector('#showWordCloudSetting');
const autosaveSetting = document.querySelector('#autosaveSetting');
const darkModeToggle = document.querySelector('#darkModeToggle');

// Default settings
let settings = {
    charLimit: 5000,
    readingSpeed: 275,
    showWordCloud: false,
    autosave: false,
    darkMode: false
};

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('wordCounterSettings', JSON.stringify(settings));
}

// Initialize tabs
function initTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Add event listeners for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get tab and activate it
            const tabId = link.getAttribute('data-tab');
            activateTab(tabId);
        });
    });

    // Add event listeners for footer links
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get tab and activate it
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                activateTab(tabId);
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Activate a specific tab
function activateTab(tabId) {
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Find and activate the corresponding tab
    const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Activate the tab content
    const tabContent = document.getElementById(`${tabId}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    settings.darkMode = !settings.darkMode;
    applyThemeSettings();
    saveSettings();
    updateThemeIcon();
}


function applyThemeSettings() {
    document.body.classList.toggle('dark-theme', settings.darkMode);
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.classList.toggle('fa-moon', !settings.darkMode);
    themeIcon.classList.toggle('fa-sun', settings.darkMode);
}

function loadSettings() {
    const savedSettings = localStorage.getItem('wordCounterSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        // Apply theme immediately when loading settings
        applyThemeSettings();
        updateThemeIcon();
        // Set correct initial icon
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.classList.toggle('fa-sun', settings.darkMode);
        themeIcon.classList.toggle('fa-moon', !settings.darkMode);
    }
}

// Text analysis functions
function countWords(text) {
    const words = text.match(/\b[-?(\w+)?]+\b/gi);
    return words ? words.length : 0;
}

function countSentences(text) {
    if (!text.trim()) return 0;
    const sentences = text.split(/[.|!|?]+/g);
    return sentences.length - 1;
}

function countParagraphs(text) {
    if (!text.trim()) return 0;
    const paragraphs = text.replace(/\n$/gm, '').split(/\n/);
    return paragraphs.length;
}

function calculateReadingTime(wordCount) {
    const wordsPerSecond = settings.readingSpeed / 60;
    const seconds = Math.floor(wordCount / wordsPerSecond);
    
    if (seconds > 59) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds - (minutes * 60);
        
        if (minutes > 59) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes - (hours * 60);
            return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
        }
        
        return `${minutes}m ${remainingSeconds}s`;
    }
    
    return `${seconds}s`;
}

function getTopKeywords(text) {
    const words = text.match(/\b[-?(\w+)?]+\b/gi);
    if (!words) return [];
    
    // Array of stop words
    const stopWords = ["a", "able", "about", "above", "abst", "accordance", "according", "accordingly", "across", "act", "actually", "added", "adj", "affected", "affecting", "affects", "after", "afterwards", "again", "against", "ah", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "apparently", "approximately", "are", "aren", "arent", "arise", "around", "as", "aside", "ask", "asking", "at", "auth", "available", "away", "awfully", "b", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "between", "beyond", "biol", "both", "brief", "briefly", "but", "by", "c", "ca", "came", "can", "cannot", "can't", "cause", "causes", "certain", "certainly", "co", "com", "come", "comes", "contain", "containing", "contains", "could", "couldnt", "d", "date", "did", "didn't", "different", "do", "does", "doesn't", "doing", "done", "don't", "down", "downwards", "due", "during", "e", "each", "ed", "edu", "effect", "eg", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "especially", "et", "et-al", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "except", "f", "far", "few", "ff", "fifth", "first", "five", "fix", "followed", "following", "follows", "for", "former", "formerly", "forth", "found", "four", "from", "further", "furthermore", "g", "gave", "get", "gets", "getting", "give", "given", "gives", "giving", "go", "goes", "gone", "got", "gotten", "h", "had", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "hed", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "hereupon", "hers", "herself", "hes", "hi", "hid", "him", "himself", "his", "hither", "home", "how", "howbeit", "however", "hundred", "i", "id", "ie", "if", "i'll", "im", "immediate", "immediately", "importance", "important", "in", "inc", "indeed", "index", "information", "instead", "into", "invention", "inward", "is", "isn't", "it", "itd", "it'll", "its", "itself", "i've", "j", "just", "k", "keep", "keeps", "kept", "kg", "km", "know", "known", "knows", "l", "largely", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "lets", "like", "liked", "likely", "line", "little", "'ll", "look", "looking", "looks", "ltd", "m", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "million", "miss", "ml", "more", "moreover", "most", "mostly", "mr", "mrs", "much", "mug", "must", "my", "myself", "n", "na", "name", "namely", "nay", "nd", "near", "nearly", "necessarily", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "now", "nowhere", "o", "obtain", "obtained", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "omitted", "on", "once", "one", "ones", "only", "onto", "or", "ord", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "owing", "own", "p", "page", "pages", "part", "particular", "particularly", "past", "per", "perhaps", "placed", "please", "plus", "poorly", "possible", "possibly", "potentially", "pp", "predominantly", "present", "previously", "primarily", "probably", "promptly", "proud", "provides", "put", "q", "que", "quickly", "quite", "qv", "r", "ran", "rather", "rd", "re", "readily", "really", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "respectively", "resulted", "resulting", "results", "right", "run", "s", "said", "same", "saw", "say", "saying", "says", "sec", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sent", "seven", "several", "shall", "she", "shed", "she'll", "shes", "should", "shouldn't", "show", "showed", "shown", "showns", "shows", "significant", "significantly", "similar", "similarly", "since", "six", "slightly", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specifically", "specified", "specify", "specifying", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "t", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'll", "theyre", "they've", "think", "this", "those", "thou", "though", "thoughh", "thousand", "throug", "through", "throughout", "thru", "thus", "til", "tip", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "ts", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "ups", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "v", "value", "various", "'ve", "very", "via", "viz", "vol", "vols", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "wed", "welcome", "we'll", "went", "were", "weren't", "we've", "what", "whatever", "what'll", "whats", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "whose", "why", "widely", "willing", "wish", "with", "within", "without", "won't", "words", "world", "would", "wouldn't", "www", "x", "y", "yes", "yet", "you", "youd", "you'll", "your", "youre", "yours", "yourself", "yourselves", "you've", "z", "zero"];
    
    // Filter out stop words and numbers
    const nonStopWords = words.filter(word => {
        return stopWords.indexOf(word.toLowerCase()) === -1 && isNaN(word);
    }).map(word => word.toLowerCase());
    
    // Count word frequency
    const wordFrequency = {};
    nonStopWords.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    return sortedWords;
}

function generateWordCloud() {
    if (!settings.showWordCloud) return;
    
    const text = input.value;
    if (!text.trim()) {
        wordCloud.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center; color: #6b7280;">Enter text to generate word cloud</div>';
        return;
    }
    
    const keywords = getTopKeywords(text);
    if (keywords.length === 0) {
        wordCloud.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center; color: #6b7280;">No keywords found</div>';
        return;
    }
    
    // Clear previous word cloud
    wordCloud.innerHTML = '';
    
    // Create word cloud
    const maxFrequency = keywords[0][1];
    const cloudHtml = keywords.map(([word, frequency]) => {
        const size = Math.max(1, Math.min(3, frequency / maxFrequency * 3));
        const fontSize = 1 + size * 0.5;
        const opacity = 0.5 + (frequency / maxFrequency) * 0.5;
        return `<span style="display: inline-block; margin: 5px; font-size: ${fontSize}rem; opacity: ${opacity};">${word}</span>`;
    }).join('');
    
    wordCloud.innerHTML = cloudHtml;
}

// Calculate readability score
function calculateReadability(text) {
    if (!text.trim()) return "N/A";
    
    // Calculate word count
    const words = countWords(text);
    if (words === 0) return "N/A";
    
    // Calculate sentence count
    const sentences = countSentences(text);
    if (sentences === 0) return "N/A";
    
    // Calculate average words per sentence
    const avgWordsPerSentence = words / sentences;
    
    // Calculate syllable count
    const syllables = countSyllables(text);
    
    // Calculate average syllables per word
    const avgSyllablesPerWord = syllables / words;
    
    // Calculate Flesch reading ease score
    const flesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Return readability level based on Flesch score
    if (flesch >= 90) return "Very Easy";
    if (flesch >= 80) return "Easy";
    if (flesch >= 70) return "Fairly Easy";
    if (flesch >= 60) return "Standard";
    if (flesch >= 50) return "Fairly Difficult";
    if (flesch >= 30) return "Difficult";
    return "Very Difficult";
}

// Count syllables in text
function countSyllables(text) {
    const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    let count = 0;
    
    for (let word of words) {
        count += countSyllablesInWord(word);
    }
    
    return count;
}

// Count syllables in a word
function countSyllablesInWord(word) {
    word = word.toLowerCase();
    
    // Special cases
    if (word.length <= 3) return 1;
    
    // Remove endings
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    // Count vowel groups
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

// Update the live stats in the UI
function updateLiveStats() {
    const text = input.value;
    const chars = text.length;
    const words = countWords(text);
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const readingTimeCalc = calculateReadingTime(words);
    
    // Update character count
    characterCount.textContent = chars;
    
    // Update word count
    wordCount.textContent = words;
    
    // Update sentence count
    sentenceCount.textContent = sentences;
    
    // Update paragraph count
    paragraphCount.textContent = paragraphs;
    
    // Update reading time
    readingTime.textContent = readingTimeCalc;
    
    // Update character limit
    charLimit.textContent = `${chars}/${settings.charLimit}`;
    
    // Warn user if they're approaching the character limit
    if (chars >= settings.charLimit * 0.9) {
        charLimit.style.color = '#e74c3e';
    } else {
        charLimit.style.color = '#6b7280';
    }
    
    // Generate word cloud if enabled
    if (settings.showWordCloud) {
        generateWordCloud();
    }
}

// Calculate readability on button click
function calculateAndDisplayReadability() {
    const text = input.value;
    const readabilityLevel = calculateReadability(text);
    
    readability.innerHTML = `<span>${readabilityLevel}</span>`;
    
    // Show keywords section
    keywordsDiv.style.display = 'block';
    
    // Get top keywords
    const keywords = getTopKeywords(text);
    
    // Display top keywords
    if (keywords.length > 0) {
        let keywordsList = '<ul>';
        keywords.forEach(([word, frequency]) => {
            keywordsList += `<li><b>${word}</b>: ${frequency}</li>`;
        });
        keywordsList += '</ul>';
        
        topKeywords.innerHTML = keywordsList;
    } else {
        topKeywords.innerHTML = '<p>No keywords found</p>';
    }
}

// Text transformation functions
function toUpperCase() {
    input.value = input.value.toUpperCase();
    updateLiveStats();
}

function toLowerCase() {
    input.value = input.value.toLowerCase();
    updateLiveStats();
}

function toCapitalizeCase() {
    input.value = input.value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    updateLiveStats();
}

function toSentenceCase() {
    const sentences = input.value.toLowerCase().split(/(?<=[.!?])\s+/);
    input.value = sentences
        .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join(' ');
    updateLiveStats();
}

function removeExtraSpaces() {
    input.value = input.value
        .replace(/\s+/g, ' ')
        .trim();
    updateLiveStats();
}

function sortLines() {
    const lines = input.value.split('\n');
    input.value = lines.sort().join('\n');
    updateLiveStats();
}

function reverse() {
    input.value = input.value.split('').reverse().join('');
    updateLiveStats();
}

function toggleFindReplace() {
    if (findReplaceContainer.style.display === 'block') {
        findReplaceContainer.style.display = 'none';
    } else {
        findReplaceContainer.style.display = 'block';
    }
}

function performFindReplace() {
    const findText = document.getElementById('findText').value;
    const replaceText = document.getElementById('replaceText').value;
    
    if (!findText) return;
    
    const regex = new RegExp(findText, 'g');
    input.value = input.value.replace(regex, replaceText);
    updateLiveStats();
}

// Clear text area
function clearText() {
    if (confirm('Are you sure you want to clear all text?')) {
        input.value = '';
        updateLiveStats();
        keywordsDiv.style.display = 'none';
    }
}

// Copy text to clipboard
function copyText() {
    input.select();
    document.execCommand('copy');
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Text copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Download text as file
function downloadText() {
    const text = input.value;
    if (!text.trim()) return;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text_analysis.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Save text to localStorage
function saveText() {
    localStorage.setItem('savedText', input.value);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Text saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Load saved text from localStorage
function loadSavedText() {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        input.value = savedText;
        updateLiveStats();
    }
}

// Update settings
function updateSettings() {
    settings.charLimit = parseInt(charLimitSetting.value) || 5000;
    settings.readingSpeed = parseInt(readingSpeedSetting.value) || 275;
    settings.showWordCloud = showWordCloudSetting.checked;
    settings.autosave = autosaveSetting.checked;
    
    saveSettings();
    
    // Update UI based on new settings
    charLimit.textContent = `${input.value.length}/${settings.charLimit}`;
    
    if (settings.showWordCloud) {
        wordCloud.style.display = 'block';
        generateWordCloud();
    } else {
        wordCloud.style.display = 'none';
    }
    
    // Update reading time
    const words = countWords(input.value);
    readingTime.textContent = calculateReadingTime(words);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Settings updated!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Auto-save text periodically if enabled
function setupAutoSave() {
    if (settings.autosave) {
        setInterval(() => {
            if (input.value.trim()) {
                localStorage.setItem('savedText', input.value);
            }
        }, 30000); // Auto-save every 30 seconds
    }
}

// Initialize application
function init() {
    // Load saved settings
    loadSettings();
    
    // Load saved text
    loadSavedText();
    
    // Initialize tabs
    initTabs();
    
    // Set up event listeners
    input.addEventListener('input', updateLiveStats);
    readability.addEventListener('click', calculateAndDisplayReadability);
    
    // Text tool buttons
    uppercaseBtn.addEventListener('click', toUpperCase);
    lowercaseBtn.addEventListener('click', toLowerCase);
    capitalizeBtn.addEventListener('click', toCapitalizeCase);
    sentenceCaseBtn.addEventListener('click', toSentenceCase);
    removeSpacesBtn.addEventListener('click', removeExtraSpaces);
    sortLinesBtn.addEventListener('click', sortLines);
    reverseBtn.addEventListener('click', reverse);
    findReplaceBtn.addEventListener('click', toggleFindReplace);
    performReplaceBtn.addEventListener('click', performFindReplace);
    
    // UI buttons
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);
    downloadBtn.addEventListener('click', downloadText);
    saveBtn.addEventListener('click', saveText);
    
    // // Dark mode toggle
    // if (darkModeToggle) {
    //     darkModeToggle.addEventListener('click', toggleDarkMode);
    // }
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
    // Settings form
    document.querySelector('#settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateSettings();
    });
    
    // Set up auto-save if enabled
    setupAutoSave();
    
    // Update stats on load
    updateLiveStats();
}

// Run initialization when DOM content is loaded
document.addEventListener('DOMContentLoaded', init);