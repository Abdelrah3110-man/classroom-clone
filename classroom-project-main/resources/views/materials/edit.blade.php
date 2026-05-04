@extends('layouts.classroom')

@section('classroom-content')

@php
    use Illuminate\Support\Str;
@endphp

<div class="container py-4">

    {{-- ================= HEADER ================= --}}
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div class="d-flex align-items-center gap-3">

            <div class="page-icon">
                📄
            </div>

            <div>
                <h2 class="fw-bold mb-1">Edit Material</h2>

                <p class="text-muted mb-0">
                    Update material details, subject, and attachments
                </p>
            </div>

        </div>

        <a href="{{ route('materials.show', $material->id) }}"
           class="btn btn-outline-dark rounded-pill px-4">
            ← Back
        </a>

    </div>


    <div class="row g-4">

        {{-- ================= LEFT SIDE ================= --}}
        <div class="col-lg-7">

            <div class="card border-0 shadow-sm main-card">

                <div class="card-body p-4">

                    <form method="POST"
                          action="{{ route('materials.update', $material->id) }}"
                          enctype="multipart/form-data"
                          id="materialForm">

                        @csrf
                        @method('PUT')


                        {{-- ================= TITLE ================= --}}
                        <div class="mb-4">

                            <label class="form-label fw-semibold">
                                 Title
                            </label>

                            <input type="text"
                                   name="title"
                                   class="form-control custom-input"
                                   value="{{ old('title', $material->title) }}"
                                   placeholder="Enter material title"
                                   required>

                            @error('title')
                                <div class="text-danger small mt-1">
                                    {{ $message }}
                                </div>
                            @enderror

                        </div>


                        {{-- ================= SUBJECT ================= --}}
                        <div class="mb-4">

                            <label class="form-label fw-semibold">
                                 Subject
                            </label>

                            <select name="subject_id"
                                    class="form-select custom-input">

                                <option value="">
                                     No Topic
                                </option>

                                @foreach($material->classroom->subjects as $subject)

                                    <option value="{{ $subject->id }}"
                                        {{ $material->subject_id == $subject->id ? 'selected' : '' }}>

                                         {{ $subject->name }}

                                    </option>

                                @endforeach

                            </select>

                            <small class="text-muted">
                                Organize this material under a classroom subject
                            </small>

                        </div>


                        {{-- ================= DESCRIPTION ================= --}}
                        <div class="mb-4">

                            <label class="form-label fw-semibold">
                                 Description
                            </label>

                            <textarea name="description"
                                      rows="5"
                                      class="form-control custom-input"
                                      placeholder="Write material description...">{{ old('description', $material->description) }}</textarea>

                            @if(!$material->description)
                                <div class="text-muted small mt-2">
                                    No description added yet
                                </div>
                            @endif

                            @error('description')
                                <div class="text-danger small mt-1">
                                    {{ $message }}
                                </div>
                            @enderror

                        </div>


                        {{-- ================= DRAG & DROP ================= --}}
                        <div class="mb-4">

                            <label class="form-label fw-semibold">
                                 Add Attachments
                            </label>

                            <div class="upload-box" id="uploadBox">

                                <div class="upload-icon mb-2">
                                    ⬆
                                </div>

                                <div class="fw-semibold mb-1">
                                    Drag & Drop files here
                                </div>

                                <div class="text-muted small mb-3">
                                    or click to browse files
                                </div>

                                <input type="file"
                                       name="files[]"
                                       class="form-control d-none"
                                       id="fileInput"
                                       multiple>

                                <button type="button"
                                        class="btn btn-light border btn-sm"
                                        onclick="document.getElementById('fileInput').click()">

                                    Choose Files

                                </button>

                            </div>

                            <div id="fileList" class="mt-3"></div>

                            @error('files.*')
                                <div class="text-danger small mt-2">
                                    {{ $message }}
                                </div>
                            @enderror

                        </div>


                        {{-- ================= BUTTONS ================= --}}
                        <div class="d-flex flex-column flex-md-row gap-3">

                            <a href="{{ route('materials.show', $material->id) }}"
                               class="btn btn-light border w-100 py-2">

                                Cancel

                            </a>

                            <button class="btn btn-primary w-100 py-2"
                                    id="saveBtn">

                                 Save Changes

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>


        {{-- ================= RIGHT SIDE ================= --}}
        <div class="col-lg-5">

            <div class="card border-0 shadow-sm attachment-panel sticky-top">

                <div class="card-body p-4">

                    {{-- HEADER --}}
                    <div class="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h5 class="fw-bold mb-0">
                                 Attachments
                            </h5>

                            <small class="text-muted">
                                Current uploaded files
                            </small>

                        </div>

                        <span class="badge rounded-pill bg-primary px-3 py-2">
                            {{ $material->attachments->count() }}
                        </span>

                    </div>


                    {{-- FILES --}}
                    @forelse($material->attachments as $file)

                        @php
                            $url = asset('storage/' . $file->file_path);

                            $isImage = Str::endsWith(
                                strtolower($file->file_path),
                                ['jpg','jpeg','png','gif','webp']
                            );
                        @endphp


                        <div class="attachment-card mb-3">

                            <div class="d-flex align-items-center gap-3">

                                {{-- PREVIEW --}}
                                @if($isImage)

                                    <img src="{{ $url }}"
                                         class="attachment-image">

                                @else

                                    <div class="file-icon">
                                        📄
                                    </div>

                                @endif


                                {{-- FILE INFO --}}
                                <a href="{{ $url }}"
                                   target="_blank"
                                   class="flex-grow-1 overflow-hidden text-decoration-none text-dark">

                                    <div class="fw-semibold text-truncate small file-name">
                                        {{ basename($file->file_path) }}
                                    </div>

                                    <div class="text-muted small">
                                        Material Attachment
                                    </div>

                                </a>


                                {{-- ACTIONS --}}
                                <div class="dropdown">

                                    <button class="btn btn-sm btn-light rounded-circle action-btn"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            data-bs-auto-close="outside">

                                        ⋮

                                    </button>

                                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">

                                        <li>

                                            <form method="POST"
                                                  action="{{ route('material.attachments.destroy', $file->id) }}"
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

                            </div>

                        </div>

                    @empty

                        <div class="empty-box text-center py-5">

                            <div class="fw-semibold">
                                No attachments yet
                            </div>

                            <small class="text-muted">
                                Upload files to appear here
                            </small>

                        </div>

                    @endforelse

                </div>

            </div>

        </div>

    </div>

