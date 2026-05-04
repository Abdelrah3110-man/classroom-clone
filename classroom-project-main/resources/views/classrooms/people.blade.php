@extends('layouts.classroom')

@section('classroom-content')

<div class="container">

    {{-- ================= TEACHER ================= --}}
    <h4 class="mb-3">Teacher</h4>

    <div class="card shadow-sm mb-4 border-0">
        <div class="card-body d-flex justify-content-between align-items-center">

            <div class="d-flex align-items-center">

                <div class="me-3">
                    <div class="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                         style="width:40px;height:40px;">
                        {{ $teacher->name[0] }}
                    </div>
                </div>

                <div>
                    <h6 class="mb-0">{{ $teacher->name }}</h6>
                    <small class="text-muted">{{ $teacher->email }}</small>
                </div>

            </div>

            {{-- (Optional) Teacher label --}}
            <span class="badge bg-primary">Owner</span>

        </div>
    </div>


    {{-- ================= STUDENTS ================= --}}
    <h4 class="mb-3">Students</h4>

    @forelse($classroom->students as $student)

        <div class="card shadow-sm mb-2 border-0">

            <div class="card-body d-flex justify-content-between align-items-center">

                <div class="d-flex align-items-center">

                    <div class="me-3">
                        <div class="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                             style="width:40px;height:40px;">
                            {{ $student->name[0] }}
                        </div>
                    </div>

                    <div>
                        <h6 class="mb-0">{{ $student->name }}</h6>
                        <small class="text-muted">{{ $student->email }}</small>
                    </div>

                </div>

                {{-- 🗑 DELETE BUTTON (ONLY TEACHER) --}}
                @if(auth()->id() === $classroom->teacher_id)

                    <form method="POST"
                          action="{{ route('classrooms.removeStudent', [$classroom->id, $student->id]) }}"
                         onsubmit="return confirmDelete(event)">

                        @csrf
                        @method('DELETE')

                        <button class="btn btn-sm btn-danger">
                            Remove
                        </button>

                    </form>

                @endif

            </div>

        </div>

    @empty

        <div class="text-center text-muted">
            No students joined yet
        </div>

    @endforelse

</div>

@endsection
<script>
function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Remove Student?',
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