<!DOCTYPE html>
<html>
<head>
    <title>Classroom App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container text-center mt-5">

    <h1 class="fw-bold">Welcome to Classroom</h1>

    <p class="text-muted">
        Learn, teach, and collaborate easily
    </p>

    <div class="mt-4">

        <a href="{{ route('login') }}" class="btn btn-primary me-2">
            Login
        </a>

        <a href="{{ route('register') }}" class="btn btn-success">
            Register
        </a>

    </div>

</div>

</body>
</html>