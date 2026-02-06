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
        
        prompt = f"""You are an expert copywriter for RUKARA SUPERMARKET, a premium grocery store in Rwanda.

Generate an engaging, informative product description for:

Product: {product_name}
Category: {category}
Price: RWF {price}
Unit: {unit}
{f"Current Description: {existing_description}" if existing_description else ""}

Requirements:
- Write 2-3 compelling paragraphs (150-200 words total)
- Highlight quality, freshness, and value
- Include benefits and usage suggestions
- Use persuasive but natural language
- Be culturally relevant to Rwandan customers
- Focus on why customers should buy this product

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
