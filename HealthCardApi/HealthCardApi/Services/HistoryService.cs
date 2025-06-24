using Microsoft.EntityFrameworkCore;
using myApi.Data;
using myApi.Models;
using NLog;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HealthCardApi.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly HealthCardDbContext _context;
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        public HistoryService(HealthCardDbContext context)
        {
                _context = context;
        }
        public async Task<List<HistoryDTO>> GetHistory(int UserID)
        {
            var history = await _context.HistoryInfo.Where(i => i.UserId == UserID).Select(i => new HistoryDTO()
            {
                HistoryId = i.HistoryId,
                UserId = i.UserId,
                DoctorId = i.DoctorId,
                DoctorName = i.DoctorName,
                Recorded = i.Recorded,
                ImageSrc = i.ImageSrc
            }).ToListAsync();

            return history;
        }
        public async Task<HistoryDTO?> AddHistory(HistoryDTO data)
        {
            History newHistory = new History();

            newHistory.DoctorId = data.DoctorId;
            newHistory.DoctorName = data.DoctorName;
            newHistory.UserId = data.UserId;
            newHistory.Recorded = DateTime.Now;
            newHistory.ImageSrc = data.ImageSrc;

            _logger.Debug($"Try to add history : {JsonSerializer.Serialize(newHistory)}");

            await _context.HistoryInfo.AddAsync(newHistory);
            await _context.SaveChangesAsync();
            int id = newHistory.HistoryId;

            HistoryDTO? history = await _context.HistoryInfo.Where(h => h.HistoryId == id).Select(h => new HistoryDTO
            {
                HistoryId = id,
                DoctorId = h.DoctorId,
                DoctorName = h.DoctorName,
                UserId = h.UserId,
                Recorded = h.Recorded,
                ImageSrc = h.ImageSrc
            }).FirstOrDefaultAsync();

            return history;
        }
    }
}
