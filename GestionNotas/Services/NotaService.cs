using MongoDB.Driver;
using GestionNotas.Models;

namespace GestionNotas.Services
{
    public class NotaService
    {
        private readonly IMongoCollection<Nota> _notas;

        public NotaService(IMongoClient client)
        {
            var database = client.GetDatabase("gestionnotas");
            _notas = database.GetCollection<Nota>("notas");
        }

        public async Task CrearNotaAsync(Nota nota)
        {
            nota.FechaCreacion = DateTime.UtcNow;
            await _notas.InsertOneAsync(nota);
        }

        public async Task<List<Nota>> ObtenerNotasPorUsuarioAsync(string usuarioId)
        {
            var filter = Builders<Nota>.Filter.Eq(n => n.UsuarioId, usuarioId);
            return await _notas.Find(filter)
                               .SortByDescending(n => n.FechaCreacion)
                               .ToListAsync();
        }

        public async Task EliminarNotaAsync(string id)
        {
            await _notas.DeleteOneAsync(n => n.Id == id);
        }
    }
}
