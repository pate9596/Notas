using Microsoft.AspNetCore.Mvc;
using GestionNotas.Models;
using GestionNotas.Services;

namespace GestionNotas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotasController : ControllerBase
    {
        private readonly NotaService _notaService;

        public NotasController(NotaService notaService)
        {
            _notaService = notaService;
        }

        // ✅ Crear nota
        [HttpPost]
        public async Task<IActionResult> CrearNota([FromBody] Nota nota)
        {
            try
            {
                if (string.IsNullOrEmpty(nota.UsuarioId))
                    return BadRequest(new { error = "Falta el usuarioId en la nota." });

                await _notaService.CrearNotaAsync(nota);
                return Ok(new { message = "Nota creada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ✅ Obtener todas las notas del usuario logeado
        [HttpGet("{usuarioId}")]
        public async Task<IActionResult> ObtenerNotasPorUsuario(string usuarioId)
        {
            try
            {
                var notas = await _notaService.ObtenerNotasPorUsuarioAsync(usuarioId);
                return Ok(notas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ✅ Eliminar nota
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarNota(string id)
        {
            try
            {
                await _notaService.EliminarNotaAsync(id);
                return Ok(new { message = "Nota eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
