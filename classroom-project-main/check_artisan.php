<?php
try {
    $output = shell_exec('php artisan --version 2>&1');
    $output2 = shell_exec('php artisan env 2>&1');
    file_put_contents('artisan_status.txt', "Version:\n" . $output . "\n\nEnv:\n" . $output2);
} catch (Exception $e) {
    file_put_contents('artisan_status.txt', "Error: " . $e->getMessage());
}
