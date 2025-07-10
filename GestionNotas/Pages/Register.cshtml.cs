using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using GestionNotas.Models;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

public class RegisterModel : PageModel
{
    private readonly IMongoCollection<Usuario> _usuarios;

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
    public RegisterModel(IMongoClient client)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
    {
        var db = client.GetDatabase("notasdb");
        _usuarios = db.GetCollection<Usuario>("usuarios");
    }

    [BindProperty]
    public string Email { get; set; }

    [BindProperty]
    public string Password { get; set; }

    public IActionResult OnPost()
    {
        var existe = _usuarios.Find(u => u.Email == Email).FirstOrDefault();
        if (existe != null)
        {
            ModelState.AddModelError("", "Correo ya registrado");
            return Page();
        }

        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(Password)));
        var nuevo = new Usuario { Email = Email, PasswordHash = hash };
        _usuarios.InsertOne(nuevo);

        return RedirectToPage("Login");
    }
}

internal class Usuario
{
    public required string Email { get; internal set; }
    public required string PasswordHash { get; internal set; }
}