<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        return Book::with('category')->get();
    }

    public function show($id)
    {
        $Book = Book::with('category')->find($id);
        if (!$Book) {
            return response()->json(['message' => 'Book not found'], 404);
        }
        return $Book;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'imagen' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $Book = Book::create($validated);
        return response()->json($Book, 201);
    }
}
