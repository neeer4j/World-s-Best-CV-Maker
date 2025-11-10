// Counter for dynamic form elements
let experienceCount = 0;
let educationCount = 0;
let certificationCount = 0;
let uploadedPhoto = null;
let fontSizeMultiplier = 1.0; // Default font size multiplier (100%)

// Initialize the form with one experience and education entry
document.addEventListener('DOMContentLoaded', () => {
    addExperience();
    addEducation();
    
    // Set dark mode as default
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon();
    
    // Make first section expanded, others collapsed for compact view
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach((header, index) => {
        if (index !== 0) {
            // Collapse all sections except the first one
            const content = header.nextElementSibling;
            if (content && content.classList.contains('form-content')) {
                content.classList.add('collapsed');
            }
        }
    });
    
    // Add Enter key navigation to all input fields
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Don't submit on Enter for textarea (allow line breaks)
            if (event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            event.preventDefault();
            
            // Get all form inputs (text, email, tel, url, textarea)
            const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea'));
            const currentIndex = allInputs.indexOf(event.target);
            
            // Move to next input or first input if at end
            if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
                allInputs[currentIndex + 1].focus();
            } else if (currentIndex === allInputs.length - 1) {
                // At the end, go back to first input
                allInputs[0].focus();
            }
        }
    });
});

// Toggle form section collapse/expand
function toggleSection(headerElement) {
    const content = headerElement.nextElementSibling;
    if (content && content.classList.contains('form-content')) {
        content.classList.toggle('collapsed');
    }
}

// Toggle link name field visibility
function toggleLinkName(fieldType) {
    const checkbox = document.getElementById(fieldType + 'Link');
    const linkNameField = document.getElementById(fieldType + 'LinkName');
    
    if (checkbox.checked) {
        linkNameField.style.display = 'block';
        linkNameField.focus();
    } else {
        linkNameField.style.display = 'none';
        linkNameField.value = '';
    }
}

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
        
        // Clear preview pages
        document.getElementById('cvPage1').innerHTML = '<p class="placeholder-text">Your CV preview will appear here. Fill in the form and click "Generate Preview".</p>';
        document.getElementById('cvPage2').innerHTML = '';
        document.getElementById('paginationControls').style.display = 'none';
    }
}

