using HealthCardApi.Models;
using HealthCardApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myApi.Models;

namespace HealthCardApi.Controllers
{
    public class HistoryController : Controller
    {
        private readonly IHistoryService _historyService;
        private readonly ILogger<HistoryController> _logger;
        public HistoryController(IHistoryService historyService, ILogger<HistoryController> logger)
        {
            _historyService = historyService;
            _logger = logger;
        }

        [Authorize]
        [Route("history/view")]
        [HttpGet]
        public async Task<IActionResult> GetHistory(int UserID)
        {
            try
            {
                Result<List<HistoryDTO>> result = new Result<List<HistoryDTO>>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var history = await _historyService.GetHistory(UserID);

                result.Success = history.Any();
                result.Items = history;

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }

        [Authorize]
        [Route("history/add")]
        [HttpPost]
        public async Task<IActionResult> AddHistory([FromBody] HistoryDTO data)
        {
            try
            {
                Result<HistoryDTO> result = new Result<HistoryDTO>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };
                var history = await _historyService.AddHistory(data);
                
                result.Success = true;
                result.Items = history;

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }
    }
}
