<!DOCTYPE html>
<html>
<head>
    <title>Login</title>

    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>

<body>

<div class="auth-container">

    <div class="auth-card">

        <h2 class="auth-title">Login</h2>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <input type="email"
                   name="email"
                   class="auth-input"
                   placeholder="Email"
                   required>

            <input type="password"
                   name="password"
                   class="auth-input"
                   placeholder="Password"
                   required>

            <div style="margin-bottom: 15px;">
                <label>
                    <input type="checkbox" name="remember">
                    Remember me
                </label>
            </div>

            <button type="submit" class="auth-btn">
                Login
            </button>

        </form>

        {{-- FORGOT PASSWORD --}}
        <div style="text-align:center; margin-top:10px;">
            <a href="{{ route('password.request') }}">
                Forgot your password?
            </a>
        </div>

        <div class="auth-footer">
            Don’t have an account?
            <a href="{{ route('register') }}">Register</a>
        </div>

    </div>

</div>

</body>
</html>