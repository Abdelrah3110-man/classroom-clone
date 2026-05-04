@extends('layouts.classroom')

@section('classroom-content')

@php
    use Illuminate\Support\Str;
@endphp

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="mb-4">
        <h3 class="fw-bold">Edit Post</h3>
        <p class="text-muted mb-0">
            Update your post and attachments
        </p>
    </div>

    {{-- ================= MAIN CARD ================= --}}
    <div class="card shadow-sm border-0">

        <div class="card-body">

            {{-- ================= FORM ================= --}}
            <form method="POST"
                  action="{{ route('posts.update', $post->id) }}"
                  enctype="multipart/form-data">

                @csrf
                @method('PUT')

                {{-- DESCRIPTION --}}
                <div class="mb-3">
                    <label class="form-label fw-semibold">
                        Description
                    </label>

                    <textarea name="description"
                              class="form-control"
                              rows="4"
                              required>{{ old('description', $post->description) }}</textarea>

                    @error('description')
                        <small class="text-danger">
                            {{ $message }}
                        </small>
                    @enderror
                </div>

                {{-- ADD NEW FILES --}}
                <div class="mb-4">
                    <label class="form-label fw-semibold">
                        Add More Attachments
                    </label>

                    <input type="file"
                           name="files[]"
                           class="form-control"
                           multiple>

                    <small class="text-muted">
                        Upload multiple files (PDF, images, docs…)
                    </small>

                    @error('files.*')
                        <div class="text-danger small mt-1">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                {{-- BUTTONS --}}
                <div class="d-flex gap-2">

                    <a href="{{ url()->previous() }}"
                       class="btn btn-outline-secondary w-50">
                        Cancel
                    </a>

                    <button class="btn btn-primary w-50">
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    </div>


    {{-- ================= ATTACHMENTS ================= --}}
    <div class="card shadow-sm border-0 mt-4">

        <div class="card-body">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <h5 class="fw-bold mb-0">
                    Current Attachments
                </h5>

                <span class="badge bg-secondary">
                    {{ $post->attachments->count() }} files
                </span>

            </div>

            @forelse($post->attachments as $attachment)

                @php
                    $url = asset('storage/' . $attachment->file_path);

                    $isImage = Str::endsWith(
                        strtolower($attachment->file_path),
                        ['jpg','jpeg','png','gif','webp']
                    );
                @endphp

                <div class="border rounded p-3 mb-2 bg-light">

                    <div class="d-flex justify-content-between align-items-center">

                        {{-- LEFT --}}
                        <div class="d-flex align-items-center gap-3">

                            {{-- IMAGE PREVIEW --}}
                            @if($isImage)

                                <img src="{{ $url }}"
                                     class="attachment-preview">

                            @else

                                <div class="file-icon">
                                    📎
                                </div>

                            @endif

                            {{-- FILE NAME --}}
                            <div>

                                <div class="fw-semibold small">
                                    {{ basename($attachment->file_path) }}
                                </div>

                                <div class="text-muted small">
                                    Attachment File
                                </div>

                            </div>

                        </div>

                        {{-- ACTIONS --}}
                        <div class="d-flex gap-2 align-items-center">

                            {{-- OPEN --}}
                            <a href="{{ $url }}"
                               target="_blank"
                               class="btn btn-sm btn-outline-primary">
                                Open
                            </a>

                            {{-- DELETE --}}
                            <form method="POST"
                                  action="{{ route('attachments.destroy', $attachment->id) }}"
                                  onsubmit="return confirmDeleteAttachment(event)">

                                @csrf
                                @method('DELETE')

                                <button type="submit"
                                        class="btn btn-sm btn-outline-danger">
                                    Delete
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            @empty

                <div class="text-muted small">
                    No attachments yet
                </div>

            @endforelse

        </div>

    </div>

</div>


{{-- ================= DELETE SCRIPT ================= --}}
<script>

function confirmDeleteAttachment(e){

    e.preventDefault();

    Swal.fire({
        title: 'Delete Attachment?',
        text: "This Action can't be Undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {

        if(result.isConfirmed){
            e.target.submit();
        }

    });

    return false;
}

</script>


{{-- ================= STYLE ================= --}}
<style>

.card{
    border-radius: 14px;
}

.form-control{
    border-radius: 10px;
}

.btn{
    border-radius: 8px;
}

.attachment-preview{
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.file-icon{
    width: 60px;
    height: 60px;
    background: white;
    border-radius: 8px;
    border: 1px solid #ddd;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 24px;
}

</style>

@endsection