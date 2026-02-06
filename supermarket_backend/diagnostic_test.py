import os
import sys
from decouple import config
from openai import OpenAI

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_diagnostic():
    print("=== Supermarket System AI Diagnostic (OpenAI) ===")
    
    # 1. Check .env loading
    try:
        api_key = config('SUPERMARKET_OPENAI_API_KEY', default=config('GROK_API_KEY'))
        print(f"[1] .env Check: Success. Key starts with: {api_key[:10]}...")
    except Exception as e:
        print(f"[1] .env Check: FAILED. Could not find API key. Error: {e}")
        return

    # 2. Test connection to OpenAI
    print("[2] Testing connection to OpenAI API...")
    client = OpenAI(
        api_key=api_key,
        base_url='https://api.openai.com/v1'
    )
    
    try:
        # Minimal request to check auth and credits
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5
        )
        print("[2] OpenAI API Check: Success! API is working and has credits.")
        print(f"    Response: {response.choices[0].message.content.strip()}")
    except Exception as e:
        print(f"[2] OpenAI API Check: FAILED.")
        print(f"    Error Type: {type(e).__name__}")
        print(f"    Error Message: {str(e)}")
        
        if "insufficient_quota" in str(e).lower():
            print("\n!!! DIAGNOSIS: QUOTA ISSUE !!!")
            print("The API key is correct, but the OpenAI account has NO CREDITS or has exceeded its quota.")
            print("You must go to https://platform.openai.com/account/billing to add credits.")
        elif "invalid_api_key" in str(e).lower() or "401" in str(e):
            print("\n!!! DIAGNOSIS: INVALID KEY !!!")
            print("The API key provided is invalid or has been revoked.")
            
if __name__ == "__main__":
    run_diagnostic()
