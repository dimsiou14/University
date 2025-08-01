﻿namespace HealthCardApi.Models
{
    public class Result<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Items { get; set; }
    }
}
