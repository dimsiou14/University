using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthCardApi.Controllers
{
    public class FileController : ControllerBase
    {
        private readonly ILogger<FileController> _logger;
        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
        }

        //[Authorize]
        [Route("file/view")]
        [HttpGet]
        public IActionResult ViewFile([FromQuery] string imageSrc)
        {
            try
            {
                return File(new FileStream(@imageSrc, FileMode.Open, FileAccess.Read), "application/pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }
    }
}
