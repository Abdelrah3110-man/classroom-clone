@extends('layouts.app')

@section('content')

<h2>Join Classroom</h2>

<form method="POST" action="{{ route('classrooms.joinByCode') }}">
    @csrf

    <input type="text"
           name="code"
           class="form-control mb-3"
           placeholder="Enter class code">

    <button class="btn btn-success">Join</button>
</form>

@endsection