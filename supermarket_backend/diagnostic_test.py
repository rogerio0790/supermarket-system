import os
import sys
from decouple import config
from openai import OpenAI

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_diagnostic():
    print("=== Supermarket System AI Diagnostic ===")
    
    # 1. Check .env loading
    try:
        api_key = config('GROK_API_KEY')
        print(f"[1] .env Check: Success. Key starts with: {api_key[:10]}...")
    except Exception as e:
        print(f"[1] .env Check: FAILED. Could not find GROK_API_KEY. Error: {e}")
        return

    # 2. Test direct connection to xAI
    print("[2] Testing connection to xAI API...")
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.x.ai/v1"
    )
    
    try:
        # Minimal request to check auth and credits
        response = client.chat.completions.create(
            model="grok-beta",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=1
        )
        print("[2] xAI API Check: Success! API is working and has credits.")
    except Exception as e:
        print(f"[2] xAI API Check: FAILED.")
        print(f"    Error Type: {type(e).__name__}")
        print(f"    Error Message: {str(e)}")
        
        if "403" in str(e) or "permission" in str(e).lower():
            print("\n!!! DIAGNOSIS: ACCOUNT ISSUE !!!")
            print("The API key is correct, but the xAI account has NO CREDITS.")
            print("You must go to https://console.x.ai/ to add a payment method and purchase credits.")
        elif "401" in str(e):
            print("\n!!! DIAGNOSIS: INVALID KEY !!!")
            print("The API key provided is invalid or has been revoked.")
            
if __name__ == "__main__":
    run_diagnostic()
