using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicShopApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "Pending";

        [NotMapped]
        public string? ProductName { get; set; }

        [NotMapped]
        public string? Username { get; set; }
    }
}
