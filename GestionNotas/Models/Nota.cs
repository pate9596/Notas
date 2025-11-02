using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GestionNotas.Models
{
    public class Nota
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("titulo")]
        public string Titulo { get; set; } = string.Empty;

        [BsonElement("contenido")]
        public string Contenido { get; set; } = string.Empty;

        [BsonElement("fechaCreacion")]
        public DateTime FechaCreacion { get; set; }

        [BsonElement("usuarioId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UsuarioId { get; set; } = string.Empty;
    }
}
