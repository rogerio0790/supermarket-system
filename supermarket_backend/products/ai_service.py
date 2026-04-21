import google.generativeai as genai
from decouple import config


class AIService:
    """Service for AI integration using Google Gemini"""

    def __init__(self):
        # Load API key securely from .env
        self.api_key = config('GEMINI_API_KEY')

        genai.configure(api_key=self.api_key)

        # Initialize model
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_product_description(
        self,
        product_name,
        category,
        price,
        unit,
        existing_description=None
    ):
        """Generate AI-powered product description"""

        prompt = f"""You are a knowledgeable product information specialist for RUKARA SUPERMARKET in Rwanda.

Generate an informative description for:

Product: {product_name}
Category: {category}
Price: RWF {price}
Unit: {unit}
{"Current Description: " + str(existing_description) if existing_description else ""}

Write 2–3 informative paragraphs (150–200 words).
Use an educational tone relevant to Rwanda.
Avoid hype or exaggeration.
"""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=500
                )
            )

            if response and hasattr(response, "text"):
                return response.text.strip()

            return "Generation failed."

        except Exception as e:
            print(f"Gemini error: {e}")
            return None