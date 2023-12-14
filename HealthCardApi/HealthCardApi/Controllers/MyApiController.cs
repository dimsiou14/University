using Microsoft.AspNetCore.Mvc;
using myApi.Models;
using myApi.Repository;
using System.Text.Json;
using System.Diagnostics;
using System.Net;

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

                await _myApiRepository.SendOTP("test");

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
        public async Task<IActionResult> GetDoctorUsers(int DoctorID)
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
                var history = _myApiRepository.GetHistory(UserID);

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
        public async Task <IActionResult> SaveUser([FromBody] List<string> userData)
        {
            try
            { 
                await _myApiRepository.SaveUser(userData);

                return Ok("Ok");
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

                var user = _myApiRepository.AuthenticateUser(userData);
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

        [Route("myApi/history/add")]
        [HttpPost]
        public async Task<IActionResult> AddHistory([FromBody] string rawString)
        {
            try
            {

                //_myApiRepository.AddHistory();

                return Ok(rawString);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return StatusCode(500);
            }

        }
    }
}