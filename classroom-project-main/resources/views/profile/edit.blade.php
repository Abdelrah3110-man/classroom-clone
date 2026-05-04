@extends('layouts.app')

@section('content')

<div class="container py-4">

    <h2 class="fw-bold mb-4"> Profile Settings</h2>

    {{-- SUCCESS --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="row g-4">

        {{-- ================= PROFILE INFO ================= --}}
        <div class="col-md-6">

            <div class="card shadow-sm border-0 p-3">

                <h5 class="fw-bold mb-3"> Profile Info</h5>

                <form method="POST" action="{{ route('profile.update') }}">
                    @csrf
                    @method('PUT')

                    <input type="text"
                           name="name"
                           class="form-control mb-2"
                           value="{{ auth()->user()->name }}"
                           placeholder="Name">

                    <input type="email"
                           name="email"
                           class="form-control mb-2"
                           value="{{ auth()->user()->email }}"
                           placeholder="Email">

                    <button class="btn btn-primary w-100">
                        Save Changes
                    </button>

                </form>

            </div>

        </div>

        {{-- ================= PASSWORD ================= --}}
        <div class="col-md-6">

            <div class="card shadow-sm border-0 p-3">

                <h5 class="fw-bold mb-3"> Change Password</h5>

                <form method="POST" action="{{ route('profile.password') }}">
                    @csrf
                    @method('PUT')

                    <input type="password"
                           name="current_password"
                           class="form-control mb-2"
                           placeholder="Current Password">

                    <input type="password"
                           name="password"
                           class="form-control mb-2"
                           placeholder="New Password">

                    <input type="password"
                           name="password_confirmation"
                           class="form-control mb-2"
                           placeholder="Confirm Password">

                    <button class="btn btn-warning w-100">
                        Update Password
                    </button>

                </form>

            </div>

        </div>

        {{-- ================= DELETE ACCOUNT ================= --}}
        <div class="col-12">

            <div class="card shadow-sm border-0 p-3 border-danger">

                <h5 class="fw-bold text-danger mb-3"> Delete Account</h5>

                <p class="text-muted small">
                    This action is permanent. All your classes and data will be lost.
                </p>

                <form method="POST"
                      action="{{ route('profile.destroy') }}"
                      onsubmit="return confirmDelete(event)">

                    @csrf
                    @method('DELETE')

                    <button class="btn btn-danger">
                        Delete My Account
                    </button>

                </form>

            </div>

        </div>

    </div>

</div>

@endsection

<script>
function confirmDelete(e){
    e.preventDefault();

    Swal.fire({
        title: 'Delete Account?',
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