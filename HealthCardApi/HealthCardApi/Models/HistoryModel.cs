namespace myApi.Models
{

    public class HistoryModel
    {
        public int HistoryId { get; set; }

        public int UserId { get; set; }

        public int DoctorId { get; set; }

        public string DoctorName { get; set; }

        public DateTime Recorded { get; set; }

        public string ImageSrc { get; set; }
    }
}