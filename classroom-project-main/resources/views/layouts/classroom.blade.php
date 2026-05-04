@extends('layouts.app')

@section('content')

<div class="container">

    {{-- CLASS HEADER --}}
    @if(isset($classroom))

        <div class="mb-3">

            <h2 class="fw-bold">{{ $classroom->name }}</h2>

            <p class="text-muted">
                {{ $classroom->section }} - {{ $classroom->subject }}
            </p>

            @if($classroom->teacher_id === auth()->id())
                <p>Class Code : {{ $classroom->code }}</p>
            @endif

        </div>

        {{-- TABS --}}
        <ul class="nav nav-pills justify-content-center mb-4">

            <li class="nav-item">
                <a class="nav-link"
                   href="{{ route('classrooms.show', $classroom->id) }}">
                    Stream
                </a>
            </li>

            {{-- TEACHER ONLY --}}
            @if($classroom->teacher_id === auth()->id())
                <li class="nav-item">
                    <a class="nav-link"
                       href="{{ route('classrooms.classwork', $classroom->id) }}">
                        Classwork
                    </a>
                </li>
            @endif

            {{-- STUDENT ONLY --}}
            @if($classroom->teacher_id !== auth()->id())
                <li class="nav-item">
                    <a class="nav-link"
                       href="{{ route('classrooms.assignments', $classroom->id) }}">
                        Classwork
                    </a>
                </li>
            @endif

            <li class="nav-item">
                <a class="nav-link"
                   href="{{ route('classrooms.people', $classroom->id) }}">
                    People
                </a>
            </li>

        </ul>

    @endif

    <hr>

    @yield('classroom-content')

</div>

@endsection