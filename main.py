import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from stockfish import Stockfish
from langchain_community.llms import Ollama

app = FastAPI(title="Mohamed Alaraby Chess AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Stockfish
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
STOCKFISH_PATH = os.path.join(CURRENT_DIR, "stockfish.exe")
stockfish = Stockfish(path=STOCKFISH_PATH)
stockfish.set_depth(15)

# Initialize Ollama
llm = Ollama(model="llama3")

# --- Request Models ---
class MoveRequest(BaseModel):
    fen: str

class ReportRequest(BaseModel):
    fens: list[str]

# --- NEW: Chat Request Model ---
class ChatRequest(BaseModel):
    message: str
    fen: str

@app.get("/")
def health():
    return {"status": "Mohamed Alaraby Backend Online"}

@app.post("/analyze")
async def analyze_position(request: MoveRequest):
    stockfish.set_fen_position(request.fen)
    evaluation = stockfish.get_evaluation()
    best_move = stockfish.get_best_move()
    
    eval_text = f"{evaluation['value']/100} pawns" if evaluation["type"] == "cp" else f"Mate in {evaluation['value']}"
    
    prompt = f"""
You are the Mohamed Alaraby AI Chess Coach. 
Chess position evaluation: {eval_text}
Best move: {best_move}
Explain in ONE short, encouraging sentence why this move is strong.
"""
    try:
        ai_response = llm.invoke(prompt)
    except Exception:
        ai_response = "This move strengthens your position and controls key squares!"

    return {"sender": "coach", "text": ai_response, "best_move": best_move}

# --- NEW: Custom Chat Endpoint ---
@app.post("/chat")
async def custom_chat(request: ChatRequest):
    stockfish.set_fen_position(request.fen)
    best_move = stockfish.get_best_move()
    evaluation = stockfish.get_evaluation()
    
    score = f"{evaluation['value']/100} pawns" if evaluation["type"] == "cp" else f"Mate in {evaluation['value']}"
    
    prompt = f"""
You are the Mohamed Alaraby AI Chess Coach.
The current board evaluation is: {score}.
The best engine move is: {best_move}.
The user asks: "{request.message}"
Answer the user directly, concisely, and helpfully in 1 or 2 sentences.
"""
    try:
        ai_response = llm.invoke(prompt)
    except Exception:
        ai_response = f"I recommend looking closely at {best_move} to improve your position!"

    return {"text": ai_response}

@app.post("/fetch-chess-com")
async def fetch_game(request: dict):
    user_input = request.get("url", "").strip()
    headers = {'User-Agent': 'MohamedAlarabyApp/1.0', 'Accept-Encoding': 'gzip, deflate'}

    try:
        if "lichess.org" in user_input:
            game_id = user_input.strip('/').split('/')[-1]
            res = requests.get(f"https://lichess.org/game/export/{game_id}", headers=headers)
            return {"pgn": res.text} if res.status_code == 200 else {"error": "Lichess fetch failed"}

        if "/" not in user_input:
            res = requests.get(f"https://api.chess.com/pub/player/{user_input}/games/archives", headers=headers)
            latest_month = res.json().get("archives", [])[-1]
            games = requests.get(latest_month, headers=headers).json().get("games", [])
            return {"pgn": games[-1].get("pgn")}
        
        return {"error": "Please enter a Username or Lichess link."}
    except Exception as e:
        return {"error": str(e)}

@app.post("/generate-report")
async def generate_report(request: ReportRequest):
    fens = request.fens
    blunders, mistakes, great_moves, prev_normalized_eval = 0, 0, 0, 0
    
    for i, fen in enumerate(fens):
        stockfish.set_fen_position(fen)
        ev = stockfish.get_evaluation()
        
        raw_val = ev["value"] if ev["type"] == "cp" else (5000 if ev["value"] > 0 else -5000)
        is_white_to_move = " w " in fen
        current_normalized_eval = raw_val if is_white_to_move else -raw_val
        
        if i > 0:
            was_whites_turn = " b " in fen 
            if was_whites_turn:
                loss = prev_normalized_eval - current_normalized_eval
            else:
                loss = current_normalized_eval - prev_normalized_eval
            
            if loss > 300:    
                blunders += 1
            elif loss > 100:  
                mistakes += 1
            elif loss < 10:   
                great_moves += 1
                
        prev_normalized_eval = current_normalized_eval

    total_moves = len(fens)
    if total_moves <= 1:
        accuracy = 100
    else:
        penalty = (blunders * 15) + (mistakes * 5)
        accuracy = max(5, 100 - (penalty * 20 / total_moves))

    return {
        "accuracy": round(min(100, accuracy)), 
        "blunders": blunders, 
        "mistakes": mistakes, 
        "great_moves": great_moves
    }