<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('category')->get();
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return $product;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'imagen' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }
}
