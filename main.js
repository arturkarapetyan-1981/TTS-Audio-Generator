// DOM Elements
const textInput = document.getElementById('text-to-read');
const generateBtn = document.getElementById('generate-audio');
const audioContainer = document.getElementById('audio-container');
const voiceSelect = document.getElementById('voice-select');
const rateSlider = document.getElementById('rate-slider');
const pitchSlider = document.getElementById('pitch-slider');
const volumeSlider = document.getElementById('volume-slider');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const volumeValue = document.getElementById('volume-value');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const statusMessage = document.getElementById('status-message');

// Speech synthesis object
let synth = window.speechSynthesis;
let utterance = null;

// Populate voice options
function loadVoices() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '<option value="">Default Voice</option>';
    
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Load voices when they are ready
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}

// Update slider value displays
rateSlider.addEventListener('input', () => {
    rateValue.textContent = rateSlider.value;
});

pitchSlider.addEventListener('input', () => {
    pitchValue.textContent = pitchSlider.value;
});

volumeSlider.addEventListener('input', () => {
    volumeValue.textContent = volumeSlider.value;
});

// Function to generate audio from the entered text
function generateAudio() {
    const textToRead = textInput.value.trim();
    
    if (!textToRead) {
        alert('Please enter some text to generate audio.');
        return;
    }
    
    // Cancel any ongoing speech
    if (synth.speaking) {
        synth.cancel();
    }
    
    // Create new utterance
    utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set speech parameters
    utterance.rate = parseFloat(rateSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);
    utterance.volume = parseFloat(volumeSlider.value);
    
    // Set selected voice if available
    const selectedVoice = voiceSelect.value;
    if (selectedVoice) {
        const voices = synth.getVoices();
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
            utterance.voice = voice;
        }
    }
    
    // Show audio container
    audioContainer.classList.add('visible');
    statusMessage.textContent = "Ready to play...";
    
    // Set up event handlers
    utterance.onstart = function() {
        statusMessage.textContent = "Playing...";
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
    };
    
    utterance.onend = function() {
        statusMessage.textContent = "Playback finished";
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    };
    
    utterance.onerror = function(event) {
        console.error('Speech synthesis error:', event.error);
        statusMessage.textContent = "Error: " + event.error;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    };
    
    // Enable playback controls
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
}

// Play button handler
playBtn.addEventListener('click', () => {
    if (utterance && !synth.speaking) {
        synth.speak(utterance);
    }
});

// Pause button handler
pauseBtn.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        statusMessage.textContent = "Paused";
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    } else if (synth.speaking && synth.paused) {
        synth.resume();
        statusMessage.textContent = "Playing...";
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
});

// Stop button handler
stopBtn.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
        statusMessage.textContent = "Playback stopped";
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
});

// Attach the event listener to the Generate Audio button
generateBtn.addEventListener('click', generateAudio);

// Initial load of voices
loadVoices();
   