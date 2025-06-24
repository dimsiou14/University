using HealthCardApi.Models;
using HealthCardApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using myApi.Models;

namespace HealthCardApi.Controllers
{

    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJWTService _jwtService;
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;
        public AuthController(IJWTService jwtService, IAuthService authService, IUserService userService, ILogger<AuthController> logger)
        {
            _jwtService = jwtService;
            _authService = authService;
            _userService = userService;
            _logger = logger;
        }

        [Route("auth/user")]
        [HttpPost]
        public async Task<IActionResult> AuthenticateUser([FromBody] LoginObject userData)
        {
            try
            {
                Result<LoginResponse> result = new Result<LoginResponse>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                var user = await _authService.AuthenticateUser(userData);

                if (user != null)
                {
                    string token = _jwtService.GenerateJwtToken(user);

                    result.Success = true;
                    result.Message = "";
                    result.Items = new LoginResponse { User = user, Token = token };

                }
                else
                    result.Message = "Invalid Credentials..!";

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }

        [Authorize]
        [Route("auth/otp")]
        [HttpPost]
        public async Task<IActionResult> AuthenticateUser([FromBody] OtpDTO item)
        {
            try
            {
                Result<UserDTO> result = new Result<UserDTO>()
                {
                    Success = false,
                    Message = "",
                    Items = null
                };

                if (string.IsNullOrWhiteSpace(item.Code))
                {
                    result.Message = "OTP Code is empty. Please try again..!";
                    return Ok(result);
                }

                bool isValid = _authService.AuthenticateOTP(item.Id, item.Code);

                if (isValid)
                {
                    var user = await _userService.GetUserInfo(item.Id);
                    if (user != null)
                    {
                        result.Success = true;
                        result.Items = user;
                        return Ok(result);
                    }
                    else
                    {
                        result.Message = "OTP Code is valid but user did not found. Please contact with system admin..!";
                        return Ok(result);
                    }
                }
                else
                {
                    result.Message = "OTP Code is not valid. Please try again..!";
                    return Ok(result);
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return StatusCode(500);
            }

        }

        [Authorize]
        [Route("auth/otp/create")]
        [HttpPost]
        public IActionResult CreateOTP([FromBody] OtpDTO item)
        {
            try
            {
                Result<bool> result = new Result<bool>()
                {
                    Success = false,
                    Message = "",
                    Items = false
                };

                bool OTPcreated = _authService.CreateOTP(item.Id);

                if (!OTPcreated)
                {
                    result.Message = "Error ! OTP could not be created..! Please conteact with system admin";
                    return Ok(result);
                   
                }

                bool OTPsent = _authService.SendOTP(item.Id);

                if (!OTPsent)
                {
                    result.Message = "Error ! OTP could not be sent..! Please conteact with system admin";
                    return Ok(result);

                }

                result.Success = true;
                result.Items = true;

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
