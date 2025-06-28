from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        userid = data.get('userid')
        email = data.get('email')
        password = data.get('password')

        if not userid or not email or not password:
            return JsonResponse({'error': 'All fields are required'}, status=400)

        if len(password) < 8:
            return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)

        if User.objects.filter(userid=userid).exists():
            return JsonResponse({'error': 'User ID already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        User.objects.create(userid=userid, email=email, password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)


# views.py
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('userid')  # can be userid or email
        password = data.get('password')

        if not identifier or not password:
            return JsonResponse({'error': 'User ID/Email and password are required'}, status=400)

        # Check if identifier looks like an email
        if '@' in identifier:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Email not found'}, status=404)
        else:
            try:
                user = User.objects.get(userid=identifier)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User ID not found'}, status=404)

        if user.password == password:
          
            return JsonResponse({
                'message': 'Login successful',
                'userid': user.userid  # ✅ Now sending userid
            }, status=200)
        else:
            return JsonResponse({'error': 'Incorrect password'}, status=401)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