// Load Sample CV
function loadSampleCV() {
    // Store the current photo input value to preserve it
    const photoInputElement = document.getElementById('photoInput');
    
    // Personal Information (but skip photo input field)
    document.getElementById('fullName').value = 'MICHAEL HARRIS';
    document.getElementById('titleLine').value = 'Digital Marketing | SEO | SEM | Content Marketing';
    document.getElementById('email').value = 'michael.harris@email.com';
    document.getElementById('phone').value = '+1 (555) 123-4567';
    document.getElementById('location').value = 'Sydney, Australia';
    document.getElementById('linkedin').value = 'linkedin.com/in/michaelharris';
    document.getElementById('portfolio').value = 'www.michaelharris.com';
    
    // DO NOT reset photo - let user add/change photo independently
    // Photo input is preserved to allow user to upload after loading sample
    
    // Professional Summary
    document.getElementById('summary').value = 'Results-driven Digital Marketing professional with 8+ years of experience in developing and executing strategic marketing campaigns. Proven expertise in SEO, SEM, and content marketing with a track record of increasing organic traffic by 250% and reducing acquisition costs by 35%. Passionate about leveraging data-driven insights to drive business growth and enhance customer engagement.';
    
    // Clear and add work experience
    document.getElementById('experienceContainer').innerHTML = '';
    experienceCount = 0;
    
    addExperience();
    let exp1 = document.querySelector('.experience-item');
    exp1.querySelector('.job-title').value = 'Senior Digital Marketing Manager';
    exp1.querySelector('.company').value = 'Tech Solutions Inc.';
    exp1.querySelector('.job-location').value = 'Sydney, NSW';
    exp1.querySelector('.start-date').value = 'Mar 2021';
    exp1.querySelector('.end-date').value = 'Present';
    exp1.querySelector('.job-description').value = '- Led a team of 5 marketing professionals in executing multi-channel campaigns\n- Increased organic search traffic by 250% through comprehensive SEO strategy\n- Managed $500K+ annual marketing budget with 35% improvement in ROI\n- Developed and implemented content marketing strategy resulting in 40% lead increase';
    
    addExperience();
    let exp2 = document.querySelectorAll('.experience-item')[1];
    exp2.querySelector('.job-title').value = 'Digital Marketing Specialist';
    exp2.querySelector('.company').value = 'Creative Digital Agency';
    exp2.querySelector('.job-location').value = 'Melbourne, VIC';
    exp2.querySelector('.start-date').value = 'Jun 2018';
    exp2.querySelector('.end-date').value = 'Feb 2021';
    exp2.querySelector('.job-description').value = '- Executed SEM campaigns for 20+ clients, averaging 45% improvement in conversion rates\n- Optimized Google Ads and Facebook campaigns achieving $2M+ in revenue\n- Created SEO strategy for B2B clients resulting in top 3 rankings for 15+ keywords\n- Managed social media accounts with 150K+ combined followers';
    
    // Clear and add education
    document.getElementById('educationContainer').innerHTML = '';
    educationCount = 0;
    
    addEducation();
    let edu1 = document.querySelector('.education-item');
    edu1.querySelector('.degree').value = 'Bachelor of Business (Marketing)';
    edu1.querySelector('.school').value = 'University of Sydney';
    edu1.querySelector('.edu-location').value = 'Sydney, NSW';
    edu1.querySelector('.grad-date').value = 'Nov 2018';
    edu1.querySelector('.gpa').value = '3.8/4.0';
    
    addEducation();
    let edu2 = document.querySelectorAll('.education-item')[1];
    edu2.querySelector('.degree').value = 'Diploma in Digital Marketing';
    edu2.querySelector('.school').value = 'Google Digital Garage';
    edu2.querySelector('.edu-location').value = 'Online';
    edu2.querySelector('.grad-date').value = 'Aug 2017';
    edu2.querySelector('.gpa').value = '';
    
    // Skills
    document.getElementById('skills').value = 'SEO, SEM, Google Ads, Facebook Ads, Content Marketing, Email Marketing, Analytics, Data Analysis, Google Analytics, CRM, Copywriting, Brand Strategy, Social Media Management, A/B Testing, Marketing Automation, HTML, CSS, WordPress';
    
    // Clear and add certifications
    document.getElementById('certificationContainer').innerHTML = '';
    certificationCount = 0;
    
    addCertification();
    let cert1 = document.querySelector('.certification-item');
    cert1.querySelector('.cert-name').value = 'Google Ads Search Certification';
    cert1.querySelector('.cert-issuer').value = 'Google';
    cert1.querySelector('.cert-date').value = 'Mar 2024';
    
    addCertification();
    let cert2 = document.querySelectorAll('.certification-item')[1];
    cert2.querySelector('.cert-name').value = 'HubSpot Inbound Marketing Certification';
    cert2.querySelector('.cert-issuer').value = 'HubSpot Academy';
    cert2.querySelector('.cert-date').value = 'Jan 2024';
    
    addCertification();
    let cert3 = document.querySelectorAll('.certification-item')[2];
    cert3.querySelector('.cert-name').value = 'SEMrush SEO Fundamentals';
    cert3.querySelector('.cert-issuer').value = 'SEMrush Academy';
    cert3.querySelector('.cert-date').value = 'Nov 2023';
    
    // Generate preview
    generatePreview();
}

