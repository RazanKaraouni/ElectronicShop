using ElectronicShopApi.Data; 
using ElectronicShopApi.Models;  
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ElectronicShopApi.Controllers
{
    [Route("api/[controller]")]//for eg api/auth
    [ApiController] //enable everything related to WEB_API
    public class AuthController : ControllerBase
    {
        //private means that ONLY THIS CONTROLLER will use them
        //readonly set ONCE in the constructor, never changed after
        private readonly AppDbContext _context;// access 3al database
        private readonly IConfiguration _config;//access 3al app settingd

        //constructor
        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register(User model)
        {
            if (_context.Users.Any(x => x.Email == model.Email))
                return BadRequest(new { message = "Email already exists !" });

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Password = model.Password,
                Role = "Customer"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "Registration successful. Please login." });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest model)
        {
            var user = _context.Users.FirstOrDefault(x =>
                x.Username == model.Username &&
                x.Password == model.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                return StatusCode(500, "JWT Key is not configured properly on the server.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                username = user.Username,
                role = user.Role,
                expiration = token.ValidTo
            });
        }
    }
}