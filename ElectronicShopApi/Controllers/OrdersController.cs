using ElectronicShopApi.Data;
using ElectronicShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ElectronicShopApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            return Ok(await _context.Orders.Where(o => o.UserId == userId).ToListAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await GetOrdersWithDetails().ToListAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order order)
        {
            if (id != order.Id) return BadRequest();

            var existing = await _context.Orders.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Status = order.Status;
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        private IQueryable<Order> GetOrdersWithDetails()
        {
            return from o in _context.Orders
                   join p in _context.Products on o.ProductId equals p.Id
                   join u in _context.Users on o.UserId equals u.Id
                   select new Order
                   {
                       Id = o.Id,
                       UserId = o.UserId,
                       ProductId = o.ProductId,
                       Quantity = o.Quantity,
                       TotalPrice = o.TotalPrice,
                       PaymentAmount = o.PaymentAmount,
                       OrderDate = o.OrderDate,
                       Status = o.Status,
                       ProductName = p.Name,
                       Username = u.Username
                   };
        }
    }
}