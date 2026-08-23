"""
AI service for generating form field suggestions
"""
from typing import Optional, List
import requests
import json
from app.config import settings


class AIService:
    """Service for AI-powered form field suggestions"""
    
    def __init__(self):
        """Initialize AI service"""
        self.groq_api_key = settings.GROQ_API_KEY
        self.openai_api_key = settings.OPENAI_API_KEY
        self.groq_endpoint = "https://api.groq.com/openai/v1/chat/completions"
    
    def generate_suggestion(
        self,
        field_label: str,
        field_context: Optional[str],
        user_profile: dict,
        tone: str = "professional",
        character_limit: Optional[int] = None
    ) -> Optional[str]:
        """
        Generate AI suggestion for a form field
        
        Args:
            field_label: Label of the form field
            field_context: Additional context for the field
            user_profile: User's profile data
            tone: Tone preference ("professional" or "casual")
            character_limit: Maximum characters for response
            
        Returns:
            Generated suggestion or None if failed
        """
        try:
            prompt = self._build_prompt(
                field_label,
                field_context,
                user_profile,
                tone,
                character_limit
            )
            
            # Try Groq first, fallback to OpenAI
            if self.groq_api_key:
                suggestion = self._call_groq(prompt)
                if suggestion:
                    return suggestion
            
            if self.openai_api_key:
                suggestion = self._call_openai(prompt)
                if suggestion:
                    return suggestion
            
            # Fallback: return placeholder
            return "Please provide your response here."
            
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return None
    
    def _build_prompt(
        self,
        field_label: str,
        field_context: Optional[str],
        user_profile: dict,
        tone: str,
        character_limit: Optional[int]
    ) -> str:
        """Build prompt for AI model"""
        
        tone_instruction = "Keep tone professional and formal." if tone == "professional" else "Use casual, conversational tone."
        
        limit_instruction = f"Keep response under {character_limit} characters." if character_limit else ""
        
        profile_str = self._format_profile(user_profile)
        
        prompt = f"""
You are a helpful form assistant. Generate a relevant, concise answer for a form field.

User Profile:
{profile_str}

Field Label: "{field_label}"
{f'Field Context: {field_context}' if field_context else ''}

Instructions:
- {tone_instruction}
- {limit_instruction}
- Answer should be relevant to the user's profile
- Be specific and authentic
- Keep response concise but complete

Generate only the answer text, nothing else:
"""
        return prompt
    
    def _format_profile(self, user_profile: dict) -> str:
        """Format user profile for prompt"""
        profile_str = ""
        
        if "full_name" in user_profile:
            profile_str += f"Name: {user_profile['full_name']}\n"
        
        if "bio" in user_profile:
            profile_str += f"Bio: {user_profile['bio']}\n"
        
        if "skills" in user_profile:
            profile_str += f"Skills: {', '.join(user_profile['skills'])}\n"
        
        if "projects" in user_profile:
            profile_str += f"Projects: {', '.join(user_profile['projects'])}\n"
        
        if "achievements" in user_profile:
            profile_str += f"Achievements: {', '.join(user_profile['achievements'])}\n"
        
        return profile_str if profile_str else "No profile data available"
    
    def _call_groq(self, prompt: str) -> Optional[str]:
        """Call Groq API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "mixtral-8x7b-32768",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that generates form responses."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
            
            response = requests.post(
                self.groq_endpoint,
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"].strip()
            
            return None
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return None
    
    def _call_openai(self, prompt: str) -> Optional[str]:
        """Call OpenAI API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that generates form responses."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"].strip()
            
            return None
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            return None
    
    def truncate_to_limit(self, text: str, character_limit: int) -> str:
        """
        Truncate text to character limit
        
        Args:
            text: Text to truncate
            character_limit: Maximum characters
            
        Returns:
            Truncated text
        """
        if len(text) <= character_limit:
            return text
        
        truncated = text[:character_limit - 3]
        return truncated + "..."


# Create singleton instance
ai_service = AIService()
