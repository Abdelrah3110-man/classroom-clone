@extends('layouts.classroom')

@section('classroom-content')

@php use Carbon\Carbon; @endphp

<div class="container py-3">

    {{-- ================= HEADER ================= --}}
    <div class="d-flex justify-content-between align-items-center mb-3">

        <div>
            <h2 class="fw-bold mb-1"> Classwork</h2>
            <p class="text-muted mb-0">{{ $classroom->name }}</p>
        </div>

        <div class="d-flex gap-2">

            <button class="btn btn-outline-primary btn-sm" onclick="expandAll()">
                 Expand All
            </button>

            <button class="btn btn-outline-secondary btn-sm" onclick="collapseAll()">
                 Collapse All
            </button>

        </div>

    </div>


    {{-- ================= CREATE ================= --}}
    @if($classroom->teacher_id === auth()->id())

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body d-flex justify-content-end">

                <div class="dropdown">

                    <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        + Create
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end shadow">

                        <li>
                            <a class="dropdown-item" href="{{ route('assignments.create', $classroom->id) }}">
                                 Assignment
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item" href="{{ route('materials.create', $classroom->id) }}">
                                 Material
                            </a>
                        </li>

                        <li><hr class="dropdown-divider"></li>

                        <li>
                            <button class="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target="#subjectModal">
                                 Subject
                            </button>
                        </li>

                    </ul>

                </div>

            </div>
        </div>

    @endif


    {{-- ================= GENERAL ================= --}}
    <div class="subject-box mb-3">

        <div class="subject-header"
             data-bs-toggle="collapse"
             data-bs-target="#general">

            No Topic

        </div>

        <div class="collapse show subject-body" id="general">

            @foreach($classroom->assignments->whereNull('subject_id') as $a)

                @php $due = $a->due_date ? Carbon::parse($a->due_date) : null; @endphp

                <a href="{{ route('assignments.show', $a->id) }}" class="card class-card text-decoration-none">

                    <div class="card-body">

                        <div class="text-primary fw-bold"> Assignment</div>
                        <div class="fw-semibold">{{ $a->title }}</div>
                        <small class="text-muted">{{ $a->description }}</small>

                        @if($due)
                            <div class="mt-2">
                                <span class="badge bg-{{ now()->gt($due) ? 'danger' : 'success' }}">
                                    {{ now()->gt($due) ? ' Late' : ' Due' }}
                                    · {{ $due->format('M d, Y') }}
                                </span>
                            </div>
                        @endif

                    </div>

                </a>

            @endforeach


            @foreach($classroom->materials->whereNull('subject_id') as $m)

                <a href="{{ route('materials.show', $m->id) }}" class="card class-card text-decoration-none">

                    <div class="card-body">

                        <div class="text-success fw-bold"> Material</div>
                        <div class="fw-semibold">{{ $m->title }}</div>
                        <small class="text-muted">{{ $m->description }}</small>

                    </div>

                </a>

            @endforeach

        </div>

    </div>


    {{-- ================= SUBJECTS ================= --}}
    @foreach($classroom->subjects as $subject)

        <div class="subject-box mb-3">

            {{-- HEADER --}}
            <div class="subject-header d-flex justify-content-between align-items-center"
                 data-bs-toggle="collapse"
                 data-bs-target="#subject-{{ $subject->id }}">

                <span> {{ $subject->name }}</span>

                @if($classroom->teacher_id === auth()->id())

                    <div class="dropdown">

                        <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
                            ⋮
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">

                            <li>
                                <button class="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editSubject{{ $subject->id }}">
                                     Edit
                                </button>
                            </li>

                            <li>
                                <form method="POST"
                                      action="{{ route('subjects.destroy', $subject->id) }}"
                                      onsubmit="return confirmDelete(event)">
                                    @csrf
                                    @method('DELETE')

                                    <button class="dropdown-item text-danger">
                                         Delete
                                    </button>
                                </form>
                            </li>

                        </ul>

                    </div>

                @endif

            </div>


            {{-- BODY --}}
            <div class="collapse subject-body" id="subject-{{ $subject->id }}">

                {{-- ASSIGNMENTS --}}
                @foreach($classroom->assignments->where('subject_id', $subject->id) as $a)

                    @php $due = $a->due_date ? Carbon::parse($a->due_date) : null; @endphp

                    <a href="{{ route('assignments.show', $a->id) }}" class="card class-card text-decoration-none">

                        <div class="card-body">

                            <div class="text-primary fw-bold"> Assignment</div>
                            <div class="fw-semibold">{{ $a->title }}</div>
                            <small class="text-muted">{{ $a->description }}</small>

                            @if($due)
                                <div class="mt-2">
                                    <span class="badge bg-{{ now()->gt($due) ? 'danger' : 'success' }}">
                                        {{ now()->gt($due) ? ' Late' : ' Due' }}
                                        · {{ $due->format('M d, Y') }}
                                    </span>
                                </div>
                            @endif

                        </div>

                    </a>

                @endforeach


                {{-- MATERIALS --}}
                @foreach($classroom->materials->where('subject_id', $subject->id) as $m)

                    <a href="{{ route('materials.show', $m->id) }}" class="card class-card text-decoration-none">

                        <div class="card-body">

                            <div class="text-success fw-bold"> Material</div>
                            <div class="fw-semibold">{{ $m->title }}</div>
                            <small class="text-muted">{{ $m->description }}</small>

                        </div>

                    </a>

                @endforeach

            </div>

        </div>


        {{-- ================= EDIT SUBJECT MODAL ================= --}}
        <div class="modal fade" id="editSubject{{ $subject->id }}" tabindex="-1">

            <div class="modal-dialog">

                <div class="modal-content">

                    <form method="POST" action="{{ route('subjects.update', $subject->id) }}">
                        @csrf
                        @method('PUT')

                        <div class="modal-header">
                            <h5 class="modal-title">Edit Subject</h5>
                        </div>

                        <div class="modal-body">

                            <input type="text"
                                   name="name"
                                   value="{{ $subject->name }}"
                                   class="form-control">

                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-primary">Save</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>

    @endforeach

