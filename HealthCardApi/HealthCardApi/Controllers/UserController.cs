using HealthCardApi.Models;
using HealthCardApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myApi.Models;

namespace HealthCardApi.Controllers
{
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }
        [Route("user/all")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                Result<List<UserDTO>> result = new Result<List<UserDTO>>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var users = await _userService.GetAllUsers();

                result.Success = users.Any();
                result.Items = users;

                return Ok(result);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }
        }

        [Authorize]
        [Route("user/info")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo(int UserID)
        {
            try
            {
                Result<UserDTO> result = new Result<UserDTO>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var info = await _userService.GetUserInfo(UserID);

                result.Success = info != null;
                result.Items = info;

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }
        }

        [Route("user/save")]
        [HttpPost]
        public async Task<IActionResult> SaveUser([FromBody] List<string> userData)
        {
            try
            {
                Result<UserDTO> result = new Result<UserDTO>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var user = await _userService.SaveUser(userData);

                result.Success = user != null;
                result.Items = user;

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }
        [Route("user/save")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] List<string> userData)
        {
            try
            {
                Result<UserDTO> result = new Result<UserDTO>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var user = await _userService.UpdateUser(userData);

                result.Success = user != null;
                result.Items = user;

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }

        [Authorize]
        [Route("user/doctorusers")]
        [HttpGet]
        public async Task<IActionResult> GetDoctorUsers([FromQuery] int DoctorID)
        {

            try
            {
                Result<List<UserDTO>> result = new Result<List<UserDTO>>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var doctorusers = await _userService.GetDoctorUsers(DoctorID);

                if (doctorusers.Count > 0)
                {

                    result.Success = true;
                    result.Items = doctorusers;
                }
                else
                {
                    result.Message = "No History";
                    result.Items = new List<UserDTO>();

                }
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
