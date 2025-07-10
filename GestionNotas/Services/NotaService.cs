using MongoDB.Driver;
using GestionNotas.Models;
using Microsoft.Extensions.Configuration;

namespace GestionNotas.Services
{
    public class NotaService
    {
        private readonly IMongoCollection<Nota> _notas;

        public NotaService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("gestionnotas");
            _notas = database.GetCollection<Nota>("notas");
        }

        public List<Nota> Get()
        {
            var lista = _notas.Find(n => true).ToList();
            Console.WriteLine($"Notas encontradas: {lista.Count}");
            return lista;
        }

    }
}
