using System;

namespace jaymvc.Models.Home
{
    public enum ActionItemPriorityConstants
    {
        High,
        Normal,
        Low
    }

    public class Todo
    {
        public Guid AssignedToId { get; set; }
        public string AssignedToName { get; set; }
        public Guid Id { get; set; }
        public string Text { get; set; }
        public DateTime DueDate { get; set; }
        public ActionItemPriorityConstants Priority { get; set; }
        public string PriorityClass => GetPriortyClass(Priority, DueDate);

        public static string GetPriortyClass(ActionItemPriorityConstants priority, DateTime? dueDate = null)
        {
            if (dueDate.HasValue)
            {   
                if (dueDate.Value.Date == DateTime.Today && priority != ActionItemPriorityConstants.High)
                    return "warning";
                
                if (dueDate.Value < DateTime.Now)
                    return "danger";
            }

            switch (priority)
            {
                case ActionItemPriorityConstants.High:
                    return "danger";
                case ActionItemPriorityConstants.Low:
                    return "info";
                default:
                    return "warning";

            }
        }
    }
}