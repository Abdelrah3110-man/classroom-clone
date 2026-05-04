<!DOCTYPE html>
<html>
<head>
    <title>Register</title>

    {{-- CUSTOM AUTH CSS --}}
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>

<body>


<div class="auth-container">

    <div class="auth-card">

        {{-- TITLE --}}
        <h2 class="auth-title">Register</h2>

        {{-- REGISTER FORM --}}
        <form method="POST" action="{{ route('register') }}">
            @csrf

            {{-- NAME --}}
            <input type="text"
                   name="name"
                   class="auth-input"
                   placeholder="Full Name"
                   required>

            {{-- EMAIL --}}
            <input type="email"
                   name="email"
                   class="auth-input"
                   placeholder="Email"
                   required>

            {{-- PASSWORD --}}
            <input type="password"
                   name="password"
                   class="auth-input"
                   placeholder="Password"
                   required>

            {{-- CONFIRM PASSWORD --}}
            <input type="password"
                   name="password_confirmation"
                   class="auth-input"
                   placeholder="Confirm Password"
                   required>

            {{-- BUTTON --}}
            <button type="submit" class="auth-btn">
                Create Account
            </button>

        </form>

        {{-- FOOTER --}}
        <div class="auth-footer">
            Already have an account?
            <a href="{{ route('login') }}">Login</a>
        </div>

    </div>

</div>



</body>
</html>