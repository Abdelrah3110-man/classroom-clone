@extends('layouts.classroom')

@section('classroom-content')

@php use Carbon\Carbon; @endphp

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">
        <h2 class="fw-bold"> Classwork</h2>
        <p class="text-muted">{{ $classroom->name }}</p>
    </div>

    {{-- ================= SINGLE CLEAN DROPDOWN ================= --}}
    <div class="mb-4">

        <div class="dropdown">

            <button class="btn btn-dark dropdown-toggle w-100"
                    data-bs-toggle="dropdown">
                  Classwork
            </button>

            <ul class="dropdown-menu w-100 shadow">

                {{-- ALL --}}
                <li>
                    <button class="dropdown-item" onclick="filterItems('all')">
                         All
                    </button>
                </li>

                <li><hr class="dropdown-divider"></li>

                {{-- TYPE FILTERS --}}

                <li>
                    <button class="dropdown-item text-success" onclick="filterItems('submitted')">
                         Submitted 
                    </button>
                </li>

                <li>
                    <button class="dropdown-item text-warning" onclick="filterItems('missing')">
                         Missing 
                    </button>
                </li>

                <li>
                    <button class="dropdown-item text-danger" onclick="filterItems('late')">
                         Late 
                    </button>
                </li>

                <li><hr class="dropdown-divider"></li>

                <li>
                    <button class="dropdown-item" onclick="filterItems('material')">
                         Materials
                    </button>
                </li>

            </ul>

        </div>

    </div>


    {{-- ================= MERGE DATA ================= --}}
    @php
        $items = collect();

        foreach ($classroom->assignments as $a) {

            $due = $a->due_date ? Carbon::parse($a->due_date) : null;

            $mySubmission = $a->submissions
                ->where('user_id', auth()->id())
                ->first();

            $isSubmitted = (bool) $mySubmission;
            $isLate = !$isSubmitted && $due && now()->gt($due);

            $status = $isSubmitted ? 'submitted' : ($isLate ? 'late' : 'missing');

            $items->push((object)[
                'type' => 'assignment',
                'status' => $status,
                'data' => $a,
                'created_at' => $a->created_at
            ]);
        }

        foreach ($classroom->materials ?? [] as $m) {
            $items->push((object)[
                'type' => 'material',
                'status' => 'material',
                'data' => $m,
                'created_at' => $m->created_at
            ]);
        }

        $items = $items->sortByDesc('created_at');
    @endphp


    {{-- ================= ITEMS ================= --}}
    @forelse($items as $item)

        {{-- ASSIGNMENT --}}
        @if($item->type === 'assignment')

            @php $a = $item->data; @endphp

            <div class="item-card card border-0 shadow-sm mb-3"
                 data-type="{{ $item->status }}">

                <a href="{{ route('assignments.show', $a->id) }}"
                   class="text-decoration-none text-dark">

                    <div class="card-body d-flex justify-content-between align-items-center">

                        <div>

                            <div class="text-primary small fw-bold mb-1">
                                 Assignment
                            </div>

                            <h5 class="fw-bold mb-1">{{ $a->title }}</h5>

                            <p class="text-muted mb-0">{{ $a->description }}</p>

                        </div>

                        <div class="text-muted fs-4">›</div>

                    </div>

                </a>

            </div>

        {{-- MATERIAL --}}
        @elseif($item->type === 'material')

            @php $m = $item->data; @endphp

            <div class="item-card card border-0 shadow-sm mb-3"
                 data-type="material">

                <a href="{{ route('materials.show', $m->id) }}"
                   class="text-decoration-none text-dark">

                    <div class="card-body d-flex justify-content-between align-items-center">

                        <div>

                            <div class="text-success small fw-bold mb-1">
                                Material
                            </div>

                            <h5 class="fw-bold mb-1">{{ $m->title }}</h5>

                            <p class="text-muted mb-0">{{ $m->description }}</p>

                        </div>

                        <div class="text-muted fs-4">›</div>

                    </div>

                </a>

            </div>

        @endif

    @empty

        <div class="text-center text-muted py-5">
            No classwork yet
        </div>

    @endforelse

</div>


{{-- ================= FILTER SCRIPT ================= --}}
<script>
function filterItems(type) {

    document.querySelectorAll('.item-card').forEach(item => {

        const t = item.getAttribute('data-type');

        item.style.display =
            (type === 'all' || t === type) ? 'block' : 'none';
    });
}
</script>


{{-- ================= STYLE ================= --}}
<style>

.dropdown-menu {
    border-radius: 12px;
    padding: 8px;
}

.dropdown-item {
    border-radius: 8px;
    padding: 10px 12px;
}

.dropdown-item:hover {
    background: #f3f4f6;
}

.item-card {
    border-radius: 14px;
    transition: 0.2s ease;
}

.item-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

</style>

@endsection