// Generate CV Preview
function generatePreview() {
    // Get personal information
    const fullName = document.getElementById('fullName').value.trim();
    const titleLine = document.getElementById('titleLine').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const portfolio = document.getElementById('portfolio').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const skills = document.getElementById('skills').value.trim();
    
    // Collect all sections with their data
    const sections = [];
    
    // Professional Summary
    if (summary) {
        sections.push({
            type: 'summary',
            title: 'Professional Summary',
            content: summary
        });
    }
    
    // Work Experience
    const experiences = [];
    document.querySelectorAll('.experience-item').forEach(exp => {
        const jobTitle = exp.querySelector('.job-title').value.trim();
        const company = exp.querySelector('.company').value.trim();
        const jobLocation = exp.querySelector('.job-location').value.trim();
        const startDate = exp.querySelector('.start-date').value.trim();
        const endDate = exp.querySelector('.end-date').value.trim();
        const description = exp.querySelector('.job-description').value.trim();
        
        if (jobTitle && company) {
            experiences.push({
                jobTitle, company, jobLocation, startDate, endDate, description
            });
        }
    });
    
    if (experiences.length > 0) {
        sections.push({
            type: 'experience',
            title: 'Work Experience',
            items: experiences
        });
    }
    
    // Education
    const educations = [];
    document.querySelectorAll('.education-item').forEach(edu => {
        const degree = edu.querySelector('.degree').value.trim();
        const school = edu.querySelector('.school').value.trim();
        const eduLocation = edu.querySelector('.edu-location').value.trim();
        const gradDate = edu.querySelector('.grad-date').value.trim();
        const gpa = edu.querySelector('.gpa').value.trim();
        
        if (degree && school) {
            educations.push({
                degree, school, eduLocation, gradDate, gpa
            });
        }
    });
    
    if (educations.length > 0) {
        sections.push({
            type: 'education',
            title: 'Education',
            items: educations
        });
    }
    
    // Skills
    if (skills) {
        sections.push({
            type: 'skills',
            title: 'Skills',
            content: skills
        });
    }
    
    // Certifications
    const certifications = [];
    document.querySelectorAll('.certification-item').forEach(cert => {
        const certName = cert.querySelector('.cert-name').value.trim();
        const certIssuer = cert.querySelector('.cert-issuer').value.trim();
        const certDate = cert.querySelector('.cert-date').value.trim();
        
        if (certName && certIssuer) {
            certifications.push({
                certName, certIssuer, certDate
            });
        }
    });
    
    if (certifications.length > 0) {
        sections.push({
            type: 'certifications',
            title: 'Certifications',
            items: certifications
        });
    }
    
    // Start building CV HTML
    let cvHTML = '';
    
    // Header with photo
    cvHTML += `
        <div class="cv-header">
    `;
    
    // Add photo if uploaded
    if (uploadedPhoto) {
        cvHTML += `<div class="cv-photo-display"><img src="${uploadedPhoto}" alt="Profile Photo" style="width: 70px; height: 90px; border-radius: 3px; margin-bottom: 8px; object-fit: cover;"></div>`;
    }
    
    cvHTML += `
            ${fullName ? `<div class="cv-name">${escapeHtml(fullName)}</div>` : ''}
            ${titleLine ? `<div class="cv-title-line">${escapeHtml(titleLine)}</div>` : ''}
            <div class="cv-contact">
    `;
    
    // Get link preferences
    const linkedinLink = document.getElementById('linkedinLink').checked;
    const portfolioLink = document.getElementById('portfolioLink').checked;
    const linkedinLinkName = document.getElementById('linkedinLinkName').value.trim();
    const portfolioLinkName = document.getElementById('portfolioLinkName').value.trim();
    
    // Build contact info on single line with pipes
    const contactParts = [];
    if (location) contactParts.push(escapeHtml(location));
    if (email) contactParts.push(escapeHtml(email));
    if (phone) contactParts.push(escapeHtml(phone));
    
    // Handle LinkedIn with optional link
    if (linkedin) {
        if (linkedinLink && linkedinLinkName) {
            contactParts.push(`<a href="${escapeHtml(linkedin)}" style="color: #000; text-decoration: underline;">${escapeHtml(linkedinLinkName)}</a>`);
        } else {
            contactParts.push(escapeHtml(linkedin));
        }
    }
    
    // Handle Portfolio with optional link
    if (portfolio) {
        if (portfolioLink && portfolioLinkName) {
            contactParts.push(`<a href="${escapeHtml(portfolio)}" style="color: #000; text-decoration: underline;">${escapeHtml(portfolioLinkName)}</a>`);
        } else {
            contactParts.push(escapeHtml(portfolio));
        }
    }
    
    if (contactParts.length > 0) {
        cvHTML += contactParts.join(' | ');
    }
    
    cvHTML += `
            </div>
        </div>
    `;
    
    // Build all sections as continuous content (no artificial page splitting)
    sections.forEach((section) => {
        cvHTML += `
            <div class="cv-section">
                <div class="cv-section-title">${escapeHtml(section.title)}</div>
        `;
        
        switch(section.type) {
            case 'summary':
                cvHTML += `<div class="cv-summary">${escapeHtml(section.content)}</div>`;
                break;
                
            case 'experience':
                section.items.forEach(exp => {
                    cvHTML += `
                        <div class="cv-experience-item">
                            <div class="cv-job-title">${escapeHtml(exp.jobTitle)}</div>
                            <div class="cv-company">${escapeHtml(exp.company)}${exp.jobLocation ? ', ' + escapeHtml(exp.jobLocation) : ''}</div>
                            <div class="cv-date">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</div>
                            ${exp.description ? `<div class="cv-description">${formatBulletPoints(exp.description)}</div>` : ''}
                        </div>
                    `;
                });
                break;
                
            case 'education':
                section.items.forEach(edu => {
                    cvHTML += `
                        <div class="cv-education-item">
                            <div class="cv-degree">${escapeHtml(edu.degree)}</div>
                            <div class="cv-school">${escapeHtml(edu.school)}${edu.eduLocation ? ', ' + escapeHtml(edu.eduLocation) : ''}</div>
                            <div class="cv-date">${escapeHtml(edu.gradDate)}${edu.gpa ? ' | GPA: ' + escapeHtml(edu.gpa) : ''}</div>
                        </div>
                    `;
                });
                break;
                
            case 'skills':
                cvHTML += `<div class="cv-skills">${escapeHtml(section.content)}</div>`;
                break;
                
            case 'certifications':
                section.items.forEach(cert => {
                    cvHTML += `
                        <div class="cv-certification-item">
                            <div class="cv-job-title">${escapeHtml(cert.certName)}</div>
                            <div class="cv-company">${escapeHtml(cert.certIssuer)}${cert.certDate ? ' | ' + escapeHtml(cert.certDate) : ''}</div>
                        </div>
                    `;
                });
                break;
        }
        
        cvHTML += `</div>`;
    });
    
    // Update preview - show all content on page 1, hide page 2 controls
    document.getElementById('cvPage1').innerHTML = cvHTML || '<p class="placeholder-text">Please fill in at least some information to preview your CV.</p>';
    document.getElementById('cvPage2').innerHTML = '';
    document.getElementById('paginationControls').style.display = 'none';
    
    // Apply dynamic font sizing based on content
    applyDynamicFontSize();
    
    // Scroll to preview section smoothly
    setTimeout(() => {
        const previewSection = document.querySelector('.preview-section');
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Dynamic font sizing based on content length
function applyDynamicFontSize() {
    const cvPage1 = document.getElementById('cvPage1');
    
    // Calculate content metrics
    const experienceItems = document.querySelectorAll('.experience-item').length;
    const educationItems = document.querySelectorAll('.education-item').length;
    const certificationItems = document.querySelectorAll('.certification-item').length;
    const summaryLength = document.getElementById('summary').value.trim().length;
    const skillsLength = document.getElementById('skills').value.trim().length;
    
    // Calculate total bullet points in descriptions
    let totalBulletPoints = 0;
    document.querySelectorAll('.job-description').forEach(desc => {
        const lines = desc.value.trim().split('\n').filter(line => line.trim() !== '');
        totalBulletPoints += lines.length;
    });
    
    // Content score calculation (higher = more content)
    const contentScore = 
        (experienceItems * 100) + 
        (educationItems * 50) + 
        (certificationItems * 30) + 
        (summaryLength / 5) + 
        (skillsLength / 5) +
        (totalBulletPoints * 40);
    
    // Remove existing size classes
    cvPage1.classList.remove('cv-compact', 'cv-normal', 'cv-dense');
    
    // Apply appropriate class based on content score
    if (contentScore < 800) {
        cvPage1.classList.add('cv-compact'); // Large fonts for sparse content
    } else if (contentScore < 1500) {
        cvPage1.classList.add('cv-normal'); // Normal fonts
    } else {
        cvPage1.classList.add('cv-dense'); // Smaller fonts for dense content
    }
    
    // Apply manual font size multiplier
    applyFontSizeMultiplier();
}

// Handle manual font size adjustment
function handleFontSizeChange(value) {
    fontSizeMultiplier = value / 100;
    document.getElementById('fontSizeValue').textContent = value;
    
    // Reapply font size multiplier if preview exists
    const cvPage1 = document.getElementById('cvPage1');
    if (cvPage1 && cvPage1.innerHTML.trim() !== '') {
        applyFontSizeMultiplier();
    }
}

// Apply font size multiplier to the CV preview
function applyFontSizeMultiplier() {
    const cvPage1 = document.getElementById('cvPage1');
    if (!cvPage1) return;
    
    // Apply the multiplier using CSS custom property
    cvPage1.style.setProperty('--font-size-multiplier', fontSizeMultiplier);
}

// Show specific CV page
function showCVPage(pageNum) {
    const page1 = document.getElementById('cvPage1');
    const page2 = document.getElementById('cvPage2');
    const btn1 = document.querySelectorAll('.page-btn')[0];
    const btn2 = document.querySelectorAll('.page-btn')[1];
    
    if (pageNum === 1) {
        page1.style.display = 'block';
        page2.style.display = 'none';
        btn1.classList.add('active');
        btn2.classList.remove('active');
    } else {
        page1.style.display = 'none';
        page2.style.display = 'block';
        btn1.classList.remove('active');
        btn2.classList.add('active');
    }
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
    const cvPage1 = document.getElementById('cvPage1');
    
    // Check if CV has been generated
    if (cvPage1.querySelector('.placeholder-text')) {
        alert('Please generate a CV preview first before downloading.');
        return;
    }
    
    // Use browser's print dialog which is much more reliable
    window.print();
}
