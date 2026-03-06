export default function decorate(block) {

    const rows = block.querySelectorAll(':scope > div');
  
    const title = rows[0]?.textContent.trim() || 'Contact Us';
    const description = rows[1]?.textContent.trim() || '';
    const endpoint = rows[2]?.textContent.trim() || '';
    const buttonText = rows[3]?.textContent.trim() || 'Submit';
    const successMessage = rows[4]?.textContent.trim() || 'Message sent successfully';
  
    block.innerHTML = `
    
    <div class="form-container">
  
      <h2 class="form-title">${title}</h2>
  
      <p class="form-description">${description}</p>
  
      <form class="contact-form-element">
  
        <input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          required
        />
  
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          required
        />
  
        <textarea 
          name="message" 
          placeholder="Your Message"
          required
        ></textarea>
  
        <button type="submit">
          ${buttonText}
        </button>
  
      </form>
  
      <div class="form-success-message" style="display:none;">
        ${successMessage}
      </div>
  
    </div>
    `;
  
    const form = block.querySelector('.contact-form-element');
  
    form.addEventListener('submit', async (e) => {
  
      e.preventDefault();
  
      const data = new FormData(form);
  
      try {
  
        await fetch(endpoint || 'https://httpbin.org/post', {
          method: 'POST',
          body: data
        });
  
        form.style.display = 'none';
  
        block.querySelector('.form-success-message').style.display = 'block';
  
      } catch (err) {
  
        alert('Submission failed');
  
      }
  
    });
  
  }