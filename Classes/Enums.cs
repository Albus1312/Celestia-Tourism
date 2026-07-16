namespace Celestia.Classes
{
    public enum PaymentStatus
    {
        Pending,
        Paid,
        Cancelled,
        Completed,
        Failed
    }

    public enum InteractionType
    {
        View,
        Like,
        Favorite,
        Share
    }

    public enum MediaType
    {
        Image,
        Video,
        Audio,
        Document
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }
}
