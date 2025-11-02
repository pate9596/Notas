using GestionNotas.Models;
using GestionNotas.Services;
using Microsoft.AspNetCore.Mvc;

namespace GestionNotas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public AuthController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario usuario)
        {
            try
            {
                // Verifica si el usuario ya existe
                var usuarioExistente = await _usuarioService.ObtenerUsuarioPorEmailAsync(usuario.Email);
                if (usuarioExistente != null)
                {
                    return BadRequest(new { error = "El usuario ya está registrado." });
                }

                // Crea el nuevo usuario
                await _usuarioService.CrearUsuarioAsync(usuario);
                return Ok(new { id = usuario.Id, email = usuario.Email, name = usuario.Nombre });
            }
            catch (Exception ex)
            {
                // Devuelve un error detallado para depuración
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Usuario usuario)
        {
            try
            {
                var usuarioAutenticado = await _usuarioService.AutenticarUsuarioAsync(usuario.Email, usuario.PasswordHash);
                if (usuarioAutenticado != null)
                {
                    return Ok(new { id = usuarioAutenticado.Id, email = usuarioAutenticado.Email, name = usuarioAutenticado.Nombre });
                    
                }
                return Unauthorized(new { error = "Credenciales inválidas." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
