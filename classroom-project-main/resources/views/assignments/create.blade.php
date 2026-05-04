@extends('layouts.classroom')

@section('classroom-content')

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">

        <h3 class="fw-bold">
            📝 Create Assignment
        </h3>

        <p class="text-muted mb-0">
            Assign work to students with instructions, due date, and attachments
        </p>

    </div>

    {{-- ================= MAIN CARD ================= --}}
    <div class="card shadow-sm border-0">

        <div class="card-body p-4">

            <form method="POST"
                  action="{{ route('assignments.store') }}"
                  enctype="multipart/form-data">

                @csrf

                {{-- CLASSROOM --}}
                <input type="hidden"
                       name="classroom_id"
                       value="{{ $classroom->id }}">

                {{-- ================= SUBJECT ================= --}}
                @if($classroom->subjects->count())

                    <div class="mb-3">

                        <label class="form-label fw-semibold">
                            Subject
                        </label>

                        <select name="subject_id"
                                class="form-select">

                            <option value="">
                                No Subject
                            </option>

                            @foreach($classroom->subjects as $subject)

                                <option value="{{ $subject->id }}"
                                    {{ old('subject_id') == $subject->id ? 'selected' : '' }}>

                                    {{ $subject->name }}

                                </option>

                            @endforeach

                        </select>

                        @error('subject_id')
                            <small class="text-danger">
                                {{ $message }}
                            </small>
                        @enderror

                    </div>

                @endif

                {{-- TITLE --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Title
                    </label>

                    <input type="text"
                           name="title"
                           class="form-control"
                           placeholder="Assignment title"
                           value="{{ old('title') }}"
                           required>

                    @error('title')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror

                </div>

                {{-- INSTRUCTIONS --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Instructions
                    </label>

                    <textarea name="description"
                              class="form-control"
                              rows="4"
                              placeholder="Write instructions for students">{{ old('description') }}</textarea>

                    @error('description')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror

                </div>

                {{-- DUE DATE --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Due Date
                    </label>

                    <input type="date"
                           name="due_date"
                           class="form-control"
                           value="{{ old('due_date') }}">

                    @error('due_date')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror

                </div>

                {{-- ATTACHMENTS --}}
                <div class="mb-4">

                    <label class="form-label fw-semibold">
                        Attachments (optional)
                    </label>

                    <input type="file"
                           name="files[]"
                           class="form-control"
                           multiple>

                    <small class="text-muted">
                        Upload PDFs, images, documents, or resources
                    </small>

                    @error('files.*')
                        <div class="text-danger small mt-1">
                            {{ $message }}
                        </div>
                    @enderror

                </div>

                {{-- BUTTONS --}}
                <div class="d-flex gap-2">

                    {{-- CANCEL --}}
                    <a href="{{ route('classrooms.classwork', $classroom->id) }}"
                       class="btn btn-outline-secondary w-50">

                        Cancel

                    </a>

                    {{-- SUBMIT --}}
                    <button class="btn btn-primary w-50">

                        Create Assignment

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>

{{-- ================= STYLE ================= --}}
<style>

.card{
    border-radius:16px;
}

.form-control,
.form-select{
    border-radius:10px;
    padding:10px 12px;
}

.btn{
    border-radius:10px;
    padding:10px;
}

</style>

@endsection