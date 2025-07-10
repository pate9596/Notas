using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GestionNotas.Models
{
    public class Nota
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        [BsonElement("titulo")]
        public required string Titulo { get; set; }

        [BsonElement("contenido")]
        public required string Contenido { get; set; }
    }
}
