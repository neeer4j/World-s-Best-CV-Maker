// Counter for dynamic form elements
let experienceCount = 0;
let educationCount = 0;
let certificationCount = 0;
let uploadedPhoto = null;

// Initialize the form with one experience and education entry
document.addEventListener('DOMContentLoaded', () => {
    addExperience();
    addEducation();
    
    // Set dark mode as default
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon();
});

// Toggle Theme Function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? null : 'light';
    
    // Change theme immediately (before animation)
    if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    updateThemeIcon();
    
    // Save preference
    localStorage.setItem('theme', newTheme || 'dark');
    
    // Get the position of the theme toggle button
    const toggleButton = document.querySelector('.theme-toggle');
    const rect = toggleButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Set CSS custom properties for bloom position
    document.documentElement.style.setProperty('--bloom-x', `${x}px`);
    document.documentElement.style.setProperty('--bloom-y', `${y}px`);
    
    // Add transitioning class to trigger bloom animation
    document.body.classList.add('theme-transitioning');
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 600);
}

// Update Theme Icon
function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (currentTheme === 'light') {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '☀️';
    }
}

// Handle Photo Upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedPhoto = e.target.result;
        
        // Show preview
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.innerHTML = `<img src="${uploadedPhoto}" alt="Profile Photo">`;
        
        // Show remove button
        document.getElementById('removePhotoBtn').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Remove Photo
function removePhoto() {
    uploadedPhoto = null;
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = '<span class="photo-placeholder">📷</span>';
    document.getElementById('photoInput').value = '';
    document.getElementById('removePhotoBtn').style.display = 'none';
}

// Add Work Experience Entry
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.id = `experience-${experienceCount}`;
    
    experienceItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeElement('experience-${experienceCount}')">×</button>
        <input type="text" class="job-title" placeholder="Job Title">
        <input type="text" class="company" placeholder="Company Name">
        <input type="text" class="job-location" placeholder="Location">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <input type="text" class="start-date" placeholder="Start Date (e.g., Jan 2020)">
            <input type="text" class="end-date" placeholder="End Date (e.g., Present)">
        </div>
        <textarea class="job-description" placeholder="Describe your responsibilities and achievements. Use bullet points with - or •" rows="4"></textarea>
    `;
    
    container.appendChild(experienceItem);
    experienceCount++;
}

// Add Education Entry
function addEducation() {
    const container = document.getElementById('educationContainer');
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.id = `education-${educationCount}`;
    
    educationItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeElement('education-${educationCount}')">×</button>
        <input type="text" class="degree" placeholder="Degree/Qualification">
        <input type="text" class="school" placeholder="School/University">
        <input type="text" class="edu-location" placeholder="Location">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <input type="text" class="grad-date" placeholder="Graduation Date (e.g., May 2020)">
            <input type="text" class="gpa" placeholder="GPA (Optional)">
        </div>
    `;
    
    container.appendChild(educationItem);
    educationCount++;
}

