from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env if you're storing your key there
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# In-memory store for conversation histories
CONVERSATIONS = {}

# Initial prompt
initial_prompt = "You are Ira, a calm, compassionate, and emotionally supportive AI companion."

@api_view(['POST'])
def chat(request):
    conversation_id = request.data.get('conversation_id', 'default')
    user_message = request.data.get('message')

    # Get or create a chat session
    chat_session = CONVERSATIONS.get(conversation_id)
    if not chat_session:
        chat_session = model.start_chat(history=[
            {"role": "user", "parts": [initial_prompt]},
            {"role": "model", "parts": ["Oh, hello there. It's truly lovely to connect with you."]}
        ])
        CONVERSATIONS[conversation_id] = chat_session

    # Send the message and get the response
    response = chat_session.send_message(user_message)

    return Response({
        "response": response.text,
        "conversation_id": conversation_id
    })
