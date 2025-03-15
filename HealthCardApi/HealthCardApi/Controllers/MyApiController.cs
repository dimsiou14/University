using HealthCardApi.Models;
using Microsoft.AspNetCore.Mvc;
using myApi.Models;
using myApi.Repository;

namespace myApi.Controllers
{

    [ApiController]
    public class MyApiController : ControllerBase
    {
        private readonly ImyApiRepository _myApiRepository;

        public MyApiController(ImyApiRepository myApiRepository)
        {
            _myApiRepository = myApiRepository;
        }

        [Route("myApi/users")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _myApiRepository.GetAllUsers();

                //await _myApiRepository.SendOTP("test");

                return Ok(users);
            }

            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [Route("myApi/user/info")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo(int UserID)
        {
            try
            {

                var info = await _myApiRepository.GetUserInfo(UserID);

                return Ok(info);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [Route("myApi/doctorusers")]
        [HttpGet]
        public async Task<IActionResult> GetDoctorUsers([FromQuery] int DoctorID)
        {

            try
            {

                var doctorusers = await _myApiRepository.GetDoctorUsers(DoctorID);

                return Ok(doctorusers);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [Route("myApi/history")]
        [HttpGet]
        public async Task<IActionResult> GetHistory(int UserID)
        {
            try
            {
                var history = await _myApiRepository.GetHistory(UserID);

                return Ok(history);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/newUser")]
        [HttpPost]
        public async Task<IActionResult> SaveUser([FromBody] List<string> userData)
        {
            try
            {
                var user = await _myApiRepository.SaveUser(userData);

                return Ok(user);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/auth")]
        [HttpPost]
        public async Task<IActionResult> AuthenticateUser([FromBody] LoginObject userData)
        {
            try
            {

                var user = await _myApiRepository.AuthenticateUser(userData);
                if (user != null)
                {
                    return Ok(user);
                }
                else
                {
                    return StatusCode(500);
                }


            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/authOTP")]
        [HttpPost]
        public async Task<IActionResult> AuthenticateUser([FromBody] OtpDTO item)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(item.Code))
                    return StatusCode(500);

                bool isValid = _myApiRepository.AuthenticateOTP(item.Id, item.Code);

                if (isValid)
                {
                    var user = await _myApiRepository.GetUserInfo(item.Id);
                    if (user != null)
                    {
                        return Ok(user);
                    }
                    else
                    {
                        return StatusCode(500);
                    }
                }
                else
                {
                    return StatusCode(500);
                }


            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/otp/create")]
        [HttpPost]
        public IActionResult CreateOTP([FromBody] OtpDTO item)
        {
            try
            {

                _myApiRepository.CreateOTP(item.Id);
                _myApiRepository.SendOTP(item.Id);


                return Ok("ok");
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/history/add")]
        [HttpPost]
        public async Task<IActionResult> AddHistory([FromBody] HistoryDTO data)
        {
            try
            {

                var history = await _myApiRepository.AddHistory(data);

                return Ok(history);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }

        [Route("myApi/viewFile")]
        [HttpGet]
        public IActionResult ViewFile([FromQuery] string imageSrc)
        {
            try
            {
                return StatusCode(500);
                return File(new FileStream(@imageSrc, FileMode.Open, FileAccess.Read), "application/pdf");
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }
    }
}