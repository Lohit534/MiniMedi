import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv('c:/Users/payya/OneDrive/Desktop/Minimedi/minimedi/backend/.env')

api_key = os.getenv("OPENAI_API_KEY")

print(f"Testing key: {api_key[:10]}...{api_key[-5:] if api_key else 'NONE'}")

if not api_key:
    print("ERROR: No API key found in .env")
    sys.exit(1)

client = OpenAI(api_key=api_key)

try:
    print("Sending test request to GPT-3.5-Turbo...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello, are you working?"}],
        max_tokens=10
    )
    print("SUCCESS! Response received:")
    print(response.choices[0].message.content)
except Exception as e:
    print("FAILED! Error details:")
    print(str(e))