</div>


{{-- ================= SCRIPT ================= --}}
<script>

function confirmDelete(e){

    e.preventDefault();

    Swal.fire({
        title: 'Delete attachment?',
        text: "This action can't be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {

        if(result.isConfirmed){
            e.target.submit();
        }

    });

    return false;
}


// ================= SAVE BUTTON =================
document.getElementById('materialForm')
.addEventListener('submit', function(){

    const btn = document.getElementById('saveBtn');

    btn.disabled = true;
    btn.innerHTML = 'Saving...';

});


// ================= DRAG DROP =================
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

uploadBox.addEventListener('dragover', (e) => {

    e.preventDefault();
    uploadBox.classList.add('dragging');

});

uploadBox.addEventListener('dragleave', () => {

    uploadBox.classList.remove('dragging');

});

uploadBox.addEventListener('drop', (e) => {

    e.preventDefault();

    uploadBox.classList.remove('dragging');

    fileInput.files = e.dataTransfer.files;

    renderFiles();

});

fileInput.addEventListener('change', renderFiles);

function renderFiles(){

    fileList.innerHTML = '';

    Array.from(fileInput.files).forEach(file => {

        fileList.innerHTML += `
            <div class="selected-file">
                 ${file.name}
            </div>
        `;

    });

}

</script>


{{-- ================= STYLE ================= --}}
<style>

.main-card,
.attachment-panel{
    border-radius:20px;
}

.page-icon{
    width:60px;
    height:60px;
    border-radius:18px;
    background:#eef2ff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:28px;
}

.custom-input{
    border-radius:12px;
    padding:12px 14px;
    border:1px solid #ddd;
    transition:.2s;
}

.custom-input:focus{
    border-color:#4f46e5;
    box-shadow:0 0 0 .15rem rgba(79,70,229,.15);
}

.btn{
    border-radius:12px;
    font-weight:500;
}

.attachment-panel{
    top:20px;
    max-height:calc(100vh - 40px);
    overflow:auto;
    background:#fcfcfd;
}


.attachment-image{
    width:58px;
    height:58px;
    object-fit:cover;
    border-radius:12px;
    border:1px solid #ddd;
}

.file-icon{
    width:58px;
    height:58px;
    border-radius:12px;
    border:1px solid #ddd;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:22px;
    background:#f8f9fa;
}

.file-name{
    max-width:180px;
}

.action-btn{
    width:35px;
    height:35px;
    padding:0;
    border:none;
    transition:.2s;
}

.action-btn:hover{
    background:#eef2ff;
    color:#4f46e5;
}

.empty-box{
    border:2px dashed #ddd;
    border-radius:16px;
    background:#fafafa;
}

.upload-box{
    border:2px dashed #d1d5db;
    border-radius:18px;
    padding:35px 20px;
    text-align:center;
    background:#fafafa;
    transition:.2s;
}

.upload-box.dragging{
    border-color:#4f46e5;
    background:#eef2ff;
}

.upload-icon{
    font-size:32px;
}

.selected-file{
    background:#f3f4f6;
    padding:10px 14px;
    border-radius:10px;
    margin-bottom:8px;
    font-size:14px;
}

</style>

@endsection