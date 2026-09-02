# ﷲ Tawheed — The 99 Names of Allah (Asma-ul-Husna Experience)

A spiritually sublime, visually breathtaking web application designed to foster deep contemplation, understanding, and memorization of the Divine Names of Allah (**Asma-ul-Husna**). 

The platform synthesizes theological precision from **Dr. Yasir Qadhi** and linguistic Quranic gems from **Ustadh Nouman Ali Khan**, paired with curated nature visuals, micro-animations, audio recitations, ambient soundscapes, and interactive memorization tools.

---

## 🌟 Key Features

### 1. Lafz al-Jalalah & Complete 99 Divine Names
- **The Supreme Foundation**: Begins with **Allah (اللَّٰه)** — the supreme proper name (*Al-Ism al-A'zam*) encompassing all divine attributes, followed by all 99 Asma-ul-Husna.
- **Large Quranic Arabic Typography**: Rendered with high-fidelity fonts (`Amiri Quran`, `Amiri`) with complete tashkeel, diacritics, and interactive font-scaling controls (Standard, Large, Extra Large).
- **Dual Scholarly Syntheses**:
  - **Dr. Yasir Qadhi**: Theological depth, classical insights (drawing from Imam Al-Ghazali's *Al-Maqsad Al-Asna* and Ibn Al-Qayyim), and essential distinctions between similar names.
  - **Ustadh Nouman Ali Khan**: Quranic Arabic root morphology (*Fa'lan* vs *Fa'eel*), emotional resonance, contextual storytelling, and practical psychological reflections.
- **Quranic Ayahs & References**: Key Quranic verses for every name with full vocalized Arabic and English translations.
- **Living by the Name & Du'as**: Concrete daily character habits, mindset shifts, and custom supplications formulated around each Name.

### 2. Natural Imagery (Strictly No Faces or Human Figures)
- 100% pure natural landscapes, starry night skies, mountain peaks, crystal rivers, aurora borealis, and golden sand dunes from Unsplash that mirror the majesty of the Creator (*Khaliq*).

### 3. Procedural Ambient Nature Soundscape Engine (Web Audio API)
- Zero external audio network dependencies. Procedurally synthesized nature sounds:
  - 🌧️ *Gentle Rain on Leaves*
  - 🌊 *Deep Ocean Waves*
  - 🌌 *Desert Night Breeze*
  - 💧 *Mountain Stream*
- Master volume controls and smooth cross-fading.

### 4. Audio Pronunciation Engine
- Real-time speech synthesis configured with classical Arabic vocalization cadence.
- Synchronized visual waveform bars during playback.

### 5. Interactive Hifz & Memorization Studio
- **3D Interactive Flashcards**: Realistic 3D card-flip animation, shuffle deck, "Arabic First" or "Meaning First" toggle, and "Mark as Memorized" tracking.
- **Hifz Companion Quiz**: Multiple choice quiz with running streaks, scores, instant feedback, and celebratory particle confetti.
- **Progress Tracking**: Real-time circular progress ring tracking memorization of all 99 names, saved persistently to `localStorage`.

### 6. Digital Tasbeeh / Dhikr Counter
- Tactile radial click counter with acoustic click sound and device haptics.
- Target settings (33, 99, 100, 500) and daily recitation tally.
- "Send to Tasbeeh" button to recite any Divine Name directly.

### 7. Situational Du'a Explorer ("Call Upon Him")
- Quick selector based on emotional and life states:
  - *Anxiety, Stress & Restlessness*
  - *Broken Heart, Grief & Sadness*
  - *Guilt & Seeking Forgiveness*
  - *Financial Need & Career*
  - *Confusion & Seeking Guidance*
  - *Facing Injustice or Oppression*
  - *Gratitude, Joy & Wonder*

---

## 🎨 Theme & Typography Customization
- **Theme Palette**:
  - **Midnight Sapphire** (Default cosmic deep space & gold)
  - **Emerald Oasis** (Sacred forest & emerald)
  - **Pearl Sanctum** (Clean, radiant light theme)
- **Arabic Font Sizing**:
  - Toggle between Standard, Large, and Extra Large font sizes.

---

## 💻 Tech Stack
- **Architecture**: Vanilla HTML5, CSS3 Custom Properties, ES6 Modules.
- **Audio**: Web Audio API (procedural synthesis) + Web Speech API.
- **Data**: Curated static dataset (`js/data/names.js`).
- **Offline Storage**: Safe wrapper around `localStorage` with in-memory fallbacks.

---

## 📜 Footer Version
- `v1.0.0 (updated 2026-09-02 18:12)`
