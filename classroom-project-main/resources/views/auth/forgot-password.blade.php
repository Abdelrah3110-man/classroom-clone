<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: #f5f7fb;
        }

        .auth-box {
            max-width: 420px;
            margin: 80px auto;
        }

        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .btn-primary {
            width: 100%;
        }
    </style>
</head>

<body>

<div class="auth-box">

    <div class="card p-4">

        <h3 class="fw-bold mb-2 text-center">Forgot Password</h3>

        <p class="text-muted text-center mb-4">
            Enter your email and we’ll send you a reset link.
        </p>

        {{-- STATUS MESSAGE --}}
        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        {{-- FORM --}}
        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email"
                       name="email"
                       class="form-control"
                       value="{{ old('email') }}"
                       required>
                @error('email')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            <button class="btn btn-primary">
                Send Reset Link
            </button>

        </form>

        <div class="text-center mt-3">
            <a href="{{ route('login') }}" class="text-decoration-none">
                Back to login
            </a>
        </div>

    </div>

</div>

</body>
</html>