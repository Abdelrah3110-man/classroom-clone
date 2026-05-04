@extends('layouts.classroom')

@section('classroom-content')

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">

        <h3 class="fw-bold">
            📄 Create Material
        </h3>

        <p class="text-muted mb-0">
            Share files, notes, links, and learning resources with students
        </p>

    </div>


    {{-- ================= MAIN CARD ================= --}}
    <div class="card shadow-sm border-0">

        <div class="card-body p-4">

            <form method="POST"
                  action="{{ route('materials.store') }}"
                  enctype="multipart/form-data">

                @csrf

                {{-- CLASSROOM --}}
                <input type="hidden"
                       name="classroom_id"
                       value="{{ $classroom->id }}">


                {{-- SUBJECT (SAFE CHECK) --}}
                @if(isset($classroom->subjects) && $classroom->subjects->count())

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
                           placeholder="Material title"
                           value="{{ old('title') }}"
                           required>

                    @error('title')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror

                </div>


                {{-- DESCRIPTION --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Description
                    </label>

                    <textarea name="description"
                              class="form-control"
                              rows="4"
                              placeholder="Write instructions or notes for students">{{ old('description') }}</textarea>

                    @error('description')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror

                </div>


                {{-- LINK --}}
                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Link (optional)
                    </label>

                    <input type="url"
                           name="link"
                           class="form-control"
                           placeholder="https://example.com"
                           value="{{ old('link') }}">

                    <small class="text-muted">
                        YouTube, Google Docs, websites, or references
                    </small>

                    @error('link')
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
                        Upload PDFs, images, PowerPoints, ZIPs, or study files
                    </small>

                    @error('files.*')
                        <div class="text-danger small mt-1">
                            {{ $message }}
                        </div>
                    @enderror

                </div>


                {{-- ACTIONS --}}
                <div class="d-flex gap-2">

                    <a href="{{ route('classrooms.classwork', $classroom->id) }}"
                       class="btn btn-outline-secondary w-50">

                        Cancel

                    </a>

                    <button class="btn btn-primary w-50">

                        Create Material

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

textarea.form-control{
    resize:none;
}

</style>

@endsection