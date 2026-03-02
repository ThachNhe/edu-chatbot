# Tin Học THPT ChatBot (RAG)

Chatbot hỗ trợ học sinh THPT môn Tin học, sử dụng nội dung từ `data/output.txt`.

## Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

`.env`:
```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

## Build Index
Đặt file `output.txt` vào thư mục `data/`, sau đó chạy:
```bash
python3 build_index.py
```

## Run
```bash
uvicorn server:app --host 0.0.0.0 --port 8765
```
Mở `http://localhost:8765/`.