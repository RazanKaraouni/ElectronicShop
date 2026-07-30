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
    [Authorize(Roles = "Customer")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = GetUserId();
            return Ok(await _context.CartItems.Where(c => c.UserId == userId).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(CartItem cartItem)
        {
            var userId = GetUserId();

            var product = await _context.Products.FindAsync(cartItem.ProductId);
            if (product == null) return NotFound();
            if (!product.IsActive || product.Stock <= 0)
                return BadRequest(new { message = "Product not available." });

            var existing = await _context.CartItems.FirstOrDefaultAsync(c =>
                c.UserId == userId && c.ProductId == cartItem.ProductId);

            if (existing != null)
            {
                existing.Quantity += cartItem.Quantity;
                await _context.SaveChangesAsync();
                return Ok(existing);
            }

            cartItem.UserId = userId;
            cartItem.Quantity = cartItem.Quantity <= 0 ? 1 : cartItem.Quantity;

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var cartItem = await _context.CartItems.FindAsync(id);

            if (cartItem == null) return NotFound();
            if (cartItem.UserId != userId) return Forbid();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckoutRequest request)
        {
            var userId = GetUserId();
            var cartItems = await _context.CartItems.Where(c => c.UserId == userId).ToListAsync();

            if (!cartItems.Any())
                return BadRequest(new { message = "Cart is empty." });

            var isFirstOrder = true;

            foreach (var item in cartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest(new { message = "Product not found." });
                if (product.Stock < item.Quantity)
                    return BadRequest(new { message = "Not enough stock." });

                var order = new Order
                {
                    UserId = userId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    TotalPrice = product.Price * item.Quantity,
                    PaymentAmount = isFirstOrder ? request.PaymentAmount : 0,
                    OrderDate = DateTime.Now,
                    Status = "Pending"
                };

                isFirstOrder = false;
                product.Stock -= item.Quantity;
                _context.Orders.Add(order);
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Checkout successful." });
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}