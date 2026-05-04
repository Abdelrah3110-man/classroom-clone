<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: #f5f7fb;
        }

        .auth-box {
            max-width: 450px;
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

        <h3 class="fw-bold text-center mb-2">Reset Password</h3>

        <p class="text-muted text-center mb-4">
            Enter your new password below
        </p>

        <form method="POST" action="{{ route('password.store') }}">
            @csrf

            {{-- TOKEN --}}
            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            {{-- EMAIL --}}
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email"
                       name="email"
                       class="form-control"
                       value="{{ old('email', $request->email) }}"
                       required
                       autofocus>
                @error('email')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            {{-- PASSWORD --}}
            <div class="mb-3">
                <label class="form-label">New Password</label>
                <input type="password"
                       name="password"
                       class="form-control"
                       required>
                @error('password')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            {{-- CONFIRM PASSWORD --}}
            <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input type="password"
                       name="password_confirmation"
                       class="form-control"
                       required>
            </div>

            <button class="btn btn-primary">
                Reset Password
            </button>

        </form>

    </div>

</div>

</body>
</html>