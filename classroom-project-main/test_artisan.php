<?php
$output = shell_exec('php artisan serve --host=127.0.0.1 --port=8080 2>&1 & echo $!');
file_put_contents('artisan_test.txt', "Output of artisan serve:\n" . $output);
echo "Done";
