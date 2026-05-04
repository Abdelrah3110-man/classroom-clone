@extends('layouts.classroom')

@section('classroom-content')

@php
    use Carbon\Carbon;
@endphp

<div class="container">

    {{-- ================= HEADER ================= --}}
    <div class="card shadow-sm border-0 mb-4">

        <div class="card-body">

            <div class="d-flex justify-content-between align-items-start">

                {{-- LEFT --}}
                <div>

                    <h3 class="fw-bold mb-1">
                         {{ $material->title }}
                    </h3>

                    <p class="text-muted mb-2">
                        {{ $material->description ?? 'No description provided' }}
                    </p>

                    <span class="badge bg-success">
                         Material
                    </span>

                </div>

                {{-- TEACHER MENU --}}
                @if($material->classroom->teacher_id === auth()->id())

                    <div class="dropdown">

                        <button class="btn btn-light btn-sm dropdown-toggle"
                                data-bs-toggle="dropdown">
                            ⋮
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end shadow">

                            <li>
                                <a class="dropdown-item"
                                   href="{{ route('materials.edit', $material->id) }}">
                                     Edit
                                </a>
                            </li>

                            <li><hr class="dropdown-divider"></li>

                            <li>
                                <form method="POST"
                                      action="{{ route('materials.destroy', $material->id) }}"
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

                @endif

            </div>

            {{-- ================= ATTACHMENTS ================= --}}
            @php
                $attachments = $material->attachments ?? collect();
            @endphp

            @if($attachments->count())

                <div class="mt-3">

                    <label class="fw-semibold mb-2">Attachments</label>

                    <div class="d-flex flex-column gap-2">

                        @foreach($attachments as $file)

                            @php
                                $url = asset('storage/' . $file->file_path);
                            @endphp

                            <div class="border rounded p-2 bg-light d-flex justify-content-between align-items-center">

                                <div class="small text-muted text-truncate">
                                     {{ basename($file->file_path) }}
                                </div>

                                <div class="d-flex gap-2">

                                    <a href="{{ $url }}"
                                       target="_blank"
                                       class="btn btn-sm btn-outline-primary">
                                        Open
                                    </a>

                                </div>

                            </div>

                        @endforeach

                    </div>

                </div>

            @else

                <p class="text-muted mt-3 mb-0">No attachments available</p>

            @endif

        </div>

    </div>

</div>

{{-- ================= STYLE ================= --}}
<style>

.card {
    border-radius: 14px;
}

</style>



{{-- ================= DELETE CONFIRM ================= --}}
<script>
function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Delete Material?',
        text: "This Action Can't be Undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            e.target.submit();
        }
    });

    return false;
}
</script>



@endsection
