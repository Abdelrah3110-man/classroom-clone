@extends('layouts.app')

@section('content')

<div class="container mt-4">

    {{-- HEADER --}}
    <div class="d-flex justify-content-between align-items-center mb-4">

        <h2 class="fw-bold">Classrooms</h2>

        <div class="d-flex gap-2">

            <a href="{{ route('classrooms.create') }}"
               class="btn btn-primary px-4">
                Create
            </a>

            <a href="{{ route('classrooms.joinPage') }}"
               class="btn btn-outline-success px-4">
                Join
            </a>

        </div>

    </div>

    {{-- GRID --}}
    <div class="row g-4">

        @php
            $allClassrooms = collect($created ?? [])
                ->merge($joined ?? [])
                ->unique('id');
        @endphp

        @forelse($allClassrooms as $classroom)

            <div class="col-md-4">

                <div class="card border-0 shadow-sm h-100 hover-card">

                    <div class="card-body">

                        {{-- TOP ROW --}}
                        <div class="d-flex justify-content-between align-items-start">

                            {{-- CLICKABLE CONTENT ONLY --}}
                            <a href="{{ route('classrooms.show', $classroom->id) }}"
                               class="text-decoration-none text-dark flex-grow-1">

                                <h5 class="fw-bold mb-1">
                                    {{ $classroom->name }}
                                </h5>

                                <p class="text-muted small mb-2">
                                    {{ $classroom->section }}
                                </p>

                                {{-- ROLE BADGE --}}
                                @if($classroom->teacher_id === auth()->id())
                                    <span class="badge bg-primary">Teacher</span>
                                @else
                                    <span class="badge bg-secondary">Student</span>
                                @endif

                            </a>

                            {{-- 3 DOT MENU --}}
                            <div class="dropdown ms-2">

                                <button class="btn btn-light btn-sm dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                    ⋮
                                </button>

                                <ul class="dropdown-menu dropdown-menu-end">

                                    <li>
                                        <a class="dropdown-item"
                                           href="{{ route('classrooms.show', $classroom->id) }}">
                                            Open
                                        </a>
                                    </li>

                                    @if($classroom->teacher_id === auth()->id())

                                        <li>
                                            <a class="dropdown-item"
                                               href="{{ route('classrooms.edit', $classroom->id) }}">
                                                Edit
                                            </a>
                                        </li>

                                        <li><hr class="dropdown-divider"></li>

                                        <li>
                                            <form method="POST"
                                                  action="{{ route('classrooms.destroy', $classroom->id) }}"
                                                  onsubmit="return confirmDelete(event)">
                                                @csrf
                                                @method('DELETE')

                                                <button class="dropdown-item text-danger">
                                                    Delete
                                                </button>
                                            </form>
                                        </li>

                                    @else

                                        <li>
                                            <form method="POST"
                                                  action="{{ route('classrooms.leave', $classroom->id) }}"
                                                  onsubmit="return confirmLeave(event)">
                                                @csrf

                                                <button class="dropdown-item text-danger">
                                                    Leave Class
                                                </button>
                                            </form>
                                        </li>

                                    @endif

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        @empty

            <div class="col-12 text-center text-muted py-5">
                No classrooms yet
            </div>

        @endforelse

    </div>

</div>

<script>
function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Delete Classroom?',
        text: "This Action Can't be Undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            e.target.submit();
        }
    });

    return false;
}

function confirmLeave(e){
    e.preventDefault();

    Swal.fire({
        title: 'Leave Classroom?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Leave'
    }).then((result) => {
        if (result.isConfirmed) {
            e.target.submit();
        }
    });

    return false;
}
</script>

{{-- HOVER EFFECT --}}
<style>
.hover-card {
    transition: 0.2s ease;
    cursor: pointer;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
</style>

@endsection