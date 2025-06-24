using myApi.Models;

namespace HealthCardApi.Services
{
    public interface IHistoryService
    {
        Task<List<HistoryDTO>> GetHistory(int UserID);
        Task<HistoryDTO?> AddHistory(HistoryDTO data);
    }
}
