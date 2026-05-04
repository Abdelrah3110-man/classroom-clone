@extends('layouts.app')

@section('content')

<div class="container py-4">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">
        <h2 class="fw-bold">Dashboard</h2>
    </div>

    {{-- ================= GLOBAL STATS ================= --}}
    <div class="row g-3 mb-4">

        <div class="col-md-3">
            <div class="card stat-box text-center p-3">
                <h3 class="text-primary">{{ $classes->count() }}</h3>
                <small>Total Classes</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box text-center p-3">
                <h3 class="text-success">
                    {{ $classes->sum(fn($c) => $c->assignments->count()) }}
                </h3>
                <small>Assignments</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box text-center p-3">
                <h3 class="text-warning">
                    {{ $classes->sum(fn($c) => $c->assignments->sum(fn($a) => $a->submissions->count())) }}
                </h3>
                <small>Submissions</small>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card stat-box text-center p-3">
                <h3 class="text-danger">
                    {{ $classes->sum(fn($c) => $c->students->count() ?? 0) }}
                </h3>
                <small>Students</small>
            </div>
        </div>

    </div>

    {{-- ================= CLASS SELECT ================= --}}
    <div class="card shadow-sm border-0 mb-4">
        <div class="card-body">

            <label class="fw-bold mb-2">Select Class</label>

            <select id="classSelect" class="form-select">
                <option value="">Overview</option>
                @foreach($classes as $class)
                    <option value="class-{{ $class->id }}">
                        {{ $class->name }}
                    </option>
                @endforeach
            </select>

        </div>
    </div>

    {{-- ================= OVERVIEW (DEFAULT) ================= --}}
    <div id="overview">


        {{-- CLASS GRID --}}
        <div class="row g-3">

            @foreach($classes as $class)

                <div class="col-md-4">
                    <div class="card class-card p-3 h-100">

                        <h5 class="fw-bold">{{ $class->name }}</h5>

                        <small class="text-muted">
                            {{ $class->section }} • {{ $class->subject }}
                        </small>

                        <hr>

                        <div class="d-flex justify-content-between">
                            <span> {{ $class->students->count() }} Students</span>
                            <span> {{ $class->assignments->count() }} Assignments</span>
                            <span> {{ $class->assignments->sum(fn($a) => $a->submissions->count()) }} Submissions</span>
                            
                        </div>

                        <a href="{{ route('classrooms.show', $class->id) }}"
                           class="btn btn-primary btn-sm mt-3">
                            Open Class
                        </a>

                    </div>
                </div>

            @endforeach

        </div>

    </div>

    {{-- ================= SINGLE CLASS VIEW ================= --}}
    @foreach($classes as $class)

        <div id="class-{{ $class->id }}" class="class-box d-none">

            <div class="card shadow-sm p-3">

                <h4 class="fw-bold">{{ $class->name }}</h4>

                <p class="text-muted">
                    {{ $class->section }} • {{ $class->subject }}
                </p>

                <div class="row text-center">
                    
                    <div class="col">
                        <div class="border rounded p-2">
                            <h5>{{ $class->students->count() ?? 0 }}</h5>
                            <small>Students</small>
                        </div>
                    </div>

                    <div class="col">
                        <div class="border rounded p-2">
                            <h5>{{ $class->assignments->count() }}</h5>
                            <small>Assignments</small>
                        </div>
                    </div>

                    <div class="col">
                        <div class="border rounded p-2">
                            <h5>
                                {{ $class->assignments->sum(fn($a) => $a->submissions->count()) }}
                            </h5>
                            <small>Submissions</small>
                        </div>
                    </div>

                    

                </div>

                <hr>

                <h6>Recent Assignments</h6>

                @forelse($class->assignments->take(5) as $assignment)

                    <div class="border p-2 rounded mb-2">
                        📚 {{ $assignment->title }}
                        <br>
                        <small class="text-muted">
                            {{ $assignment->created_at->diffForHumans() }}
                        </small>
                    </div>

                @empty
                    <p class="text-muted">No assignments</p>
                @endforelse

            </div>

        </div>

    @endforeach

</div>

{{-- ================= JS ================= --}}
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


<script>


// CLASS SWITCHER
document.getElementById('classSelect').addEventListener('change', function () {

    document.getElementById('overview').classList.add('d-none');

    document.querySelectorAll('.class-box').forEach(el => el.classList.add('d-none'));

    if (this.value === '') {
        document.getElementById('overview').classList.remove('d-none');
    } else {
        document.getElementById(this.value).classList.remove('d-none');
    }

});
</script>

{{-- ================= STYLE ================= --}}
<style>

.stat-box {
    border-radius: 12px;
    transition: 0.2s;
}

.stat-box:hover {
    transform: translateY(-3px);
}

.class-card {
    border-radius: 14px;
    transition: 0.2s;
}

.class-card:hover {
    transform: translateY(-4px);
}

</style>

@endsection