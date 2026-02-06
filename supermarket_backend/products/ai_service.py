import os
import google.generativeai as genai
from decouple import config

class AIService:
    """Service for AI integration (now using Google Gemini)"""
    
    def __init__(self):
        # Use the specific key for this project
        self.api_key = config('GEMINI_API_KEY', default="AIzaSyAxLF-zIyopOKV5_-RgYx4aAeFEBNHKL-k")
        genai.configure(api_key=self.api_key)
        # Using gemini-2.5-flash as it's available in this environment
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_product_description(self, product_name, category, price, unit, existing_description=None):
        """Generate AI-powered product description using Gemini"""
        
        prompt = f"""You are a knowledgeable product information specialist for RUKARA SUPERMARKET in Rwanda.

Generate an informative description for:

Product: {product_name}
Category: {category}
Price: RWF {price}
Unit: {unit}
{f"Current Description: {existing_description}" if existing_description else ""}

Requirements:
- If this is a well-known brand (like beer, wine, spirits, or established food brands), focus on:
  * Brand history and origin
  * When and where it was founded
  * What makes this brand unique or notable
  * Traditional brewing/production methods (if applicable)
  * Flavor profile or characteristics
  
- If this is a general product, provide:
  * Product information and characteristics
  * Quality indicators
  * Usage suggestions
  * Nutritional or practical benefits

- Write 2-3 informative paragraphs (150-200 words total)
- Use educational and factual tone, not purely advertising
- Be culturally relevant to Rwandan customers
- Avoid excessive marketing language

Write the description now:"""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=500,
                )
            )
            
            if response.candidates and response.candidates[0].content.parts:
                return response.text.strip()
            else:
                return "AI was unable to generate a description for this product due to safety filters or other restrictions."
            
        except Exception as e:
            print(f"Error generating description with Gemini: {str(e)}")
            return None