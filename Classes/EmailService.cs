using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System;

namespace Celestia.Classes
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var emailConfig = _configuration.GetSection("EmailConfiguration");
            var smtpServer = emailConfig["SmtpServer"];
            var smtpPort = int.Parse(emailConfig["SmtpPort"] ?? "587");
            var smtpUsername = emailConfig["SmtpUsername"];
            var smtpPassword = emailConfig["SmtpPassword"];
            var senderName = emailConfig["SenderName"];
            var senderEmail = emailConfig["SenderEmail"];

            if (string.IsNullOrEmpty(smtpServer) || smtpUsername == "your-email@gmail.com") 
            {
                Console.WriteLine("Mock Email Sent to " + toEmail + ": " + subject);
                return;
            }

            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = htmlMessage,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try 
                {
                    await client.SendMailAsync(mailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
            }
        }
    }
}
