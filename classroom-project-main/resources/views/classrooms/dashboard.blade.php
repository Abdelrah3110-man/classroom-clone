@extends('layouts.classroom')

@section('content')

<div class="container">

    {{-- HEADER --}}
    <div class="mb-4">

        <h2 class="fw-bold">
            Teacher Dashboard - {{ $classroom->name }}
        </h2>

        <p class="text-muted">
            Manage assignments and submissions
        </p>

    </div>

    {{-- STATS --}}
    <div class="row mb-4">

        <div class="col-md-4">
            <div class="card shadow-sm border-0">
                <div class="card-body text-center">
                    <h4>{{ $classroom->assignments->count() }}</h4>
                    <small>Assignments</small>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card shadow-sm border-0">
                <div class="card-body text-center">
                    <h4>{{ $classroom->students->count() ?? 0 }}</h4>
                    <small>Students</small>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card shadow-sm border-0">
                <div class="card-body text-center">
                    <h4>
                        {{ $classroom->assignments->sum(fn($a) => $a->submissions->count()) }}
                    </h4>
                    <small>Submissions</small>
                </div>
            </div>
        </div>

    </div>

    {{-- ASSIGNMENTS + SUBMISSIONS --}}
    @foreach($classroom->assignments as $assignment)

        <div class="card mb-4 shadow-sm border-0">

            <div class="card-body">

                <h5 class="fw-bold">
                    {{ $assignment->title }}
                </h5>

                <p class="text-muted">
                    {{ $assignment->description }}
                </p>

                <hr>

                <h6>Submissions</h6>

                @forelse($assignment->submissions as $submission)

                    <div class="border rounded p-2 mb-2 bg-light">

                        <div class="d-flex justify-content-between">

                            <strong>
                                {{ $submission->user->name }}
                            </strong>

                            <small class="text-muted">
                                {{ $submission->created_at->diffForHumans() }}
                            </small>

                        </div>

                        <div class="mt-2">

                            <a href="{{ Storage::url($submission->file) }}"
                               target="_blank"
                               class="btn btn-sm btn-primary">
                                View File
                            </a>

                        </div>

                    </div>

                @empty

                    <p class="text-muted">No submissions yet</p>

                @endforelse

            </div>

        </div>

    @endforeach

</div>

@endsection