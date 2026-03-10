# ♟️ Mohamed Alaraby Chess AI Coach

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-green)
![AI](https://img.shields.io/badge/AI-Stockfish%20%7C%20Ollama%20(Llama%203)-purple)

Welcome to the **Mohamed Alaraby Chess AI**, an interactive, full-stack web application designed to help chess players analyze their games with the precision of a grandmaster and the encouraging voice of a personal coach. 

By combining the raw calculating power of **Stockfish** with the natural language capabilities of **Local LLMs (Llama 3)**, this application turns raw chess data into actionable, easy-to-understand advice.

## ✨ Key Features

* **🎮 Cross-Platform Fetching**: Automatically download your match history by simply entering a Chess.com username or pasting a Lichess match URL.
* **🧠 Dual-Engine AI**: 
    * **Stockfish 16**: Calculates centipawn loss, best moves, and positional evaluation.
    * **Llama 3 (via Ollama)**: Translates Stockfish's cold numbers into conversational, encouraging coaching tips.
* **💬 Interactive Chat Interface**: Don't just look at the best move—ask the AI questions! "Why is this a blunder?" or "What do you recommend here?" and get context-aware answers.
* **📊 Post-Game Dashboard**: A beautifully designed, gamified summary page featuring a dynamic Accuracy Ring, Blunder/Mistake trackers, and a Key Moments timeline.
* **🕹️ Seamless Board Navigation**: Play through your entire game history frame-by-frame, or branch off and try new moves to see how the AI reacts.

## 🏗️ System Architecture

The application is split into a modern React frontend and a high-performance Python backend.

* **Frontend**: React, TypeScript, Tailwind CSS, React Router, `chess.js`, and Lucide Icons.
* **Backend**: Python, FastAPI (for rapid API routing), `stockfish` (Python wrapper), `langchain`, and `requests` (for web scraping APIs).

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need the following installed on your system:
* [Node.js & npm](https://nodejs.org/)
* [Python 3.9+](https://www.python.org/)
* [Ollama](https://ollama.com/) (For running Llama 3 locally)
* **Stockfish**: Download the `stockfish.exe` engine and place it in the `Backend/` directory.

### 1. Setup the AI Brain (Ollama)
Open your terminal and pull the Llama 3 model (this runs the AI locally on your machine):
```bash
ollama run llama3