</div>


{{-- ================= CREATE SUBJECT MODAL ================= --}}
<div class="modal fade" id="subjectModal" tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <form method="POST" action="{{ route('subjects.store') }}">
                @csrf

                <input type="hidden" name="classroom_id" value="{{ $classroom->id }}">

                <div class="modal-header">
                    <h5 class="modal-title">Add Subject</h5>
                </div>

                <div class="modal-body">

                    <input type="text"
                           name="name"
                           class="form-control"
                           placeholder="Subject name"
                           required>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary">Create</button>
                </div>

            </form>

        </div>

    </div>

</div>


{{-- ================= JS ================= --}}
<script>

function expandAll(){
    document.querySelectorAll('.collapse').forEach(el => {
        new bootstrap.Collapse(el, { show: true });
    });
}

function collapseAll(){
    document.querySelectorAll('.collapse').forEach(el => {
        new bootstrap.Collapse(el, { hide: true });
    });
}

function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Delete Subject?',
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
</script>


{{-- ================= STYLE ================= --}}
<style>

.subject-box{
    border-radius:14px;
    overflow:hidden;
    border:1px solid #eee;
    background:#fff;
    margin-bottom:15px;
}

.subject-header{
    padding:12px 15px;
    font-weight:600;
    cursor:pointer;
    background:#f8f9fa;
}

.subject-header:hover{
    background:#eef2ff;
}

.class-card{
    border:none;
    border-radius:12px;
    margin:8px;
    box-shadow:0 2px 8px rgba(0,0,0,0.05);
    transition:0.2s;
}

.class-card:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(0,0,0,0.1);
}

</style>

@endsection