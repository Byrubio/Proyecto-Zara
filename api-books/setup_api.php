<?php

$dir = __DIR__ . '/database/migrations/';
$files = scandir($dir);

$replacements = [
    'create_categories_table' => "\$table->id();\n            \$table->string('name');\n            \$table->timestamps();",
    'create_products_table' => "\$table->id();\n            \$table->string('nombre');\n            \$table->decimal('precio', 8, 2);\n            \$table->string('imagen')->nullable();\n            \$table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');\n            \$table->timestamps();",
    'create_orders_table' => "\$table->id();\n            \$table->foreignId('customer_id')->constrained()->onDelete('cascade');\n            \$table->decimal('total', 10, 2)->default(0);\n            \$table->string('status')->default('pending');\n            \$table->timestamps();",
    'create_order_items_table' => "\$table->id();\n            \$table->foreignId('order_id')->constrained()->onDelete('cascade');\n            \$table->foreignId('product_id')->constrained()->onDelete('cascade');\n            \$table->integer('quantity');\n            \$table->decimal('price', 10, 2);\n            \$table->timestamps();",
    'create_customers_table' => "\$table->id();\n            \$table->foreignId('user_id')->constrained()->onDelete('cascade');\n            \$table->string('phone')->nullable();\n            \$table->text('address')->nullable();\n            \$table->timestamps();",
    'create_reviews_table' => "\$table->id();\n            \$table->foreignId('product_id')->constrained()->onDelete('cascade');\n            \$table->foreignId('customer_id')->constrained()->onDelete('cascade');\n            \$table->integer('rating');\n            \$table->text('comment')->nullable();\n            \$table->timestamps();",
    'create_roles_table' => "\$table->id();\n            \$table->string('name');\n            \$table->timestamps();"
];

foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;
    foreach ($replacements as $key => $content) {
        if (strpos($file, $key) !== false) {
            $path = $dir . $file;
            $code = file_get_contents($path);
            $code = preg_replace('/\$table->id\(\);\s*\$table->timestamps\(\);/', $content, $code);
            file_put_contents($path, $code);
            echo "Updated \$file\n";
        }
    }
}

// Write ProductSeeder directly to read JSON
$seederPath = __DIR__ . '/database/seeders/ProductSeeder.php';
$seederCode = <<<EOF
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        \$json = file_get_contents(base_path('../data/banos.json'));
        \$data = json_decode(\$json, true);
        
        // category by default
        \$cat = Category::firstOrCreate(['name' => 'Baños']);

        foreach (\$data as \$item) {
            Product::updateOrCreate(
                ['id' => \$item['id']],
                [
                    'nombre' => \$item['nombre'],
                    'precio' => \$item['precio'],
                    'imagen' => \$item['imagen'],
                    'category_id' => \$cat->id
                ]
            );
        }
    }
}
EOF;
file_put_contents($seederPath, $seederCode);

$dbSeederPath = __DIR__ . '/database/seeders/DatabaseSeeder.php';
$dbSeederCode = <<<EOF
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        \$this->call([
            ProductSeeder::class
        ]);
    }
}
EOF;
file_put_contents($dbSeederPath, $dbSeederCode);

// Write basic Product Model
file_put_contents(__DIR__ . '/app/Models/Product.php', "<?php\n\nnamespace App\Models;\n\nuse Illuminate\Database\Eloquent\Factories\HasFactory;\nuse Illuminate\Database\Eloquent\Model;\n\nclass Product extends Model\n{\n    use HasFactory;\n    protected \$fillable = ['nombre', 'precio', 'imagen', 'category_id'];\n\n    public function category() {\n        return \$this->belongsTo(Category::class);\n    }\n}\n");

echo "Migrations and seeders generated!\n";
