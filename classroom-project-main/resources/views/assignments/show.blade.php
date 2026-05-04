@extends('layouts.classroom')

@section('classroom-content')

@php
    use Carbon\Carbon;

    $isExpired = $assignment->due_date && Carbon::now()->gt($assignment->due_date);
@endphp

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="card shadow-sm border-0 mb-4">

        <div class="card-body">

            <div class="d-flex justify-content-between align-items-start">

                {{-- LEFT --}}
                <div>

                    <h3 class="fw-bold mb-1">
                        {{ $assignment->title }}
                    </h3>

                    <p class="text-muted mb-2">
                        {{ $assignment->description }}
                    </p>

                    {{-- DUE DATE --}}
                    <div>
                        @if($assignment->due_date)

                            @if($isExpired)
                                <span class="badge bg-danger">
                                     Expired ({{ $assignment->due_date }})
                                </span>
                            @else
                                <span class="badge bg-success">
                                     Due: {{ $assignment->due_date }}
                                </span>
                            @endif

                        @else
                            <span class="badge bg-secondary">
                                No due date
                            </span>
                        @endif
                    </div>

                </div>

                {{-- TEACHER MENU --}}
                @if($assignment->classroom->teacher_id === auth()->id())

                    <div class="dropdown">

                        <button class="btn btn-light btn-sm dropdown-toggle"
                                data-bs-toggle="dropdown">
                            ⋮
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">

                            <li>
                                <a class="dropdown-item"
                                   href="{{ route('assignments.edit', $assignment->id) }}">
                                    Edit
                                </a>
                            </li>

                            <li><hr class="dropdown-divider"></li>

                            <li>
                                <form method="POST"
                                      action="{{ route('assignments.destroy', $assignment->id) }}"
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

            {{-- ================= MULTIPLE ATTACHMENTS ================= --}}
            @if($assignment->attachments->count())

                <div class="mt-3">

                    <label class="fw-semibold mb-2">Attachments</label>

                    <div class="d-flex flex-column gap-2">

                        @foreach($assignment->attachments as $file)

                            <div class="border rounded p-2 bg-light d-flex justify-content-between align-items-center">

                                <div class="small text-muted">
                                    📎 {{ basename($file->file_path) }}
                                </div>

                                <a href="{{ asset('storage/' . $file->file_path) }}"
                                   target="_blank"
                                   class="btn btn-sm btn-outline-primary">
                                    Open
                                </a>

                            </div>

                        @endforeach

                    </div>

                </div>

            @endif

        </div>

    </div>

    {{-- ================= TEACHER VIEW ================= --}}
    @if($assignment->classroom->teacher_id === auth()->id())

        <div class="card shadow-sm border-0 mb-4">

            <div class="card-body">

                <h5 class="fw-bold mb-3">Student Submissions</h5>

                @forelse($assignment->submissions as $submission)

                    <div class="border rounded p-3 mb-2 bg-light">

                        <div class="d-flex justify-content-between">

                            <strong>{{ $submission->user->name }}</strong>

                            <small class="text-muted">
                                {{ $submission->created_at->diffForHumans() }}
                            </small>

                        </div>

                        @if($submission->file)
                            <a href="{{ asset('storage/' . $submission->file) }}"
                               target="_blank"
                               class="btn btn-sm btn-outline-primary mt-2">
                                View File
                            </a>
                        @endif

                    </div>

                @empty

                    <p class="text-muted">No submissions yet</p>

                @endforelse

            </div>

        </div>

    @endif


    {{-- ================= STUDENT VIEW ================= --}}
    @if($assignment->classroom->teacher_id !== auth()->id())

        @php
            $mySubmission = $assignment->submissions
                ->where('user_id', auth()->id())
                ->first();
        @endphp

        <div class="card shadow-sm border-0">

            <div class="card-body">

                <h5 class="fw-bold mb-3">Your Work</h5>

                @if($mySubmission)

                    <div class="alert alert-success">
                         Submitted
                    </div>

                    @if($mySubmission->file)
                        <a href="{{ asset('storage/' . $mySubmission->file) }}"
                           class="btn btn-outline-primary btn-sm"
                           target="_blank">
                            View Submission
                        </a>
                    @endif

                @elseif($isExpired)

                    <div class="alert alert-danger">
                        ⛔ Missing (Deadline passed)
                    </div>

                @else

                    <form method="POST"
                          action="{{ route('submissions.store') }}"
                          enctype="multipart/form-data">

                        @csrf

                        <input type="hidden"
                               name="assignment_id"
                               value="{{ $assignment->id }}">

                        <input type="file"
                               name="file"
                               class="form-control mb-3"
                               required>

                        <textarea name="note"
                                  class="form-control mb-3"
                                  placeholder="Add a note (optional)"></textarea>

                        <button class="btn btn-success w-100">
                            Submit
                        </button>

                    </form>

                @endif

            </div>

        </div>

    @endif

</div>

@endsection


<script>
function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Delete Assignment?',
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