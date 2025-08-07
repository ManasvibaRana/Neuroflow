from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
import bcrypt
from django.core.mail import send_mail
from .models import User, PendingUser
import random
from django.http import JsonResponse
from .models import User


def generate_otp():
    return str(random.randint(100000, 999999))

@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

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

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    otp = generate_otp()

    # Create or update pending user
    pending, created = PendingUser.objects.update_or_create(
        email=email,
        defaults={
            'userid': userid,
            'hashed_password': hashed_pw,
            'otp': otp
        }
    )

    # Send email
    send_mail(
        subject='Verify your NeuroFlow Account',
        message=f'Your verification code is: {otp}',
        from_email=None,  # Uses DEFAULT_FROM_EMAIL
        recipient_list=[email],
        fail_silently=False
    )

    return JsonResponse({
        'message': 'Verification code sent to email',
        'status': 'pending_created' if created else 'pending_updated'
    }, status=200)

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')

        if not email or not otp:
            return JsonResponse({'error': 'Email and OTP are required'}, status=400)

        try:
            pending = PendingUser.objects.get(email=email)
        except PendingUser.DoesNotExist:
            return JsonResponse({'error': 'No pending registration for this email'}, status=404)

        if pending.otp != otp:
            return JsonResponse({'error': 'Invalid OTP'}, status=400)

        # OTP is correct → create final user
        User.objects.create(
            userid=pending.userid,
            email=pending.email,
            password=pending.hashed_password
        )
        pending.delete()  # cleanup

        return JsonResponse({'message': 'Account verified and created successfully'}, status=201)

    return JsonResponse({'error': 'Only POST allowed'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('userid')  # userID or email
        password = data.get('password')

        if not identifier or not password:
            return JsonResponse({'error': 'User ID/Email and password are required'}, status=400)

        try:
            if '@' in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(userid=identifier)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return JsonResponse({
                'message': 'Login successful',
                'userid': user.userid
            }, status=200)
        else:
            return JsonResponse({'error': 'Incorrect password'}, status=401)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

def get_user_stats(request):
    userid = request.GET.get('userid')
    if not userid:
        return JsonResponse({'error': 'User ID is required'}, status=400)

    try:
        user = User.objects.get(userid=userid)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    # Logic to determine badge based on streak
    streak = user.streak
    badge = "bronze"
    if streak >= 15: badge = "silver"
    if streak >= 30: badge = "gold"
    if streak >= 60: badge = "platinum"
    if streak >= 100: badge = "diamond"

    return JsonResponse({
        'streak': streak,
        'badge': badge
    })