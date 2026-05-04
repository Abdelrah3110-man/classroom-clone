@extends('layouts.app')

@section('content')

<div class="container mt-4">

    <div class="card shadow-sm border-0">

        <div class="card-body">

            <h3 class="fw-bold mb-4">Edit Classroom</h3>

            <form method="POST" action="{{ route('classrooms.update', $classroom->id) }}">
                @csrf
                @method('PUT')

                {{-- CLASS NAME --}}
                <div class="mb-3">
                    <label class="form-label">Class Name</label>
                    <input type="text"
                           name="name"
                           class="form-control"
                           value="{{ $classroom->name }}"
                           required>
                </div>

                {{-- SECTION --}}
                <div class="mb-3">
                    <label class="form-label">Section</label>
                    <input type="text"
                           name="section"
                           class="form-control"
                           value="{{ $classroom->section }}">
                </div>

                {{-- SUBJECT --}}
                <div class="mb-3">
                    <label class="form-label">Subject</label>
                    <input type="text"
                           name="subject"
                           class="form-control"
                           value="{{ $classroom->subject }}">
                </div>

                {{-- SUBMIT --}}
                <button class="btn btn-primary w-100">
                    Save Changes
                </button>

            </form>

        </div>

    </div>

</div>

@endsection