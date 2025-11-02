using MongoDB.Driver;
using GestionNotas.Models;
using System.Security.Cryptography;
using System.Text;

namespace GestionNotas.Services
{
    public class UsuarioService
    {
        private readonly IMongoCollection<Usuario> _usuarios;

    public UsuarioService(IMongoClient client)
    {
        var database = client.GetDatabase("gestionnotas");
        _usuarios = database.GetCollection<Usuario>("usuarios");

        Console.WriteLine("[INFO] Verificando índice de correo electrónico...");

        try
        {
            var indexKeysDefinition = Builders<Usuario>.IndexKeys.Ascending("email");
            var indexOptions = new CreateIndexOptions { Unique = true, Sparse = true };
            _usuarios.Indexes.CreateOne(new CreateIndexModel<Usuario>(indexKeysDefinition, indexOptions));
            Console.WriteLine("[INFO] Índice 'email_1' creado correctamente ✅");
        }
        catch (MongoCommandException ex)
        {
            Console.WriteLine($"[WARN] Índice ya existente o no compatible: {ex.Message}");
        }
    }

        public async Task CrearUsuarioAsync(Usuario usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario));

            // 🔹 Validar email
            if (string.IsNullOrWhiteSpace(usuario.Email))
                throw new Exception("El correo electrónico es obligatorio.");

            // 🔹 Normalizar email (evita mayúsculas o espacios)
            usuario.Email = usuario.Email.Trim().ToLowerInvariant();

            // 🔹 Hashear contraseña
            usuario.PasswordHash = HashPassword(usuario.PasswordHash);

            // 🔹 Insertar
            await _usuarios.InsertOneAsync(usuario);
        }


        public async Task<Usuario?> AutenticarUsuarioAsync(string email, string password)
        {
            var usuario = await _usuarios.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (usuario != null && usuario.PasswordHash == HashPassword(password))
            {
                return usuario;
            }
            return null;
        }

        public async Task<Usuario?> ObtenerUsuarioPorEmailAsync(string email)
        {
            return await _usuarios.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(hashedBytes);
        }
    }
}