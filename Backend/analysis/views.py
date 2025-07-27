# analytics/views.py - Final Comprehensive Version
# This version calculates ALL required data points in a single API call
# to match the structure expected by the original frontend code.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Avg, Sum, Q, Count
from datetime import timedelta, date
from collections import Counter, defaultdict
from scipy import stats
import numpy as np
import calendar

from users.models import User
from journal.models import JournalEntry
from productivity.models import Productivity
from django.utils.timezone import localdate

def get_last_day_of_month(dt):
    return dt.replace(day=calendar.monthrange(dt.year, dt.month)[1])

def get_mood_valence_score(emotion, score, valence_map):
    if not emotion or score is None:
        return 0
    valence = valence_map.get(emotion.lower(), 0)
    return score * valence

@api_view(['GET'])
@permission_classes([])
def analysis_view(request):
    user_id = request.GET.get('userid')
    if not user_id:
        return Response({'error': 'userid missing'}, status=400)
    try:
        user = User.objects.get(userid=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    today = date.today()
    valence_map = {'joy': 1, 'surprise': 0.5, 'sad': -1, 'anger': -1, 'fear': -1, 'disgust': -1, 'neutral': 0}

    # --- 1. Weekly Data Calculation ---
    week_start = today - timedelta(days=6)
    labels_weekly = [(week_start + timedelta(days=i)).strftime("%a") for i in range(7)]
    
    journals_week = JournalEntry.objects.filter(user=user, date__range=(week_start, today))
    productivity_week = Productivity.objects.filter(user=user, date__range=(week_start, today))
    
    mood_trend_weekly = []
    productivity_trend_weekly = []
    mood_details_weekly = []

    for i in range(7):
        day = week_start + timedelta(days=i)
        journal = journals_week.filter(date=day).first()
        mood_score = get_mood_valence_score(getattr(journal, 'emotion_1', None), getattr(journal, 'score_1', 0), valence_map)
        mood_trend_weekly.append(round(mood_score, 2))
        mood_details_weekly.append({'emotion': getattr(journal, 'emotion_1', 'none'), 'score': getattr(journal, 'score_1', 0)})
        
        prod_avg = productivity_week.filter(date=day).aggregate(avg=Avg('score'))['avg'] or 0
        productivity_trend_weekly.append(round(prod_avg, 2))

    # --- 2. Monthly Data Calculation ---
    # This calculates for the last 4 full months for historical charts
    labels_monthly = []
    mood_trend_monthly = []
    productivity_trend_monthly = []
    mood_details_monthly = []
    monthly_growth = []
    growth_labels = []

    for i in range(4):
        month_date = (today - timedelta(days=i*30)).replace(day=1)
        month_start = month_date
        month_end = get_last_day_of_month(month_start)
        
        month_label = month_start.strftime("%b %Y")
        labels_monthly.insert(0, month_label)
        growth_labels.insert(0, month_start.strftime("%b"))

        month_journals = JournalEntry.objects.filter(user=user, date__range=(month_start, month_end))
        
        monthly_valence_scores = [get_mood_valence_score(j.emotion_1, j.score_1, valence_map) for j in month_journals]
        mood_avg = np.mean(monthly_valence_scores) if monthly_valence_scores else 0
        mood_trend_monthly.insert(0, round(mood_avg, 2))

        prod_avg = Productivity.objects.filter(user=user, date__range=(month_start, month_end)).aggregate(avg=Avg('score'))['avg'] or 0
        productivity_trend_monthly.insert(0, round(prod_avg, 2))
        monthly_growth.insert(0, round(prod_avg, 2))

        dominant_emotion = month_journals.values('emotion_1').annotate(count=Count('emotion_1')).order_by('-count').first()
        mood_details_monthly.insert(0, {'emotion': dominant_emotion['emotion_1'] if dominant_emotion else 'none', 'score': 0}) # Score part is simplified

    # --- 3. Emotion Distributions ---
    def count_emotions(queryset):
        counts = Counter(j.emotion_1.lower() for j in queryset if j.emotion_1)
        for e in ['joy', 'sad', 'anger', 'fear', 'disgust', 'surprise', 'neutral']:
            counts.setdefault(e, 0)
        return dict(counts)
    
    all_emotions_weekly = count_emotions(journals_week)
    current_month_journals = JournalEntry.objects.filter(user=user, date__year=today.year, date__month=today.month)
    all_emotions_monthly = count_emotions(current_month_journals)

    # --- 4. All-Time Statistics ---
    all_tasks = Productivity.objects.filter(user=user)
    completed_tasks = all_tasks.filter(status=True)
    
    task_stats = {
        'completed': completed_tasks.count(),
        'not_completed': all_tasks.filter(status=False).count(),
        'early': completed_tasks.filter(net_time__gt=timedelta(0)).count(),
        'on_time': completed_tasks.filter(net_time=timedelta(0)).count(),
        'late': completed_tasks.filter(net_time__lt=timedelta(0)).count(),
    }

    task_type_stats = dict(Counter(all_tasks.values_list('type_of_task', flat=True)))
    for t_type in ['DO', 'DECIDE', 'DELEGATE', 'DELETE']:
        task_type_stats.setdefault(t_type, 0)

    total_ideal = all_tasks.aggregate(total=Sum('ideal_time'))['total'] or timedelta(0)
    total_taken = all_tasks.aggregate(total=Sum('taken_time'))['total'] or timedelta(0)
    time_allocated = round(total_ideal.total_seconds() / 3600, 2)
    time_used = round(total_taken.total_seconds() / 3600, 2)

    # --- 5. Correlation ---
    corr_start = today - timedelta(days=29)
    corr_journals = JournalEntry.objects.filter(user=user, date__range=(corr_start, today))
    corr_prod = Productivity.objects.filter(user=user, date__range=(corr_start, today))
    
    corr_prod_scores = defaultdict(list)
    for task in corr_prod: corr_prod_scores[task.date].append(task.score)
    
    mood_scores, prod_scores = [], []
    for journal in corr_journals:
        if journal.date in corr_prod_scores:
            mood_scores.append(get_mood_valence_score(journal.emotion_1, journal.score_1, valence_map))
            prod_scores.append(np.mean(corr_prod_scores[journal.date]))

    correlation_details = {'strength': 'insufficient_data', 'coefficient': 0, 'p_value': 1.0, 'sample_size': len(mood_scores), 'significant': False}
    if len(mood_scores) >= 5:
        coef, p_val = stats.pearsonr(mood_scores, prod_scores)
        coef = 0 if np.isnan(coef) else coef
        correlation_details.update({'coefficient': round(coef, 3), 'p_value': round(p_val, 4), 'significant': p_val < 0.05, 'strength': get_correlation_strength(coef)})

    # --- 6. AI Insights ---
    ai_insights = generate_ai_insights(correlation_details, all_emotions_weekly)

    # --- 7. Final Response Payload ---
    return Response({
        'labels_weekly': labels_weekly,
        'mood_trend_weekly': mood_trend_weekly,
        'productivity_trend_weekly': productivity_trend_weekly,
        'mood_details_weekly': mood_details_weekly,
        'all_emotions_weekly': all_emotions_weekly,
        'labels_monthly': labels_monthly,
        'mood_trend_monthly': mood_trend_monthly,
        'productivity_trend_monthly': productivity_trend_monthly,
        'mood_details_monthly': mood_details_monthly,
        'all_emotions_monthly': all_emotions_monthly,
        'growth_labels': growth_labels,
        'monthly_growth': monthly_growth,
        'task_stats': task_stats,
        'task_type_stats': task_type_stats,
        'time_allocated': time_allocated,
        'time_used': time_used,
        'correlation_score': correlation_details['coefficient'], # For legacy access
        'correlation_details': correlation_details,
        'ai_insights': ai_insights,
        'mood_stability_score': 100 - (np.std(mood_scores) * 100) if len(mood_scores) > 1 else 100,
    })

# --- Helper functions from before ---
def get_correlation_strength(correlation):
    abs_corr = abs(correlation)
    if abs_corr < 0.2: return 'very_weak'
    elif abs_corr < 0.4: return 'weak'
    elif abs_corr < 0.6: return 'moderate'
    elif abs_corr < 0.8: return 'strong'
    else: return 'very_strong'

def generate_ai_insights(correlation_details, emotions):
    insights = []
    if correlation_details['strength'] not in ['insufficient_data', 'very_weak']:
        insights.append(f"Your mood has a {correlation_details['strength'].replace('_', ' ')} {'positive' if correlation_details['coefficient'] > 0 else 'negative'} correlation with productivity.")
    if emotions and max(emotions.values()) > 0:
        dominant_emotion = max(emotions.items(), key=lambda x: x[1])[0]
        insights.append(f"'{dominant_emotion.title()}' was your most frequent emotion this week.")
    return insights
