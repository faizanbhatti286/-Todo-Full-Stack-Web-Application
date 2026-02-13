"""
Hugging Face Spaces entry point.

This file is required for Hugging Face Spaces deployment.
It imports and exposes the FastAPI app from src.main.
"""

from src.main import app

# Hugging Face Spaces will automatically run this with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
