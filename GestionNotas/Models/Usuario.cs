using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;


namespace GestionNotas.Models
{
    public class Usuario
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("email")]
        [JsonPropertyName("email")] // 👈 agrega esto
        public string Email { get; set; } = string.Empty;

        [BsonElement("passwordHash")]
        [JsonPropertyName("passwordHash")] // 👈 agrega esto
        public string PasswordHash { get; set; } = string.Empty;

        [BsonElement("nombre")]
        [JsonPropertyName("nombre")] // 👈 agrega esto
        public string Nombre { get; set; } = string.Empty;
    }

}

