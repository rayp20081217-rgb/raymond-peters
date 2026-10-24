/*=====================================
    EMAILJS CONTACT FORM
=====================================*/

// ==============================
// EmailJS Configuration
// ==============================
const PUBLIC_KEY = "yBBhs7VyLJJ-0Xhk8";
const SERVICE_ID = "service_wmjtgwl";
const TEMPLATE_ID = "template_upuac99";

// ==============================
// Initialize EmailJS
// ==============================
emailjs.init({
    publicKey: PUBLIC_KEY
});

// ==============================
// Get Form Elements
// ==============================
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

// ==============================
// Check if form exists
// ==============================
if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        // Show loading message
        status.innerHTML = "📤 Sending message...";
        status.style.color = "orange";

        // Disable submit button while sending
        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending...";
        }

        // Send email
        emailjs.sendForm(
            SERVICE_ID,
            TEMPLATE_ID,
            form
        )

        .then(function (response) {

            console.log("SUCCESS!", response);

            status.innerHTML = "✅ Message sent successfully!";
            status.style.color = "#00cc66";

            form.reset();

        })

        .catch(function (error) {

            console.error("EmailJS Error:", error);

            let message = "❌ Failed to send message.";

            if (error.status === 404) {
                message += "<br>Template or Service ID not found.";
            }
            else if (error.status === 401) {
                message += "<br>Invalid Public Key.";
            }
            else if (error.status === 422) {
                message += "<br>Template variables do not match your form.";
            }
            else if (error.text) {
                message += "<br>" + error.text;
            }

            status.innerHTML = message;
            status.style.color = "red";

        })

        .finally(function () {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message";
            }

        });

    });

} else {

    console.error("contactForm not found!");

}
