using GestionNotas.Models;
using GestionNotas.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class IndexModel(NotaService notaService) : PageModel
{
    private readonly NotaService _notaService = notaService;

    public required List<Nota> Notas { get; set; }

    public void OnGet()
    {
        Notas = _notaService.Get();
    }
}
