@extends('layouts.app')

@section('content')

<div class="container py-4">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">
        <h2 class="fw-bold">🚀 Level 2 Teacher Dashboard</h2>
        <p class="text-muted">Analytics • Deadlines • Activity Intelligence</p>
    </div>

    {{-- ================= TOP METRICS ================= --}}
    <div class="row g-3 mb-4">

        <div class="col-md-3">
            <div class="card stat-box">
                <h3>{{ $classes->count() }}</h3>
                <small>Classes</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box">
                <h3>{{ $classes->sum(fn($c) => $c->assignments->count()) }}</h3>
                <small>Assignments</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box">
                <h3>{{ $classes->sum(fn($c) => $c->students->count()) }}</h3>
                <small>Students</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box">
                <h3>
                    {{ $classes->sum(fn($c) => $c->assignments->sum(fn($a) => $a->submissions->count())) }}
                </h3>
                <small>Submissions</small>
            </div>
        </div>

    </div>

    {{-- ================= MAIN GRID ================= --}}
    <div class="row g-4">

        {{-- LEFT: UPCOMING DEADLINES --}}
        <div class="col-md-4">

            <div class="card p-3 shadow-sm">

                <h5 class="fw-bold mb-3">📅 Upcoming Deadlines</h5>

                @forelse($upcomingAssignments as $assignment)

                    <div class="deadline-item">

                        <div class="fw-semibold">
                            {{ $assignment->title }}
                        </div>

                        <small class="text-muted">
                            Due: {{ $assignment->due_date }}
                        </small>

                    </div>

                @empty
                    <p class="text-muted">No upcoming deadlines</p>
                @endforelse

            </div>

            {{-- ================= QUICK INSIGHTS ================= --}}
            <div class="card p-3 shadow-sm mt-3">

                <h5 class="fw-bold mb-3">🧠 Insights</h5>

                <p class="small">
                    📌 Most active class:
                    <strong>
                        {{
                            $classes->sortByDesc(fn($c) => $c->assignments->count())->first()->name ?? 'N/A'
                        }}
                    </strong>
                </p>

                <p class="small">
                    📌 Total engagement:
                    <strong>
                        {{ $classes->sum(fn($c) => $c->assignments->sum(fn($a) => $a->submissions->count())) }}
                    </strong>
                </p>

            </div>

        </div>

        {{-- RIGHT: CLASSES --}}
        <div class="col-md-8">

            @foreach($classes as $class)

                <div class="card class-card mb-3 p-3">

                    <div class="d-flex justify-content-between">

                        <div>
                            <h5 class="fw-bold">{{ $class->name }}</h5>
                            <small class="text-muted">
                                {{ $class->section }} • {{ $class->subject }}
                            </small>
                        </div>

                        <div class="text-end">
                            <div class="fw-bold text-primary">
                                {{ $class->assignments->count() }}
                            </div>
                            <small>Assignments</small>
                        </div>

                    </div>

                    <hr>

                    {{-- MINI STATS --}}
                    <div class="d-flex justify-content-between">

                        <span>📥 {{ $class->assignments->sum(fn($a) => $a->submissions->count()) }} submissions</span>

                        <span>👨‍🎓 {{ $class->students->count() }} students</span>

                    </div>

                    <div class="mt-3 d-flex gap-2">

                        <a href="{{ route('classrooms.show', $class->id) }}"
                           class="btn btn-primary btn-sm w-50">
                            Open
                        </a>

                        <a href="{{ route('classrooms.classwork', $class->id) }}"
                           class="btn btn-outline-secondary btn-sm w-50">
                            Manage
                        </a>

                    </div>

                </div>

            @endforeach

        </div>

    </div>

</div>

{{-- ================= STYLE ================= --}}
<style>

.stat-box{
    padding:15px;
    text-align:center;
    border-radius:12px;
    transition:0.2s;
}

.stat-box:hover{
    transform:translateY(-3px);
}

.class-card{
    border-radius:14px;
}

.deadline-item{
    padding:8px;
    border-bottom:1px solid #eee;
}

.deadline-item:last-child{
    border-bottom:none;
}

</style>

@endsection