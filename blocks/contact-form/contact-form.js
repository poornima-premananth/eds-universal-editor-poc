export default function decorate(block) {

    const rows = block.querySelectorAll(':scope > div');
  
    const title = rows[0]?.textContent.trim() || "Contact Us";
    const description = rows[1]?.textContent.trim() || "";
    const endpoint = rows[2]?.textContent.trim() || "";
    const buttonText = rows[3]?.textContent.trim() || "Submit";
    const successMessage = rows[4]?.textContent.trim() || "Thank you! Our team will contact you shortly.";
  
    block.innerHTML = `
    
    <div class="pharma-form">
  
      <h2 class="form-title">${title}</h2>
      <p class="form-description">${description}</p>
  
      <form class="contact-form-element">
  
        <div class="form-field">
          <input type="text" name="name" placeholder="Full Name*" required />
          <span class="error"></span>
        </div>
  
        <div class="form-field">
          <input type="email" name="email" placeholder="Email Address*" required />
          <span class="error"></span>
        </div>
  
        <div class="form-field">
          <input type="tel" name="phone" placeholder="Phone Number*" required />
          <span class="error"></span>
        </div>
  
        <div class="form-field">
          <select name="inquiryType" required>
            <option value="">Select Inquiry Type</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Medical Consultation">Medical Consultation</option>
            <option value="Distribution Partnership">Distribution Partnership</option>
            <option value="Customer Support">Customer Support</option>
          </select>
          <span class="error"></span>
        </div>
  
        <div class="form-field">
          <textarea name="message" placeholder="Your Message*" required></textarea>
          <span class="error"></span>
        </div>
  
        <label class="checkbox">
          <input type="checkbox" name="subscribe">
          Subscribe to healthcare updates
        </label>
  
        <label class="checkbox required">
          <input type="checkbox" name="terms" required>
          I agree to the Terms & Privacy Policy
        </label>
  
        <button type="submit" class="submit-btn">
          ${buttonText}
        </button>
  
        <div class="form-loading" style="display:none;">
          Submitting...
        </div>
  
      </form>
  
      <div class="form-success" style="display:none;">
        ${successMessage}
      </div>
  
    </div>
    `;
  
    const form = block.querySelector("form");
    const loading = block.querySelector(".form-loading");
  
    function validateForm() {
  
      let valid = true;
  
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
  
      const phoneRegex = /^[0-9]{10}$/;
  
      form.querySelectorAll(".error").forEach(e => e.textContent = "");
  
      if (name.value.trim().length < 2) {
        name.nextElementSibling.textContent = "Enter valid name";
        valid = false;
      }
  
      if (!email.value.includes("@")) {
        email.nextElementSibling.textContent = "Enter valid email";
        valid = false;
      }
  
      if (!phoneRegex.test(phone.value)) {
        phone.nextElementSibling.textContent = "Enter valid 10 digit phone";
        valid = false;
      }
  
      return valid;
    }
  
    form.addEventListener("submit", async (e) => {
  
      e.preventDefault();
  
      if (!validateForm()) return;
  
      loading.style.display = "block";
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
  
        await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        loading.style.display = "none";
        form.style.display = "none";
  
        block.querySelector(".form-success").style.display = "block";
  
      } catch(err) {
  
        loading.style.display = "none";
        alert("Submission failed. Please try again.");
  
      }
  
    });
  
  }