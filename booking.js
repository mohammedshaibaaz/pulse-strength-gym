/**
 * BOOKING SYSTEM - Frontend JavaScript
 * Handles class schedule display, booking modal, and API communication
 */

'use strict';

/**
 * DEMO PROJECT POPUP
 * Show popup on first visit, store in localStorage
 */
(function initDemoPopup() {
  const popup = document.getElementById('demo-popup');
  const closeBtn = document.getElementById('demo-popup-close');
  const dismissBtn = document.getElementById('demo-popup-dismiss');
  const overlay = document.getElementById('demo-popup-overlay');
  
  // Check if user has seen the popup before
  const hasSeenPopup = localStorage.getItem('demo_popup_seen');
  
  if (!hasSeenPopup && popup) {
    // Show popup after a short delay for better UX
    setTimeout(() => {
      popup.classList.add('active');
      popup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }, 800);
  }
  
  // Close popup function
  const closePopup = () => {
    if (popup) {
      popup.classList.remove('active');
      popup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      localStorage.setItem('demo_popup_seen', 'true');
    }
  };
  
  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (dismissBtn) dismissBtn.addEventListener('click', closePopup);
  if (overlay) overlay.addEventListener('click', closePopup);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup && popup.classList.contains('active')) {
      closePopup();
    }
  });
})();

// API Configuration
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('127.0.0.1'))
  ? 'http://localhost:3000/api' 
  : 'https://pulse-strength-gym.vercel.app/api';

// State
let allClasses = [];
let currentBookingClass = null;

// DOM Elements
const scheduleGrid = document.getElementById('schedule-grid');
const scheduleLoading = document.getElementById('schedule-loading');
const scheduleError = document.getElementById('schedule-error');
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

/**
 * Fetch all classes from API
 */
async function fetchClasses() {
  try {
    console.log('Fetching from:', `${API_URL}/classes`);
    const classesResponse = await fetch(`${API_URL}/classes`);
    console.log('Response status:', classesResponse.status);
    
    if (!classesResponse.ok) {
      const errorText = await classesResponse.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch classes: ${classesResponse.status} - ${errorText}`);
    }
    
    const data = await classesResponse.json();
    console.log('Classes data:', data);
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format - no classes array');
    }
    
    allClasses = data.data;
    displayClasses(allClasses);
    
    scheduleLoading.style.display = 'none';
    scheduleGrid.style.display = 'grid';
  } catch (error) {
    console.error('Error fetching classes:', error);
    scheduleLoading.style.display = 'none';
    scheduleError.style.display = 'block';
    scheduleError.innerHTML = `
      <p>⚠️ Unable to load classes</p>
      <p style="font-size: 0.9em; margin-top: 0.5em;">Error: ${error.message}</p>
      <p style="font-size: 0.85em; color: #888;">Check console for details</p>
    `;
  }
}

/**
 * Display classes in the schedule grid
 */
function displayClasses(classes) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  scheduleGrid.innerHTML = days.map(day => {
    const dayClasses = classes.filter(c => c.day === day);
    
    return `
      <div class="schedule-day">
        <h3 class="day-header">${day}</h3>
        <div class="day-classes">
          ${dayClasses.length > 0 
            ? dayClasses.map(classItem => createClassCard(classItem)).join('') 
            : '<p class="no-classes">No classes scheduled</p>'
          }
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to all book buttons
  document.querySelectorAll('.book-class-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const classId = e.target.dataset.classId;
      const classData = allClasses.find(c => c._id === classId);
      openBookingModal(classData);
    });
  });
}

/**
 * Create HTML for a single class card
 */
function createClassCard(classItem) {
  const isFull = classItem.booked_count >= classItem.capacity;
  const availableSpots = classItem.capacity - classItem.booked_count;
  const difficultyColor = {
    'Beginner': '#4CAF50',
    'Intermediate': '#FF9800',
    'Advanced': '#e63946'
  };

  return `
    <article class="class-card" data-class-id="${classItem._id}">
      <div class="class-header">
        <h4 class="class-name">${classItem.name}</h4>
        <span class="class-difficulty" style="background: ${difficultyColor[classItem.difficulty]}">${classItem.difficulty}</span>
      </div>
      <p class="class-description">${classItem.description}</p>
      <div class="class-meta">
        <div class="meta-item">
          <span class="meta-icon">👤</span>
          <span class="meta-text">${classItem.trainer}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">🕐</span>
          <span class="meta-text">${classItem.time} (${classItem.duration}min)</span>
        </div>
        <div class="meta-item ${isFull ? 'spots-full' : availableSpots <= 3 ? 'spots-low' : ''}">
          <span class="meta-icon">📍</span>
          <span class="meta-text">${availableSpots} / ${classItem.capacity} spots</span>
        </div>
      </div>
      <button 
        type="button" 
        class="btn ${isFull ? 'btn-disabled' : 'btn-primary'} book-class-btn" 
        data-class-id="${classItem._id}"
        ${isFull ? 'disabled' : ''}
      >
        ${isFull ? 'Class Full' : 'Book Class'}
      </button>
    </article>
  `;
}

