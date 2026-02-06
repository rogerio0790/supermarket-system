import os
from openai import OpenAI
from decouple import config

class AIService:
    """Service for AI integration (now using OpenAI)"""
    
    def __init__(self):
        # Use the specific key for this project to avoid conflicts with environment variables
        self.api_key = config('SUPERMARKET_OPENAI_API_KEY', default=config('GROK_API_KEY', default=None))
        self.client = OpenAI(
            api_key=self.api_key,
            base_url='https://api.openai.com/v1'
        )
        # Using gpt-4o-mini as a good balance of speed and quality
        self.model = "gpt-4o-mini"
    
    def generate_product_description(self, product_name, category, price, unit, existing_description=None):
        """Generate AI-powered product description using OpenAI"""
        
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
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional copywriter specializing in grocery and supermarket product descriptions."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return completion.choices[0].message.content.strip()
            
        except Exception as e:
            error_msg = str(e)
            print(f"Error generating description with OpenAI: {error_msg}")
            if "403" in error_msg or "credits" in error_msg.lower() or "insufficient_quota" in error_msg:
                return "ERROR_NO_CREDITS: Your OpenAI account has no credits or insufficient quota."
            return None
