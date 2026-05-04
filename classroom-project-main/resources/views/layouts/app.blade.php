<!DOCTYPE html>
<html>
<head>
    <title>Classroom</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<nav class="navbar bg-body-tertiary fixed-top shadow-sm">
    <div class="container-fluid">

        {{-- BRAND --}}
        <a class="navbar-brand fw-bold" href="{{ route('classrooms.index') }}">
            Classroom
        </a>

        {{-- TOGGLE --}}
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menu">
            <span class="navbar-toggler-icon"></span>
        </button>

        {{-- SIDEBAR --}}
        <div class="offcanvas offcanvas-end" id="menu">

            {{-- HEADER --}}
            <div class="offcanvas-header">
                <h5 class="fw-bold">Menu</h5>
                <button class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>

            <div class="offcanvas-body">

                {{-- USER INFO --}}
             <a href="{{ route('profile.edit') }}" class="text-decoration-none text-dark">
                <div class="mb-3 p-2 border rounded bg-light hover-profile">
                   <strong>{{ auth()->user()->name }}</strong><br>
                   <small class="text-muted">
                    {{ auth()->user()->email }}
                    </small>
                </div>
            </a>

                {{-- NAV --}}
                <ul class="navbar-nav mb-3">

                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('classrooms.index') }}">
                            🏠 Home
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('classrooms.joinPage') }}">
                            ➕ Join Class
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('dashboard') }}">
                            📊 Dashboard
                        </a>
                    </li>

                    <li class="nav-item mt-2">
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button class="btn btn-danger w-100">
                                Logout
                            </button>
                        </form>
                    </li>

                </ul>

                <hr>

                {{-- ================= CREATED CLASSES (DROPDOWN) ================= --}}
                <button class="dropdown-toggle-btn w-100 text-start"
                        data-bs-toggle="collapse"
                        data-bs-target="#createdClasses">

                    Created Classes
                </button>

                <div class="collapse mt-2" id="createdClasses">

                    @forelse($created ?? [] as $classroom)

                        <a class="d-block text-decoration-none p-2 rounded hover-bg"
                           href="{{ route('classrooms.show', $classroom->id) }}">

                            {{ $classroom->name }}

                            @if($classroom->teacher_id === auth()->id())
                                <small class="text-muted d-block">
                                    Code: {{ $classroom->code }}
                                </small>
                            @endif

                        </a>

                    @empty
                        <small class="text-muted">No created classes</small>
                    @endforelse

                </div>

                <hr>

                {{-- ================= JOINED CLASSES (DROPDOWN) ================= --}}
                <button class="dropdown-toggle-btn w-100 text-start"
                        data-bs-toggle="collapse"
                        data-bs-target="#joinedClasses">

                    Joined Classes
                </button>

                <div class="collapse mt-2" id="joinedClasses">

                    @forelse($joined ?? [] as $classroom)

                        <a class="d-block text-decoration-none p-2 rounded hover-bg"
                           href="{{ route('classrooms.show', $classroom->id) }}">

                            {{ $classroom->name }}

                        </a>

                    @empty
                        <small class="text-muted">No joined classes</small>
                    @endforelse

                </div>

            </div>
        </div>

    </div>
</nav>

{{-- PAGE CONTENT --}}
<div class="container mt-5 pt-4">
    @yield('content')
</div>

{{-- STYLES --}}
<style>

.hover-bg:hover {
    background: #f1f1f1;
}

/* Dropdown button style */
.dropdown-toggle-btn {
    border: none;
    background: none;
    font-weight: 600;
    padding: 8px 0;
    position: relative;
}

/* Arrow */
.dropdown-toggle-btn::after {
    content: "▼";
    position: absolute;
    right: 0;
    transition: 0.3s;
}

/* Rotate arrow when open */
.dropdown-toggle-btn[aria-expanded="true"]::after {
    transform: rotate(180deg);
}

.hover-profile {
    transition: 0.2s;
    cursor: pointer;
}

.hover-profile:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}

</style>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>