// Add Certification Entry
function addCertification() {
    const container = document.getElementById('certificationContainer');
    const certificationItem = document.createElement('div');
    certificationItem.className = 'certification-item';
    certificationItem.id = `certification-${certificationCount}`;
    
    certificationItem.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeElement('certification-${certificationCount}')">×</button>
        <input type="text" class="cert-name" placeholder="Certification Name">
        <input type="text" class="cert-issuer" placeholder="Issuing Organization">
        <input type="text" class="cert-date" placeholder="Date Obtained (e.g., Dec 2023)">
    `;
    
    container.appendChild(certificationItem);
    certificationCount++;
}

// Remove Element
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.remove();
    }
}

// Clear Form
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        // Clear all input fields
        document.querySelectorAll('input, textarea').forEach(field => {
            field.value = '';
        });
        
        // Clear photo
        removePhoto();
        
        // Reset dynamic sections
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        document.getElementById('certificationContainer').innerHTML = '';
        
        // Reset counters
        experienceCount = 0;
        educationCount = 0;
        certificationCount = 0;
        
        // Re-add initial entries
        addExperience();
        addEducation();
        
        // Clear preview
        document.getElementById('cvPreview').innerHTML = '<p class="placeholder-text">Your CV preview will appear here. Fill in the form and click "Generate Preview".</p>';
    }
}

// Generate CV Preview
function generatePreview() {
    // Get personal information
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const portfolio = document.getElementById('portfolio').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const skills = document.getElementById('skills').value.trim();
    
    // Start building CV HTML
    let cvHTML = '';
    
    // Only show header if at least name is provided
    if (fullName || email || phone || location || linkedin || portfolio || uploadedPhoto) {
        cvHTML += `
        <div class="cv-header">
            ${uploadedPhoto ? `<div class="cv-photo"><img src="${uploadedPhoto}" alt="Profile Photo"></div>` : ''}
            <div class="cv-header-content">
                ${fullName ? `<div class="cv-name">${escapeHtml(fullName)}</div>` : ''}
                <div class="cv-contact">
                    ${email ? `<span>${escapeHtml(email)}</span>` : ''}
                    ${phone ? `<span>${email ? '|' : ''}</span><span>${escapeHtml(phone)}</span>` : ''}
                    ${location ? `<span>${email || phone ? '|' : ''}</span><span>${escapeHtml(location)}</span>` : ''}
                    ${linkedin ? `<br><span>${escapeHtml(linkedin)}</span>` : ''}
                    ${portfolio ? `<span>${linkedin ? ' | ' : ''}</span><span>${escapeHtml(portfolio)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
    }
    
    // Professional Summary
    if (summary) {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Professional Summary</div>
                <div class="cv-summary">${escapeHtml(summary)}</div>
            </div>
        `;
    }
    
    // Work Experience
    const experiences = document.querySelectorAll('.experience-item');
    if (experiences.length > 0) {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Work Experience</div>
        `;
        
        experiences.forEach(exp => {
            const jobTitle = exp.querySelector('.job-title').value.trim();
            const company = exp.querySelector('.company').value.trim();
            const jobLocation = exp.querySelector('.job-location').value.trim();
            const startDate = exp.querySelector('.start-date').value.trim();
            const endDate = exp.querySelector('.end-date').value.trim();
            const description = exp.querySelector('.job-description').value.trim();
            
            if (jobTitle && company) {
                cvHTML += `
                    <div class="cv-experience-item">
                        <div class="cv-job-title">${escapeHtml(jobTitle)}</div>
                        <div class="cv-company">${escapeHtml(company)}${jobLocation ? ', ' + escapeHtml(jobLocation) : ''}</div>
                        <div class="cv-date">${escapeHtml(startDate)} - ${escapeHtml(endDate)}</div>
                        ${description ? `<div class="cv-description">${formatBulletPoints(description)}</div>` : ''}
                    </div>
                `;
            }
        });
        
        cvHTML += `</div>`;
    }
    
    // Education
    const educations = document.querySelectorAll('.education-item');
    if (educations.length > 0) {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Education</div>
        `;
        
        educations.forEach(edu => {
            const degree = edu.querySelector('.degree').value.trim();
            const school = edu.querySelector('.school').value.trim();
            const eduLocation = edu.querySelector('.edu-location').value.trim();
            const gradDate = edu.querySelector('.grad-date').value.trim();
            const gpa = edu.querySelector('.gpa').value.trim();
            
            if (degree && school) {
                cvHTML += `
                    <div class="cv-education-item">
                        <div class="cv-degree">${escapeHtml(degree)}</div>
                        <div class="cv-school">${escapeHtml(school)}${eduLocation ? ', ' + escapeHtml(eduLocation) : ''}</div>
                        <div class="cv-date">${escapeHtml(gradDate)}${gpa ? ' | GPA: ' + escapeHtml(gpa) : ''}</div>
                    </div>
                `;
            }
        });
        
        cvHTML += `</div>`;
    }
    
    // Skills
    if (skills) {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Skills</div>
                <div class="cv-skills">${escapeHtml(skills)}</div>
            </div>
        `;
    }
    
    // Certifications
    const certifications = document.querySelectorAll('.certification-item');
    if (certifications.length > 0) {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Certifications</div>
        `;
        
        certifications.forEach(cert => {
            const certName = cert.querySelector('.cert-name').value.trim();
            const certIssuer = cert.querySelector('.cert-issuer').value.trim();
            const certDate = cert.querySelector('.cert-date').value.trim();
            
            if (certName && certIssuer) {
                cvHTML += `
                    <div class="cv-certification-item">
                        <div class="cv-job-title">${escapeHtml(certName)}</div>
                        <div class="cv-company">${escapeHtml(certIssuer)}${certDate ? ' | ' + escapeHtml(certDate) : ''}</div>
                    </div>
                `;
            }
        });
        
        cvHTML += `</div>`;
    }
    
    // Update preview
    document.getElementById('cvPreview').innerHTML = cvHTML;
}

// Format bullet points in descriptions
function formatBulletPoints(text) {
    // Split by newlines and format each line
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 1) {
        return escapeHtml(lines[0]);
    }
    
    let formattedText = '<ul>';
    lines.forEach(line => {
        // Remove existing bullet markers (-, •, *, etc.)
        const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
        if (cleanLine) {
            formattedText += `<li>${escapeHtml(cleanLine)}</li>`;
        }
    });
    formattedText += '</ul>';
    
    return formattedText;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Download CV as PDF
function downloadPDF() {
    const cvPreview = document.getElementById('cvPreview');
    
    // Check if CV has been generated
    if (cvPreview.querySelector('.placeholder-text')) {
        alert('Please generate a CV preview first before downloading.');
        return;
    }
    
    const fullName = document.getElementById('fullName').value.trim() || 'CV';
    const filename = `${fullName.replace(/\s+/g, '_')}_CV.pdf`;
    
    // Create a clone for PDF generation
    const clonedPreview = cvPreview.cloneNode(true);
    
    // Apply white background and black text styles for PDF
    clonedPreview.style.background = '#fff';
    clonedPreview.style.color = '#000';
    clonedPreview.style.padding = '20px';
    
    // Ensure all text is black in the cloned version
    clonedPreview.querySelectorAll('[class*="cv-"]').forEach(el => {
        if (el.classList.contains('cv-name') || 
            el.classList.contains('cv-section-title') ||
            el.classList.contains('cv-job-title') ||
            el.classList.contains('cv-degree')) {
            el.style.color = '#000';
        } else if (el.classList.contains('cv-contact') ||
                   el.classList.contains('cv-company') ||
                   el.classList.contains('cv-school') ||
                   el.classList.contains('cv-date')) {
            el.style.color = '#333';
        } else {
            el.style.color = '#000';
        }
    });
    
    // PDF options for A4 format
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'cm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
    
    // Generate and download PDF
    html2pdf().set(opt).from(clonedPreview).save();
}
