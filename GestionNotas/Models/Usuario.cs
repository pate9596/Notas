using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GestionNotas.Models
{
    public class Autenticacion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("correo")]
        public required string correo { get; set; }

        [BsonElement("password")]
        public required string contrasenna { get; set; }
    }
}
