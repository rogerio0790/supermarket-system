import os
import sys
from decouple import config
import google.generativeai as genai

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_diagnostic():
    print("=== Supermarket System AI Diagnostic (Gemini) ===")
    
    # 1. Check API Key
    try:
        api_key = config('GEMINI_API_KEY', default="AIzaSyAxLF-zIyopOKV5_-RgYx4aAeFEBNHKL-k")
        print(f"[1] API Key Check: Success. Key starts with: {api_key[:10]}...")
    except Exception as e:
        print(f"[1] API Key Check: FAILED. Error: {e}")
        return

    # 2. Test connection to Gemini
    print("[2] Testing connection to Gemini API...")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-flash-latest')
    
    try:
        # Minimal request to check auth
        response = model.generate_content("test", generation_config=genai.types.GenerationConfig(max_output_tokens=5))
        print("[2] Gemini API Check: Success! API is working.")
        print(f"    Response: {response.text.strip()}")
    except Exception as e:
        print(f"[2] Gemini API Check: FAILED.")
        print(f"    Error Type: {type(e).__name__}")
        print(f"    Error Message: {str(e)}")
        
        if "quota" in str(e).lower():
            print("\n!!! DIAGNOSIS: QUOTA ISSUE !!!")
            print("The Gemini API quota has been exceeded.")
        elif "invalid" in str(e).lower() or "401" in str(e):
            print("\n!!! DIAGNOSIS: INVALID KEY !!!")
            print("The API key provided is invalid or has been revoked.")
            
if __name__ == "__main__":
    run_diagnostic()