/**
 * Open booking modal
 */
function openBookingModal(classData) {
  currentBookingClass = classData;
  
  // Populate class info
  document.getElementById('modal-class-info').innerHTML = `
    <div class="modal-class-details">
      <h4>${classData.name}</h4>
      <p><strong>Trainer:</strong> ${classData.trainer}</p>
      <p><strong>Day & Time:</strong> ${classData.day} at ${classData.time}</p>
      <p><strong>Duration:</strong> ${classData.duration} minutes</p>
      <p><strong>Difficulty:</strong> ${classData.difficulty}</p>
    </div>
  `;
  
  // Set class ID
  document.getElementById('booking-class-id').value = classData._id;
  
  // Show modal
  bookingModal.classList.add('active');
  bookingModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus on first input
  document.getElementById('booking-name').focus();
}

/**
 * Close booking modal
 */
function closeBookingModal() {
  bookingModal.classList.remove('active');
  bookingModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Reset form
  bookingForm.reset();
  bookingForm.style.display = 'block';
  bookingSuccess.style.display = 'none';
  document.getElementById('booking-status').textContent = '';
  
  // Clear errors
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// Expose close function globally for onclick handlers
window.bookingModal = { close: closeBookingModal };

/**
 * Handle booking form submission
 */
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  const statusEl = document.getElementById('booking-status');
  const submitBtn = document.getElementById('booking-submit');
  
  // Get form data
  const formData = {
    name: document.getElementById('booking-name').value.trim(),
    email: document.getElementById('booking-email').value.trim(),
    phone: document.getElementById('booking-phone').value.trim(),
    class_id: document.getElementById('booking-class-id').value,
    emergency_contact: document.getElementById('booking-emergency').value.trim()
  };
  
  // Basic validation
  let hasError = false;
  
  if (!formData.name) {
    document.getElementById('booking-name-error').textContent = 'Name is required';
    hasError = true;
  }
  
  if (!formData.email || !isValidEmail(formData.email)) {
    document.getElementById('booking-email-error').textContent = 'Valid email is required';
    hasError = true;
  }
  
  if (!formData.phone) {
    document.getElementById('booking-phone-error').textContent = 'Phone number is required';
    hasError = true;
  }
  
  if (hasError) return;
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Booking...';
  statusEl.textContent = 'Processing your booking...';
  statusEl.style.color = 'var(--text-secondary)';
  
  try {
    const bookingResponse = await fetch(`${API_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await bookingResponse.json();
    
    if (!bookingResponse.ok) {
      // Handle validation errors array from express-validator
      if (data.errors && Array.isArray(data.errors)) {
        throw new Error(data.errors.map(e => e.msg).join(', '));
      }
      throw new Error(data.error || 'Booking failed');
    }
    
    // Track booking with GA4
    if (window.trackBooking) {
      window.trackBooking(currentBookingClass);
    }
    
    // Show success message
    document.getElementById('success-message').textContent = 
      `Your spot in "${currentBookingClass.name}" has been confirmed! A confirmation email has been sent to ${formData.email}.`;
    
    bookingForm.style.display = 'none';
    bookingSuccess.style.display = 'block';
    
    // Refresh classes to update available spots
    await fetchClasses();
    
  } catch (error) {
    console.error('Booking error:', error);
    statusEl.textContent = error.message || 'Booking failed. Please try again.';
    statusEl.style.color = 'var(--accent-red)';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Booking';
  }
});

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Modal close handlers
 */
modalClose.addEventListener('click', closeBookingModal);
modalOverlay.addEventListener('click', closeBookingModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
    closeBookingModal();
  }
});

/**
 * Initialize booking system on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  fetchClasses();
  
  // Check if user has email in localStorage (simple returning user detection)
  const savedEmail = localStorage.getItem('user_email');
  if (savedEmail) {
    document.getElementById('booking-email').value = savedEmail;
  }
  
  // Save email on successful booking
  bookingForm.addEventListener('submit', () => {
    const email = document.getElementById('booking-email').value;
    if (email) {
      localStorage.setItem('user_email', email);
    }
  });
});
