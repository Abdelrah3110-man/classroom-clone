@extends('layouts.app')

@section('content')

<h2>Create Classroom</h2>

<form method="POST" action="{{ route('classrooms.store') }}">
    @csrf

    <input type="text" name="name" class="form-control mb-2" placeholder="Class Name">

    <input type="text" name="section" class="form-control mb-2" placeholder="Section">

    <input type="text" name="subject" class="form-control mb-2" placeholder="Subject">

    <button class="btn btn-primary">Create</button>
</form>

@endsection