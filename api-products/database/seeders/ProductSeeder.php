<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $json = file_get_contents(base_path('../data/banos.json'));
        $data = json_decode($json, true);
        
        // category by default
        $cat = Category::firstOrCreate(['name' => 'Baños']);

        foreach ($data as $item) {
            Product::updateOrCreate(
                ['id' => $item['id']],
                [
                    'nombre' => $item['nombre'],
                    'precio' => $item['precio'],
                    'imagen' => $item['imagen'],
                    'category_id' => $cat->id
                ]
            );
        }
    }
}