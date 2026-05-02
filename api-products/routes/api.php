<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

use App\Http\Controllers\OrderController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
});

Route::apiResource('products', ProductController::class);

use App\Http\Controllers\AdminController;
use App\Http\Middleware\IsAdmin;

// Admin Routes
Route::middleware(['auth:sanctum', IsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'indexUsers']);
    Route::post('/users', [AdminController::class, 'storeUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'destroyUser']);
    
    Route::get('/roles', [AdminController::class, 'indexRoles']);
    
    Route::get('/orders', [AdminController::class, 'indexOrders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::delete('/orders/{id}', [AdminController::class, 'destroyOrder']);
    
    Route::get('/customers', [AdminController::class, 'indexCustomers']);
    Route::put('/customers/{id}', [AdminController::class, 'updateCustomer']);
});
