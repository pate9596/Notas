using GestionNotas.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ✅ Habilitar CORS para el frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



// 🔹 Conexión MongoDB
var mongoConnection = "mongodb://localhost:27017";
builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(mongoConnection));

// 🔹 Servicios
builder.Services.AddSingleton<NotaService>();
builder.Services.AddSingleton<UsuarioService>();
builder.Services.AddRazorPages();
builder.Services.AddSession();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddControllers(); // ✅ habilita controladores

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

// ✅ Activar CORS
app.UseCors("AllowReactApp");
app.MapControllers();


app.UseAuthorization();
app.MapStaticAssets();
app.MapRazorPages().WithStaticAssets();
app.UseSession();
app.Run();
