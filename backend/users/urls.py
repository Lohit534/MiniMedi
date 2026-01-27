from django.urls import path
from .views import SignupView, LoginView, ProfileView, GoogleLoginView, ReportIssueView, IssueListView, IssueDetailView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("google-login/", GoogleLoginView.as_view()),
    path("report-issue/", ReportIssueView.as_view()),
    path("reports/", IssueListView.as_view()),
    path("reports/<int:pk>/", IssueDetailView.as_view()),
]
