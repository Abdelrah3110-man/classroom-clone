<!DOCTYPE html>
<html>
<head>
    <title>New Post</title>
</head>
<body style="font-family: Arial; padding: 20px;">

    <h2>📢 New Post in {{ $classroom->name }}</h2>

    <hr>

    <p>
        {{ $post->description }}
    </p>

    <hr>

    <small>
        You are receiving this because you are enrolled in this classroom.
    </small>

</body>
</html>