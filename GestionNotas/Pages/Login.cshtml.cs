using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using GestionNotas.Models;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;

public class LoginModel : PageModel
{
    private readonly IMongoCollection<Usuario> _usuarios;

    public LoginModel(IMongoClient client)
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
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(Password)));
        var usuario = _usuarios.Find(u => u.Email == Email && u.PasswordHash == hash).FirstOrDefault();

        if (usuario == null)
        {
            ModelState.AddModelError("", "Credenciales incorrectas");
            return Page();
        }

        HttpContext.Session.SetString("usuario", Email);
        return RedirectToPage("Index");
    }
}
